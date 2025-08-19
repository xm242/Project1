from flask import Blueprint, jsonify, request
import requests
import numpy as np
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression

COINGECKO_API = "https://api.coingecko.com/api/v3"

def fetch_coingecko_prices(coin: str = "bitcoin", vs: str = "usd", days: int = 30):
    """
    Returns (labels, prices) for the last `days` days from CoinGecko.
    labels: list of 'YYYY-MM-DD'
    prices: list of floats
    """
    url = f"{COINGECKO_API}/coins/{coin}/market_chart"
    params = {
        "vs_currency": vs,
        "days": days,
        "interval": "daily",
        "precision": 2,
    }
    # A UA header helps avoid some 403 responses
    headers = {"Accept": "application/json", "User-Agent": "Project1/0.1"}
    r = requests.get(url, params=params, headers=headers, timeout=10)
    r.raise_for_status()

    data = r.json()
    points = data.get("prices", [])  # [[timestamp_ms, price], ...]
    if not points:
        raise ValueError("No 'prices' in CoinGecko response")

    labels = [datetime.utcfromtimestamp(ts / 1000).date().isoformat() for ts, _ in points]
    prices = [float(p) for _, p in points]
    return labels, prices


predict = Blueprint("predict", __name__)

@predict.route("/predict", methods=["GET"])
def handle_predict():
    """
    GET /predict?coin=bitcoin&vs=usd&days=30
    Trains a simple linear model on last N days of real prices
    and predicts the next day.
    """
    coin = request.args.get("coin", "bitcoin")     # e.g. 'bitcoin', 'ethereum'
    vs   = request.args.get("vs", "usd")
    days = int(request.args.get("days", 30))

    try:
        labels, prices = fetch_coingecko_prices(coin, vs, days)
    except requests.HTTPError as e:
        # CoinGecko can rate-limit (HTTP 429). Frontend can show this nicely.
        return jsonify({"error": f"CoinGecko HTTP error: {e.response.status_code}"}), 502
    except Exception as e:
        return jsonify({"error": str(e)}), 502

    y = np.array(prices, dtype=float)
    X = np.arange(len(y)).reshape(-1, 1)

    model = LinearRegression().fit(X, y)
    next_price = float(model.predict(np.array([[len(y)]]))[0])

    # next label = day after the last label
    last_date = datetime.fromisoformat(labels[-1])
    next_label = (last_date + timedelta(days=1)).date().isoformat()

    return jsonify({
        "coin": coin,
        "vs": vs,
        "labels": labels,        # historical date strings
        "history": y.tolist(),   # historical prices
        "prediction": next_price,
        "nextLabel": next_label,
    })
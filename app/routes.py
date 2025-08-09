from flask import Blueprint, jsonify
import requests
import numpy as np
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression

# Health check (ping)
ping = Blueprint('ping', __name__)

@ping.route('/ping', methods=['GET'])
def handle_ping():
    return jsonify({"message": "pong"})


price = Blueprint('price', __name__)


@price.route('/price', methods=['GET'])
def handle_price():
    response = requests.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd'
    )
    data = response.json()
    return jsonify({
        "BTC": data['bitcoin']['usd'],
        "ETH": data['ethereum']['usd']
    })



predict = Blueprint('predict', __name__)

@predict.route('/predict', methods=['GET'])
def handle_predict():
    """
    Train a linear regression model on mock 'last 30 days' prices
    and predict the next day.
    """
    np.random.seed(42)  # stable demo
    days = 30
    start_price = 30000.0

    # create synthetic, slightly trending historical series
    prices = [start_price]
    for i in range(1, days):
        step = np.random.normal(loc=20.0, scale=120.0)  # small drift + noise
        prices.append(prices[-1] + step)

    prices = np.array(prices, dtype=float)

    # labels (last 30 dates)
    today = datetime.utcnow().date()
    labels = [(today - timedelta(days=(days - 1 - i))).isoformat() for i in range(days)]

    # Fit linear regression: y ~ index
    X = np.arange(days).reshape(-1, 1)
    y = prices
    model = LinearRegression().fit(X, y)

    # predict next day (index=days)
    next_price = float(model.predict(np.array([[days]]))[0])

    return jsonify({
        "labels": labels,              # 30 date strings
        "history": prices.tolist(),    # 30 prices
        "prediction": next_price,      # next-day forecast
        "nextLabel": (today + timedelta(days=1)).isoformat()
    })
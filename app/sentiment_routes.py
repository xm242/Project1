from flask import Blueprint, jsonify, request
import requests
from datetime import datetime
from textblob import TextBlob

sentiment = Blueprint("sentiment", __name__)

# --- Simple headline fetchers ---
def get_reddit_headlines(limit: int = 20):
    """
    Pull latest headlines from r/CryptoCurrency (hot). Reddit has a JSON endpoint.
    """
    url = "https://www.reddit.com/r/CryptoCurrency/hot.json"
    headers = {"User-Agent": "Project1-Sentiment/0.1"}
    params = {"limit": min(max(limit, 1), 50)}
    r = requests.get(url, headers=headers, params=params, timeout=10)
    r.raise_for_status()
    data = r.json()
    posts = data.get("data", {}).get("children", [])
    titles = [p["data"]["title"] for p in posts if "data" in p and "title" in p["data"]]
    return titles

def get_coindesk_headlines(limit: int = 20):
    """
    Fallback source: use CoinDesk's frontpage JSON (unofficial & may change).
    If this 404s in the future, keep reddit as default or switch to an RSS parser.
    """
    url = "https://www.coindesk.com/pf/api/v3/content/fetch/frontpage"
    r = requests.get(url, timeout=10)
    r.raise_for_status()
    data = r.json()
    # The structure can vary; be defensive:
    items = data.get("items", []) or []
    titles = [item.get("headline") for item in items if item.get("headline")]
    return titles[:limit]

def analyze_titles(titles):
    """
    Return per-headline polarity in [-1, 1], plus an overall index in [0, 100].
    """
    scored = []
    for t in titles:
        # TextBlob polarity is in [-1, 1]
        polarity = float(TextBlob(t).sentiment.polarity)
        scored.append({"title": t, "polarity": polarity})

    if not scored:
        return {"headlines": [], "avg_polarity": 0.0, "index": 50}

    avg = sum(x["polarity"] for x in scored) / len(scored)
    # Map [-1, 1] to [0, 100]
    index = int(round((avg + 1.0) * 50.0))
    return {"headlines": scored, "avg_polarity": avg, "index": index}

@sentiment.route("/sentiment", methods=["GET"])
def handle_sentiment():
    """
    GET /sentiment?source=reddit&limit=20
    Response:
      {
        "source": "...",
        "fetched_at": "2025-08-09T16:22:00",
        "index": 67,              // 0..100
        "avg_polarity": 0.34,     // -1..1
        "label": "Bullish",       // string label
        "headlines": [{"title": "...", "polarity": 0.12}, ...]
      }
    """
    source = request.args.get("source", "reddit").lower()
    limit = int(request.args.get("limit", 20))

    try:
        if source == "coindesk":
            titles = get_coindesk_headlines(limit)
        else:
            # default and most stable:
            titles = get_reddit_headlines(limit)

        result = analyze_titles(titles)

        # Friendly label for the UI
        idx = result["index"]
        if idx >= 70:
            label = "Very Bullish 🟢"
        elif idx >= 60:
            label = "Bullish 🟩"
        elif idx >= 40:
            label = "Neutral 🟨"
        elif idx >= 30:
            label = "Bearish 🟥"
        else:
            label = "Very Bearish 🔴"

        return jsonify({
            "source": source,
            "fetched_at": datetime.utcnow().isoformat(),
            "index": result["index"],
            "avg_polarity": result["avg_polarity"],
            "label": label,
            "headlines": result["headlines"],
        })
    except requests.HTTPError as e:
        return jsonify({"error": f"Upstream error: {e.response.status_code}"}), 502
    except Exception as e:
        return jsonify({"error": str(e)}), 500


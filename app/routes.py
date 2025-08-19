from flask import Blueprint, jsonify
import requests

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



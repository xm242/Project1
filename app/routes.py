from flask import Blueprint, jsonify

ping = Blueprint('ping', __name__)

@ping.route('/ping', methods=['GET'])
def handle_ping():
    return jsonify({"message": "pong"})
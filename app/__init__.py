from flask import Flask
from app.routes import ping
from flask_cors import CORS
from app.routes import ping, price

def create_app():
    app = Flask(__name__)
    CORS(app)
    # Register Blueprints
    app.register_blueprint(ping) 
    app.register_blueprint(price)
    return app


from flask import Flask
from flask_cors import CORS
from app.routes import ping, price, predict

def create_app():
    app = Flask(__name__)
    CORS(app)
    # Register Blueprints
    app.register_blueprint(ping) 
    app.register_blueprint(price)
    app.register_blueprint(predict)
    return app


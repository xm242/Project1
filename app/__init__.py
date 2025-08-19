from flask import Flask
from flask_cors import CORS
from app.routes import ping, price
from app.predict_routes import predict
from app.sentiment_routes import sentiment

def create_app():
    app = Flask(__name__)
    CORS(app)
    # Register Blueprints
    app.register_blueprint(ping) 
    app.register_blueprint(price)
    app.register_blueprint(predict)
    app.register_blueprint(sentiment)

    return app


from flask import Flask
from app.routes import ping
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(ping) 
    return app
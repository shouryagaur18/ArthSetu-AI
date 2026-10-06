from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from models.database import init_db

# Import blueprints
from routes.auth import auth_bp
from routes.schemes import schemes_bp
from routes.calculator import calculator_bp
from routes.partners import partners_bp
from routes.applications import applications_bp
from routes.ai import ai_bp
from routes.learn import learn_bp

app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS for frontend integration
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Register REST blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(schemes_bp)
app.register_blueprint(calculator_bp)
app.register_blueprint(partners_bp)
app.register_blueprint(applications_bp)
app.register_blueprint(ai_bp)
app.register_blueprint(learn_bp)

@app.route('/')
def health_check():
    return jsonify({
        "status": "healthy",
        "product": "ArthSetu AI Backend Service",
        "version": "1.0.0-SIH26092",
        "tagline": "Right Scheme. Right Support. Right Path.",
        "endpoints": [
            "/api/auth/login",
            "/api/schemes",
            "/api/schemes/match",
            "/api/calculator",
            "/api/partners/nearby",
            "/api/applications/route",
            "/api/ai/extract",
            "/api/learn"
        ]
    })

if __name__ == '__main__':
    # Initialize database tables and seed data
    init_db()
    print("[SERVER] ArthSetu AI Backend server running on http://127.0.0.1:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)

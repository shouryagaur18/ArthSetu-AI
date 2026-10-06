import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'arthsetu_ai_hackathon_secret_2026')
    DATABASE_PATH = os.path.join(os.path.dirname(__file__), 'arthsetu.db')
    JSON_SORT_KEYS = False
    DEBUG = True

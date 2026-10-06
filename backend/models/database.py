import sqlite3
import json
import os
from config import Config

def get_db_connection():
    conn = sqlite3.connect(Config.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Create tables
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            name TEXT NOT NULL,
            user_type TEXT NOT NULL,
            age INTEGER,
            gender TEXT,
            state TEXT,
            district TEXT,
            social_category TEXT,
            annual_family_income REAL,
            education_level TEXT,
            current_student_status TEXT,
            bpl_status TEXT,
            purpose TEXT,
            business_type TEXT,
            project_cost REAL,
            loan_required REAL,
            preferred_tenure_years INTEGER,
            profile_completion INTEGER DEFAULT 80,
            partner_id TEXT
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS schemes (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            code TEXT,
            category_type TEXT,
            description TEXT,
            purpose TEXT,
            target_categories TEXT,
            min_age INTEGER,
            max_age INTEGER,
            income_limit REAL,
            education_requirements TEXT,
            min_loan REAL,
            max_loan REAL,
            interest_rate REAL,
            moratorium_months INTEGER,
            tenure_years INTEGER,
            eligible_states TEXT,
            eligible_business_types TEXT,
            required_documents TEXT,
            official_application_url TEXT,
            partner_types TEXT
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS partners (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            address TEXT,
            city TEXT,
            state TEXT,
            latitude REAL,
            longitude REAL,
            supported_schemes TEXT,
            fund_utilization_percentage REAL,
            fund_capacity_status TEXT,
            npa_status TEXT,
            overdue_percentage REAL,
            routing_status TEXT,
            restriction_reason TEXT,
            contact_phone TEXT,
            contact_email TEXT,
            branch_code TEXT
        )
    ''')

    cursor.execute('''
        CREATE TABLE IF NOT EXISTS applications (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            scheme_id TEXT NOT NULL,
            partner_id TEXT NOT NULL,
            applicant_name TEXT NOT NULL,
            applicant_phone TEXT,
            purpose TEXT,
            business_type TEXT,
            project_cost REAL,
            loan_amount REAL,
            interest_rate REAL,
            status TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    conn.commit()

    # Seed data if empty
    data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')

    # Seed schemes
    cursor.execute("SELECT COUNT(*) FROM schemes")
    if cursor.fetchone()[0] == 0:
        schemes_file = os.path.join(data_dir, 'schemes.json')
        if os.path.exists(schemes_file):
            with open(schemes_file, 'r', encoding='utf-8') as f:
                schemes_data = json.load(f)
                for s in schemes_data:
                    cursor.execute('''
                        INSERT INTO schemes (
                            id, name, code, category_type, description, purpose,
                            target_categories, min_age, max_age, income_limit,
                            education_requirements, min_loan, max_loan, interest_rate,
                            moratorium_months, tenure_years, eligible_states,
                            eligible_business_types, required_documents, official_application_url, partner_types
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        s['id'], s['name'], s['code'], s['category_type'], s['description'], s['purpose'],
                        json.dumps(s['target_categories']), s['min_age'], s['max_age'], s['income_limit'],
                        json.dumps(s['education_requirements']), s['min_loan'], s['max_loan'], s['interest_rate'],
                        s['moratorium_months'], s['tenure_years'], json.dumps(s['eligible_states']),
                        json.dumps(s['eligible_business_types']), json.dumps(s['required_documents']),
                        s['official_application_url'], json.dumps(s['partner_types'])
                    ))

    # Seed partners
    cursor.execute("SELECT COUNT(*) FROM partners")
    if cursor.fetchone()[0] == 0:
        partners_file = os.path.join(data_dir, 'partners.json')
        if os.path.exists(partners_file):
            with open(partners_file, 'r', encoding='utf-8') as f:
                partners_data = json.load(f)
                for p in partners_data:
                    cursor.execute('''
                        INSERT INTO partners (
                            id, name, type, address, city, state, latitude, longitude,
                            supported_schemes, fund_utilization_percentage, fund_capacity_status,
                            npa_status, overdue_percentage, routing_status, restriction_reason,
                            contact_phone, contact_email, branch_code
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        p['id'], p['name'], p['type'], p['address'], p['city'], p['state'],
                        p['latitude'], p['longitude'], json.dumps(p['supported_schemes']),
                        p['fund_utilization_percentage'], p['fund_capacity_status'], p['npa_status'],
                        p['overdue_percentage'], p['routing_status'], p.get('restriction_reason', ''),
                        p['contact_phone'], p['contact_email'], p['branch_code']
                    ))

    # Seed users
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        users_file = os.path.join(data_dir, 'users.json')
        if os.path.exists(users_file):
            with open(users_file, 'r', encoding='utf-8') as f:
                users_data = json.load(f)
                for u in users_data:
                    cursor.execute('''
                        INSERT INTO users (
                            id, email, password, name, user_type, age, gender, state, district,
                            social_category, annual_family_income, education_level,
                            current_student_status, bpl_status, purpose, business_type,
                            project_cost, loan_required, preferred_tenure_years, profile_completion, partner_id
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ''', (
                        u['id'], u['email'], u['password'], u['name'], u['user_type'],
                        u.get('age'), u.get('gender'), u.get('state'), u.get('district'),
                        u.get('social_category'), u.get('annual_family_income'), u.get('education_level'),
                        u.get('current_student_status'), u.get('bpl_status'), u.get('purpose'),
                        u.get('business_type'), u.get('project_cost'), u.get('loan_required'),
                        u.get('preferred_tenure_years'), u.get('profile_completion', 80), u.get('partner_id')
                    ))

    # Seed initial application if none exists
    cursor.execute("SELECT COUNT(*) FROM applications")
    if cursor.fetchone()[0] == 0:
        cursor.execute('''
            INSERT INTO applications (
                id, user_id, scheme_id, partner_id, applicant_name, applicant_phone,
                purpose, business_type, project_cost, loan_amount, interest_rate, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            'AS-1024', 'user-rahul-sharma', 'nsfdc-sdis', 'partner-bank-01',
            'Rahul Sharma', '+91 9876543210', 'Business', 'Tailoring',
            400000.0, 300000.0, 6.0, 'Routed to Partner'
        ))

    conn.commit()
    conn.close()

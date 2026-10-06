from flask import Blueprint, request, jsonify
from models.database import get_db_connection
import uuid

applications_bp = Blueprint('applications', __name__)

@applications_bp.route('/api/applications', methods=['GET', 'POST', 'OPTIONS'])
def get_applications():
    if request.method == 'OPTIONS':
        return jsonify({"success": True}), 200

    user_id = request.args.get('user_id', 'user-rahul-sharma')

    conn = get_db_connection()
    rows = conn.execute('''
        SELECT a.*, s.name as scheme_name, p.name as partner_name, p.type as partner_type, p.address as partner_address
        FROM applications a
        LEFT JOIN schemes s ON a.scheme_id = s.id
        LEFT JOIN partners p ON a.partner_id = p.id
        WHERE a.user_id = ? OR ? = 'all'
        ORDER BY a.created_at DESC
    ''', (user_id, user_id)).fetchall()
    conn.close()

    apps = []
    for r in rows:
        d = dict(r)
        d['timeline'] = [
            {"step": "Profile Completed", "completed": True, "date": "Step 1"},
            {"step": "Scheme Matched", "completed": True, "date": "Step 2"},
            {"step": "Financial Plan Created", "completed": True, "date": "Step 3"},
            {"step": "Partner Selected", "completed": True, "date": "Step 4"},
            {"step": "Application Routed", "completed": True, "date": "Step 5"}
        ]
        apps.append(d)

    return jsonify({"success": True, "count": len(apps), "applications": apps})

@applications_bp.route('/api/applications/route', methods=['GET', 'POST', 'OPTIONS'])
def route_application():
    if request.method == 'OPTIONS':
        return jsonify({"success": True}), 200

    if request.method == 'GET':
        user_id = request.args.get('user_id', 'user-rahul-sharma')
        scheme_id = request.args.get('scheme_id', 'nsfdc-sdis')
        partner_id = request.args.get('partner_id', 'partner-bank-01')
        applicant_name = request.args.get('applicant_name', 'Rahul Sharma')
        applicant_phone = request.args.get('applicant_phone', '+91 9876543210')
        purpose = request.args.get('purpose', 'Tailoring Business')
        business_type = request.args.get('business_type', 'Tailoring')
        project_cost = float(request.args.get('project_cost', 400000))
        loan_amount = float(request.args.get('loan_amount', 300000))
        interest_rate = float(request.args.get('interest_rate', 6.0))
    else:
        data = request.json or {}
        user_id = data.get('user_id', 'user-rahul-sharma')
        scheme_id = data.get('scheme_id', 'nsfdc-sdis')
        partner_id = data.get('partner_id', 'partner-bank-01')
        applicant_name = data.get('applicant_name', 'Rahul Sharma')
        applicant_phone = data.get('applicant_phone', '+91 9876543210')
        purpose = data.get('purpose', 'Tailoring Business')
        business_type = data.get('business_type', 'Tailoring')
        project_cost = float(data.get('project_cost', 400000))
        loan_amount = float(data.get('loan_amount', 300000))
        interest_rate = float(data.get('interest_rate', 6.0))

    app_id = f"AS-{uuid.uuid4().hex[:4].upper()}"

    conn = get_db_connection()
    conn.execute('''
        INSERT INTO applications (
            id, user_id, scheme_id, partner_id, applicant_name, applicant_phone,
            purpose, business_type, project_cost, loan_amount, interest_rate, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        app_id, user_id, scheme_id, partner_id, applicant_name, applicant_phone,
        purpose, business_type, project_cost, loan_amount, interest_rate, 'Routed to Partner'
    ))
    conn.commit()

    partner = conn.execute("SELECT * FROM partners WHERE id = ?", (partner_id,)).fetchone()
    scheme = conn.execute("SELECT * FROM schemes WHERE id = ?", (scheme_id,)).fetchone()
    conn.close()

    return jsonify({
        "success": True,
        "application_id": app_id,
        "status": "Routed to Partner",
        "applicant_name": applicant_name,
        "scheme_name": scheme['name'] if scheme else scheme_id,
        "partner_name": partner['name'] if partner else partner_id,
        "partner_type": partner['type'] if partner else "Channel Partner",
        "loan_amount": loan_amount,
        "message": "Application routing successfully initiated to eligible partner branch.",
        "timeline": [
            {"step": "Profile Completed", "completed": True},
            {"step": "Scheme Matched", "completed": True},
            {"step": "Financial Plan Created", "completed": True},
            {"step": "Partner Selected", "completed": True},
            {"step": "Application Routed", "completed": True}
        ]
    })

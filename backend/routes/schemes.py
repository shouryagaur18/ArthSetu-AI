from flask import Blueprint, request, jsonify
from models.database import get_db_connection
from services.matching_service import calculate_scheme_match
import json

schemes_bp = Blueprint('schemes', __name__)

def parse_scheme_row(row):
    d = dict(row)
    for field in ['target_categories', 'education_requirements', 'eligible_states', 'eligible_business_types', 'required_documents', 'partner_types']:
        if d.get(field):
            try:
                d[field] = json.loads(d[field])
            except Exception:
                pass
    return d

@schemes_bp.route('/api/schemes', methods=['GET', 'POST', 'OPTIONS'])
def get_schemes():
    if request.method == 'OPTIONS':
        return jsonify({"success": True}), 200

    category = request.args.get('category')
    purpose = request.args.get('purpose')

    conn = get_db_connection()
    query = "SELECT * FROM schemes WHERE 1=1"
    params = []

    if category and category != 'All':
        query += " AND category_type = ?"
        params.append(category)

    if purpose and purpose != 'All':
        query += " AND purpose = ?"
        params.append(purpose)

    rows = conn.execute(query, params).fetchall()
    conn.close()

    schemes = [parse_scheme_row(r) for r in rows]
    return jsonify({"success": True, "count": len(schemes), "schemes": schemes})

@schemes_bp.route('/api/schemes/<scheme_id>', methods=['GET', 'POST', 'OPTIONS'])
def get_scheme_detail(scheme_id):
    if request.method == 'OPTIONS':
        return jsonify({"success": True}), 200

    conn = get_db_connection()
    row = conn.execute("SELECT * FROM schemes WHERE id = ?", (scheme_id,)).fetchone()
    conn.close()

    if not row:
        return jsonify({"success": False, "message": "Scheme not found"}), 404

    return jsonify({"success": True, "scheme": parse_scheme_row(row)})

@schemes_bp.route('/api/schemes/match', methods=['GET', 'POST', 'OPTIONS'])
def match_schemes():
    if request.method == 'OPTIONS':
        return jsonify({"success": True}), 200

    if request.method == 'GET':
        profile = {
            "social_category": request.args.get('social_category', 'SC'),
            "annual_family_income": float(request.args.get('annual_family_income', 320000)),
            "purpose": request.args.get('purpose', 'Business'),
            "loan_required": float(request.args.get('loan_required', 300000))
        }
    else:
        profile = request.json or {}

    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM schemes").fetchall()
    conn.close()

    matched_schemes = []
    for r in rows:
        scheme = parse_scheme_row(r)
        match_result = calculate_scheme_match(profile, scheme)
        matched_schemes.append({
            **scheme,
            "match_score": match_result["match_score"],
            "satisfied_conditions": match_result["satisfied_conditions"],
            "needs_verification": match_result["needs_verification"],
            "disclaimer": "This is a recommendation score, not a final government eligibility decision."
        })

    matched_schemes = sorted(matched_schemes, key=lambda x: x["match_score"], reverse=True)

    return jsonify({
        "success": True,
        "total_matched": len(matched_schemes),
        "user_profile": profile,
        "schemes": matched_schemes
    })

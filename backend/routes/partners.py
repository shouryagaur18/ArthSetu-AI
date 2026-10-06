from flask import Blueprint, request, jsonify
from models.database import get_db_connection
from services.routing_service import get_routed_partner_pool, evaluate_partner_routing
import json

partners_bp = Blueprint('partners', __name__)

def parse_partner_row(row):
    d = dict(row)
    if d.get('supported_schemes'):
        try:
            d['supported_schemes'] = json.loads(d['supported_schemes'])
        except Exception:
            pass
    return d

def safe_float(val, default):
    try:
        if val is None or val == '':
            return default
        return float(val)
    except (ValueError, TypeError):
        return default

@partners_bp.route('/api/partners', methods=['GET'])
def get_partners():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM partners").fetchall()
    conn.close()

    partners = [parse_partner_row(r) for r in rows]
    return jsonify({"success": True, "count": len(partners), "partners": partners})

@partners_bp.route('/api/partners/nearby', methods=['GET', 'POST'])
def get_nearby_partners():
    if request.method == 'POST':
        data = request.json or {}
        scheme_id = data.get('scheme_id')
        user_lat = safe_float(data.get('latitude'), 26.85)
        user_lon = safe_float(data.get('longitude'), 80.94)
    else:
        scheme_id = request.args.get('scheme_id')
        user_lat = safe_float(request.args.get('latitude'), 26.85)
        user_lon = safe_float(request.args.get('longitude'), 80.94)

    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM partners").fetchall()
    conn.close()

    raw_partners = [parse_partner_row(r) for r in rows]
    routed_pool = get_routed_partner_pool(raw_partners, scheme_id, user_lat, user_lon)

    eligible_count = len([p for p in routed_pool if p['routing_status'] == 'Eligible'])
    restricted_count = len([p for p in routed_pool if p['routing_status'] == 'Restricted'])

    return jsonify({
        "success": True,
        "scheme_id": scheme_id,
        "user_coordinates": {"latitude": user_lat, "longitude": user_lon},
        "total_partners": len(routed_pool),
        "eligible_partners_count": eligible_count,
        "restricted_partners_count": restricted_count,
        "partners": routed_pool,
        "disclaimer": "Live routing evaluates nodal capacity, fund availability, and channel compliance status."
    })

@partners_bp.route('/api/partners/<partner_id>', methods=['GET'])
def get_partner_detail(partner_id):
    scheme_id = request.args.get('scheme_id')
    user_lat = safe_float(request.args.get('latitude'), 26.85)
    user_lon = safe_float(request.args.get('longitude', 80.94))

    conn = get_db_connection()
    row = conn.execute("SELECT * FROM partners WHERE id = ?", (partner_id,)).fetchone()
    conn.close()

    if not row:
        return jsonify({"success": False, "message": "Partner not found"}), 404

    partner = parse_partner_row(row)
    evaluated = evaluate_partner_routing(partner, scheme_id, user_lat, user_lon)

    return jsonify({"success": True, "partner": evaluated})

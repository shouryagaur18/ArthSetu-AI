from flask import Blueprint, request, jsonify
from services.ai_service import extract_requirements_from_text, generate_ai_explanation

ai_bp = Blueprint('ai', __name__)

@ai_bp.route('/api/ai/extract', methods=['GET', 'POST', 'OPTIONS'])
def extract_requirement():
    if request.method == 'OPTIONS':
        return jsonify({"success": True}), 200

    if request.method == 'GET':
        prompt_text = request.args.get('prompt', 'I want 3 lakh loan for tailoring business in Lucknow')
    else:
        data = request.json or {}
        prompt_text = data.get('prompt', '')

    if not prompt_text.strip():
        prompt_text = 'I want 3 lakh loan for tailoring business in Lucknow'

    extracted = extract_requirements_from_text(prompt_text)

    return jsonify({
        "success": True,
        "raw_prompt": prompt_text,
        "extracted_data": extracted,
        "summary": f"Extracted requirement: ₹{extracted['loan_required']:,.0f} for {extracted['business_type']} in {extracted['location']}."
    })

@ai_bp.route('/api/ai/explain', methods=['GET', 'POST', 'OPTIONS'])
def explain_scheme():
    if request.method == 'OPTIONS':
        return jsonify({"success": True}), 200

    if request.method == 'GET':
        scheme_name = request.args.get('scheme_name', 'Concessional Credit Scheme')
        user_profile = {}
        match_score = int(request.args.get('match_score', 90))
    else:
        data = request.json or {}
        scheme_name = data.get('scheme_name', 'Concessional Credit Scheme')
        user_profile = data.get('user_profile', {})
        match_score = data.get('match_score', 90)

    explanation = generate_ai_explanation(scheme_name, user_profile, match_score)

    return jsonify({
        "success": True,
        "scheme_name": scheme_name,
        "explanation": explanation
    })

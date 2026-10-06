from flask import Blueprint, request, jsonify
from services.calculator_service import calculate_loan_schedule

calculator_bp = Blueprint('calculator', __name__)

@calculator_bp.route('/api/calculator', methods=['GET', 'POST', 'OPTIONS'])
def calculate():
    if request.method == 'OPTIONS':
        return jsonify({"success": True}), 200

    if request.method == 'GET':
        loan_amount = float(request.args.get('loan_amount', 300000))
        interest_rate = float(request.args.get('interest_rate', 6.0))
        tenure_years = int(request.args.get('tenure_years', 5))
        moratorium_months = int(request.args.get('moratorium_months', 6))
        scheme_max_loan = request.args.get('scheme_max_loan')
    else:
        data = request.json or {}
        loan_amount = data.get('loan_amount', 300000)
        interest_rate = data.get('interest_rate', 6.0)
        tenure_years = data.get('tenure_years', 5)
        moratorium_months = data.get('moratorium_months', 6)
        scheme_max_loan = data.get('scheme_max_loan')

    result = calculate_loan_schedule(
        loan_amount=loan_amount,
        annual_interest_rate=interest_rate,
        tenure_years=tenure_years,
        moratorium_months=moratorium_months,
        scheme_max_loan=scheme_max_loan
    )

    return jsonify({"success": True, "data": result})

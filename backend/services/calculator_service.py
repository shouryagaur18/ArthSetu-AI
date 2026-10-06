import math

def calculate_loan_schedule(loan_amount, annual_interest_rate, tenure_years, moratorium_months, scheme_max_loan=None):
    """
    Calculates EMI, moratorium schedule, interest breakdown, and total payment.
    Enforces maximum loan limit validation.
    """
    try:
        loan_amount = float(loan_amount) if loan_amount is not None else 300000.0
        annual_interest_rate = float(annual_interest_rate) if annual_interest_rate is not None else 6.0
        tenure_years = int(tenure_years) if tenure_years is not None else 5
        moratorium_months = int(moratorium_months) if moratorium_months is not None else 6
    except (ValueError, TypeError):
        return {
            "error": True,
            "message": "Invalid input numbers provided for calculation."
        }

    if scheme_max_loan and loan_amount > float(scheme_max_loan):
        return {
            "error": True,
            "message": f"Requested amount (₹{loan_amount:,.0f}) exceeds the applicable scheme limit of ₹{float(scheme_max_loan):,.0f}."
        }

    monthly_rate = (annual_interest_rate / 100) / 12
    total_months = tenure_years * 12
    repayment_months = total_months - moratorium_months

    if repayment_months <= 0:
        return {
            "error": True,
            "message": "Repayment tenure must be longer than moratorium period."
        }

    # Moratorium interest calculation (simple interest accrued during moratorium, if applicable)
    moratorium_interest = loan_amount * monthly_rate * moratorium_months

    # Standard EMI formula for post-moratorium period
    # EMI = P * r * (1+r)^n / ((1+r)^n - 1)
    if monthly_rate > 0:
        emi = (loan_amount * monthly_rate * math.pow(1 + monthly_rate, repayment_months)) / (math.pow(1 + monthly_rate, repayment_months) - 1)
    else:
        emi = loan_amount / repayment_months

    total_repayment = (emi * repayment_months) + moratorium_interest
    total_interest = total_repayment - loan_amount

    # Build year-by-year amortization curve for visual charts
    yearly_schedule = []
    balance = loan_amount
    accumulated_interest = 0
    accumulated_principal = 0

    # Moratorium year breakdown
    m_years = math.ceil(moratorium_months / 12)
    for y in range(1, tenure_years + 1):
        year_principal = 0
        year_interest = 0

        for m in range(1, 13):
            current_month = (y - 1) * 12 + m
            if current_month <= moratorium_months:
                # During moratorium: no principal repaid, interest accrues or paid as concessional
                m_int = balance * monthly_rate
                year_interest += m_int
                accumulated_interest += m_int
            elif balance > 0:
                # Repayment phase
                m_int = balance * monthly_rate
                m_prin = emi - m_int
                if m_prin > balance:
                    m_prin = balance
                balance -= m_prin
                year_principal += m_prin
                year_interest += m_int
                accumulated_principal += m_prin
                accumulated_interest += m_int

        yearly_schedule.append({
            "year": f"Year {y}",
            "principal": round(accumulated_principal, 2),
            "interest": round(accumulated_interest, 2),
            "remaining_balance": round(max(0, balance), 2)
        })

    return {
        "error": False,
        "loan_amount": loan_amount,
        "interest_rate": annual_interest_rate,
        "tenure_years": tenure_years,
        "moratorium_months": moratorium_months,
        "estimated_emi": round(emi, 2),
        "total_interest": round(total_interest, 2),
        "total_repayment": round(total_repayment, 2),
        "moratorium_interest": round(moratorium_interest, 2),
        "yearly_schedule": yearly_schedule,
        "disclaimer": "EMI shown is an estimate based on selected scheme parameters. Actual repayment terms may vary depending on nodal bank approval."
    }

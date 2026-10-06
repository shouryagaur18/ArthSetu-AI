import json

def calculate_scheme_match(user_profile, scheme):
    """
    Evaluates profile against scheme criteria with transparent 100-point system.
    """
    score = 0
    satisfied = []
    warnings = []

    # Parse JSON fields if necessary
    target_categories = scheme['target_categories'] if isinstance(scheme['target_categories'], list) else json.loads(scheme['target_categories'])
    education_reqs = scheme['education_requirements'] if isinstance(scheme['education_requirements'], list) else json.loads(scheme['education_requirements'])
    eligible_states = scheme['eligible_states'] if isinstance(scheme['eligible_states'], list) else json.loads(scheme['eligible_states'])
    eligible_business_types = scheme['eligible_business_types'] if isinstance(scheme['eligible_business_types'], list) else json.loads(scheme['eligible_business_types'])

    # 1. Social Category Match (20 pts)
    user_category = user_profile.get('social_category', 'General')
    if 'All' in target_categories or 'General' in target_categories or user_category in target_categories:
        score += 20
        satisfied.append(f"Social Category '{user_category}' satisfies scheme target group ({', '.join(target_categories)})")
    else:
        warnings.append(f"Scheme specifically targets categories: {', '.join(target_categories)}")

    # 2. Income Condition Match (20 pts)
    try:
        user_income = float(user_profile.get('annual_family_income') or 0)
    except (ValueError, TypeError):
        user_income = 0.0
    scheme_income_limit = float(scheme['income_limit'])
    if user_income <= scheme_income_limit:
        score += 20
        satisfied.append(f"Family income ₹{user_income:,.0f} is within limit (₹{scheme_income_limit:,.0f})")
    else:
        warnings.append(f"Income ₹{user_income:,.0f} exceeds scheme limit ₹{scheme_income_limit:,.0f}")

    # 3. Purpose Match (20 pts)
    user_purpose = str(user_profile.get('purpose') or 'Business')
    scheme_purpose = str(scheme['purpose'])
    if user_purpose.lower() == scheme_purpose.lower():
        score += 20
        satisfied.append(f"Required purpose '{user_purpose}' matches scheme core focus ({scheme_purpose})")
    else:
        warnings.append(f"Scheme purpose is '{scheme_purpose}' while requested is '{user_purpose}'")

    # 4. Age Eligibility (10 pts)
    try:
        user_age = int(user_profile.get('age') or 25)
    except (ValueError, TypeError):
        user_age = 25
    min_age = int(scheme['min_age'])
    max_age = int(scheme['max_age'])
    if min_age <= user_age <= max_age:
        score += 10
        satisfied.append(f"Age {user_age} falls between allowed range ({min_age} - {max_age} years)")
    else:
        warnings.append(f"Applicant age {user_age} outside scheme bounds ({min_age} - {max_age})")

    # 5. Loan Amount within Limit (15 pts)
    try:
        user_loan = float(user_profile.get('loan_required') or 0)
    except (ValueError, TypeError):
        user_loan = 0.0
    min_loan = float(scheme['min_loan'])
    max_loan = float(scheme['max_loan'])
    if min_loan <= user_loan <= max_loan:
        score += 15
        satisfied.append(f"Requested loan ₹{user_loan:,.0f} within allowable scheme limits (₹{min_loan:,.0f} - ₹{max_loan:,.0f})")
    elif user_loan < min_loan:
        score += 8
        warnings.append(f"Loan amount ₹{user_loan:,.0f} below scheme minimum ₹{min_loan:,.0f}")
    else:
        warnings.append(f"Loan amount ₹{user_loan:,.0f} exceeds maximum scheme limit ₹{max_loan:,.0f}")

    # 6. Education Qualification (10 pts)
    user_edu = user_profile.get('education_level', 'Graduate')
    if 'None' in education_reqs or user_edu in education_reqs or any(e in user_edu for e in ['Graduate', 'Class 10+', 'Class 12+']):
        score += 10
        satisfied.append(f"Education level '{user_edu}' meets qualification criteria")
    else:
        warnings.append(f"Verification needed for educational qualification: {', '.join(education_reqs)}")

    # 7. State & Business Type Match (5 pts)
    user_state = user_profile.get('state', 'Uttar Pradesh')
    user_biz = user_profile.get('business_type', 'Tailoring')
    state_match = 'All' in eligible_states or user_state in eligible_states
    biz_match = 'All' in eligible_business_types or any(b.lower() in user_biz.lower() for b in eligible_business_types)
    
    if state_match and biz_match:
        score += 5
        satisfied.append(f"Location ({user_state}) and enterprise type ({user_biz}) eligible")
    elif state_match:
        score += 3
        satisfied.append(f"Location ({user_state}) eligible")
        warnings.append(f"Enterprise type '{user_biz}' requires nodal review")
    else:
        warnings.append(f"State '{user_state}' requires verification with local channelizing agency")

    # Required verification documents warning
    req_docs = scheme['required_documents'] if isinstance(scheme['required_documents'], list) else json.loads(scheme['required_documents'])
    warnings.append(f"Verification of {len(req_docs)} required documents (Aadhaar, Income Certificate, etc.) during partner verification")

    return {
        "match_score": min(100, score),
        "satisfied_conditions": satisfied,
        "needs_verification": warnings
    }

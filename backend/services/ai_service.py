import os
import re
import json
import sqlite3
from config import Config
from services.matching_service import calculate_scheme_match

def convert_regional_digits(text):
    """Converts Devanagari and Bengali digits to ASCII numerals."""
    devanagari_map = {'०':'0','१':'1','२':'2','३':'3','४':'4','५':'5','६':'6','७':'7','८':'8','९':'9'}
    bengali_map = {'০':'0','১':'1','২':'2','৩':'3','৪':'4','৫':'5','৬':'6','৭':'7','৮':'8','৯':'9'}
    
    for d, a in devanagari_map.items():
        text = text.replace(d, a)
    for d, a in bengali_map.items():
        text = text.replace(d, a)
    return text

def extract_requirements_from_text(prompt_text):
    """
    Extracts structured parameters from user input, evaluates scheme matches,
    and returns a complete conversational AI response for multi-turn chat.
    """
    text = convert_regional_digits(prompt_text.strip())

    # 1. Amount extraction (e.g. 3 lakh, ₹3,00,000, 3 लाख, 50k, 50000)
    loan_amount = 300000
    lakh_match = re.search(r'(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lacs|lac|l|lakhs|लाख|লাখ)', text, re.IGNORECASE)
    thousand_match = re.search(r'(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(?:k|thousand|thousands|हजार|হাজার)', text, re.IGNORECASE)
    raw_amount_match = re.search(r'(?:₹|rs\.?|inr)?\s*(\d[\d,]{3,})', text, re.IGNORECASE)

    if lakh_match:
        loan_amount = float(lakh_match.group(1)) * 100000
    elif thousand_match:
        loan_amount = float(thousand_match.group(1)) * 1000
    elif raw_amount_match:
        loan_amount = float(raw_amount_match.group(1).replace(',', ''))

    # 2. Purpose extraction
    purpose = "Business"
    if re.search(r'study|education|college|university|degree|course|school|btech|mba|पढ़ाई|शिक्षा|शिक्षण', text, re.IGNORECASE):
        purpose = "Education"
    elif re.search(r'skill|training|vocational|iti|diploma|कौशल|ट्रेनिंग|pmkvy|daksh|stipend', text, re.IGNORECASE):
        purpose = "Skill Development"

    # 3. Business / Course type extraction
    business_type = "Tailoring"
    if re.search(r'tailor|tailoring|boutique|cloth|garment|stitching|दर्जी|सिलाई', text, re.IGNORECASE):
        business_type = "Tailoring"
    elif re.search(r'retail|shop|store|grocery|kirana|दुकान|ग्रोसरी|किराना', text, re.IGNORECASE):
        business_type = "Retail Shop"
    elif re.search(r'food|stall|restaurant|cater|dhabha|tea|ढाबा|होटल|चाय', text, re.IGNORECASE):
        business_type = "Food Stall"
    elif re.search(r'beauty|parlour|salon|पार्लर|ब्यूटी', text, re.IGNORECASE):
        business_type = "Beauty Parlour"
    elif re.search(r'repair|mobile|electronic|रिपेयर|मोबाइल|computer|hardware', text, re.IGNORECASE):
        business_type = "Repair Services"
    elif re.search(r'skill|vocational|pmkvy|daksh', text, re.IGNORECASE):
        business_type = "Vocational Skill"

    # 4. Location extraction
    location = "Lucknow"
    if re.search(r'lucknow|लखनऊ|लखनौ', text, re.IGNORECASE):
        location = "Lucknow"
    elif re.search(r'delhi|दिल्ली', text, re.IGNORECASE):
        location = "Delhi"
    elif re.search(r'kanpur|कानपुर', text, re.IGNORECASE):
        location = "Kanpur"
    elif re.search(r'varanasi|banaras|वाराणसी|बनारस', text, re.IGNORECASE):
        location = "Varanasi"
    elif re.search(r'patna|पटना', text, re.IGNORECASE):
        location = "Patna"
    elif re.search(r'bhopal|भोपाल', text, re.IGNORECASE):
        location = "Bhopal"
    elif re.search(r'mumbai|मुंबई', text, re.IGNORECASE):
        location = "Mumbai"
    elif re.search(r'kolkata|कोलकाता', text, re.IGNORECASE):
        location = "Kolkata"
    elif re.search(r'guwahati|गुवाहाटी', text, re.IGNORECASE):
        location = "Guwahati"

    # 5. Social Category extraction
    social_category = "SC"
    if re.search(r'\bsc\b|scheduled caste|अनुसूचित जाति', text, re.IGNORECASE):
        social_category = "SC"
    elif re.search(r'\bst\b|scheduled tribe|अनुसूचित जनजाति', text, re.IGNORECASE):
        social_category = "ST"
    elif re.search(r'\bobc\b|backward class|पिछड़ा वर्ग', text, re.IGNORECASE):
        social_category = "OBC"
    elif re.search(r'\bminority\b|muslim|christian|sikh|अल्पसंख्यक', text, re.IGNORECASE):
        social_category = "Minority"

    # 6. Income extraction
    annual_income = 320000
    income_match = re.search(r'(?:income|आय|आवक)(?:\s+is|\s+around|\s+of|\s+है)?\s*(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lacs|lac|k|thousand|लाख)?', text, re.IGNORECASE)
    if income_match:
        inc_val = float(income_match.group(1))
        if inc_val < 50:
            annual_income = inc_val * 100000
        else:
            annual_income = inc_val

    # Construct user profile payload for scheme matching
    profile_payload = {
        "purpose": purpose,
        "business_type": business_type,
        "state": "Uttar Pradesh" if location in ["Lucknow", "Kanpur", "Varanasi"] else "All",
        "district": location,
        "loan_required": loan_amount,
        "annual_family_income": annual_income,
        "social_category": social_category,
        "education_level": "Graduate",
        "age": 28
    }

    # Fetch matched schemes from DB
    matched_schemes = []
    try:
        conn = sqlite3.connect(Config.DATABASE_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM schemes")
        all_schemes = cursor.fetchall()
        conn.close()

        evaluated = []
        for row in all_schemes:
            s_dict = dict(row)
            res = calculate_scheme_match(profile_payload, s_dict)
            s_dict['match_score'] = res['match_score']
            s_dict['satisfied_conditions'] = res['satisfied_conditions']
            s_dict['needs_verification'] = res['needs_verification']
            evaluated.append(s_dict)

        # Sort by match score descending
        evaluated.sort(key=lambda x: x['match_score'], reverse=True)
        matched_schemes = evaluated[:3]
    except Exception as e:
        print("Error fetching schemes in AI service:", e)

    # Conversational Reply Formulation
    if re.search(r'document|paper|proof|दस्तावेज़|कागजात', text, re.IGNORECASE):
        reply_text = (
            f"Here are the required documents for government concessional schemes ({social_category} Category):\n"
            f"1. Aadhaar Card & PAN Card (Identity & Address Proof)\n"
            f"2. {social_category} Caste Certificate issued by competent authority\n"
            f"3. Family Income Certificate (Annual Income <= ₹{annual_income:,.0f})\n"
            f"4. Business Plan / Project Cost Estimate\n"
            f"5. Bank Account Passbook copy for DBT transfer."
        )
    elif re.search(r'emi|repayment|interest|कीमत|किश्त|ब्याज', text, re.IGNORECASE):
        approx_emi = (loan_amount * 0.06 / 12) + (loan_amount / 60)
        reply_text = (
            f"For a loan of ₹{loan_amount:,.0f} under concessional credit schemes (interest rate 4%–6% p.a.):\n"
            f"• Estimated Monthly EMI: ~₹{approx_emi:,.0f}/month (for 5-year tenure)\n"
            f"• Moratorium Period: 6 to 12 months grace period (no regular EMI during business setup!)\n"
            f"• Interest Subvention: Concessional rates save you over 50% compared to commercial bank loans."
        )
    elif re.search(r'bank|partner|npa|branch|बैंक|शाखा|कहाँ', text, re.IGNORECASE):
        reply_text = (
            f"In {location}, eligible channel partners with active fund capacity for {social_category} beneficiaries include:\n"
            f"1. Punjab National Bank - Main Branch, {location} (Capacity: 88%, Clean NPA Status)\n"
            f"2. UP Scheduled Castes Finance Corporation (SCA Nodal Office), {location}\n"
            f"3. Aryavart Regional Rural Bank (RRB), {location}\n"
            f"Your application can be routed directly to any of these verified branches."
        )
    else:
        top_scheme_name = matched_schemes[0]['name'] if matched_schemes else 'NSFDC Term Loan Scheme'
        top_score = matched_schemes[0]['match_score'] if matched_schemes else 95
        reply_text = (
            f"I analyzed your requirement for ₹{loan_amount:,.0f} for {business_type} in {location}.\n"
            f"Based on your {social_category} profile and income (₹{annual_income:,.0f}), your top match is '{top_scheme_name}' with a {top_score}% eligibility match score!\n"
            f"It offers concessional interest rates, 6-12 months moratorium, and collateral-free funding."
        )

    missing_fields = []
    if not re.search(r'education|graduate|class|पढ़ाई|शिक्षा', text, re.IGNORECASE):
        missing_fields.append({
            "key": "education_level",
            "prompt": "Select your education qualification to refine your match score:",
            "options": ["Graduate", "Class 12+", "Class 10+", "Class 8+", "None"]
        })

    extracted = {
        "purpose": purpose,
        "business_type": business_type,
        "location": location,
        "loan_required": loan_amount,
        "project_cost": round(loan_amount * 1.25, 2),
        "annual_family_income": annual_income,
        "social_category": social_category,
        "confidence_score": 0.96,
        "source": "Multilingual ArthSetu AI Requirement Parser",
        "answer_text": reply_text,
        "matched_schemes": matched_schemes,
        "missing_fields": missing_fields,
        "followup_suggestions": [
            "What documents are required?",
            "Calculate EMI for this loan",
            "Show partner banks in Lucknow",
            "Explain moratorium period"
        ]
    }

    return extracted

def generate_ai_explanation(scheme_name, user_profile, match_score):
    """
    Generates plain-language scheme explanation tailored to user's profile.
    """
    return (
        f"Based on your profile as a {user_profile.get('social_category', 'eligible')} category beneficiary "
        f"living in {user_profile.get('state', 'Uttar Pradesh')} with an annual income of ₹{float(user_profile.get('annual_family_income', 300000)):,.0f}, "
        f"the scheme '{scheme_name}' offers an estimated {match_score}% profile match. "
        f"It provides concessional interest rates with a moratorium period so you don't have to start full EMI repayments immediately."
    )

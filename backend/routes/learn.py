from flask import Blueprint, jsonify

learn_bp = Blueprint('learn', __name__)

@learn_bp.route('/api/learn', methods=['GET'])
def get_literacy_modules():
    modules = [
        {
            "id": "emi-explained",
            "category": "Lending & Interest",
            "title_en": "What is an EMI (Equated Monthly Installment)?",
            "title_hi": "ईएमआई (EMI - समान मासिक किश्त) क्या है?",
            "summary_en": "Equated Monthly Installment is a fixed payment amount made by a borrower to a bank on a specified date each calendar month.",
            "summary_hi": "ईएमआई एक निश्चित मासिक किश्त है जो उधारकर्ता द्वारा हर महीने एक तय तारीख पर बैंक को चुकाई जाती है।",
            "details_en": "An EMI consists of both principal repayment and interest accrued. In early months, interest makes up a larger portion, while in later months, principal repayment dominates.",
            "details_hi": "ईएमआई में मूलधन और ब्याज दोनों शामिल होते हैं। शुरुआती महीनों में ब्याज का हिस्सा अधिक होता है, जबकि बाद के महीनों में मूलधन का भुगतान अधिक होता है।",
            "formula_en": "EMI = [P x R x (1+R)^N] / [(1+R)^N - 1]",
            "example_en": "On a ₹3,000,000 loan at 6% p.a. for 5 years, monthly EMI is approximately ₹5,799.",
            "example_hi": "₹3,00,000 के 6% वार्षिक ब्याज दर पर 5 साल के ऋण के लिए मासिक ईएमआई लगभग ₹5,799 होगी।",
            "icon": "Calculator"
        },
        {
            "id": "interest-rates",
            "category": "Lending & Interest",
            "title_en": "What is a Concessional Interest Rate?",
            "title_hi": "रियायती ब्याज दर (Concessional Interest Rate) क्या है?",
            "summary_en": "Concessional rates are heavily subsidized interest rates (4%-6.5% p.a.) provided by apex corporations (NSFDC, NSTFDC, NBCFDC) to marginalized beneficiaries.",
            "summary_hi": "सरकारी निगमों (NSFDC, NSTFDC, NBCFDC) द्वारा पात्र लाभार्थियों को बहुत कम ब्याज दरों (4%-6.5% वार्षिक) पर ऋण प्रदान किया जाता है।",
            "details_en": "Unlike commercial bank loans charging 10%-16%, concessional loans lower the total interest burden by over 50% for SC, ST, OBC, and women entrepreneurs.",
            "details_hi": "वाणिज्यिक बैंकों (10%-16%) के विपरीत, रियायती ऋण वंचित वर्गों और महिलाओं के लिए कुल ब्याज के बोझ को 50% से अधिक कम कर देते हैं।",
            "formula_en": "Interest Saved = Commercial EMI Interest - Concessional EMI Interest",
            "example_en": "Saving ₹45,000+ in total interest over 5 years compared to normal bank loans.",
            "example_hi": "सामान्य बैंक ऋण की तुलना में 5 वर्षों में ₹45,000 से अधिक की ब्याज बचत।",
            "icon": "Percent"
        },
        {
            "id": "moratorium-period",
            "category": "Lending & Interest",
            "title_en": "What is a Moratorium / Grace Period?",
            "title_hi": "स्थगन अवधि (Moratorium Period) क्या है?",
            "summary_en": "A repayment holiday during which you do not have to pay regular EMIs, allowing your business or education to establish income first.",
            "summary_hi": "एक छूट अवधि जिसके दौरान आपको नियमित ईएमआई नहीं देनी होती है, जिससे आपके व्यवसाय या पढ़ाई को पहले स्थिर होने का समय मिलता है।",
            "details_en": "For instance, a 6-month to 12-month moratorium allows a tailoring business to install machinery, hire staff, and earn revenues before loan repayments begin.",
            "details_hi": "उदाहरण के लिए, 6 से 12 महीने का मोरेटोरियम नए व्यवसाय को मशीनरी लगाने और कमाई शुरू करने का समय देता है।",
            "formula_en": "Repayment Start Date = Loan Disbursement Date + Moratorium Months",
            "example_en": "Loan taken in January + 6-month moratorium = First EMI starts in July.",
            "example_hi": "जनवरी में ऋण + 6 महीने का मोरेटोरियम = पहली ईएमआई जुलाई में शुरू होगी।",
            "icon": "Clock"
        },
        {
            "id": "subsidy-explained",
            "category": "Lending & Interest",
            "title_en": "Capital Subsidy vs Interest Subvention",
            "title_hi": "कैपिटल सब्सिडी बनाम ब्याज सबवेंशन (Subsidy vs Subvention)",
            "summary_en": "Understand the difference between direct project cost discounts (Capital Subsidy) and reduced interest rate support (Interest Subvention).",
            "summary_hi": "परियोजना लागत में सीधी छूट (कैपिटल सब्सिडी) और ब्याज दर में सरकारी छूट (सबवेंशन) के अंतर को समझें।",
            "details_en": "Under PMEGP, beneficiaries receive 15% to 35% capital subsidy credited to their bank account after successful enterprise setup.",
            "details_hi": "PMEGP योजना के तहत, लाभार्थियों को सफल व्यवसाय स्थापित करने पर 15% से 35% तक की पूंजीगत सब्सिडी (Capital Subsidy) मिलती है।",
            "formula_en": "Net Loan Payable = Total Project Cost - Govt Subsidy Amount",
            "example_en": "On a ₹4 Lakh project under PMEGP (35% subsidy for SC in rural area), Govt pays ₹1.4 Lakh subsidy!",
            "example_hi": "₹4 लाख की परियोजना पर 35% सब्सिडी मिलने पर सरकार ₹1.4 लाख की छूट देती है!",
            "icon": "Percent"
        },
        {
            "id": "npa-explained",
            "category": "Risk & Channels",
            "title_en": "What is an NPA (Non-Performing Asset)?",
            "title_hi": "एनपीए (NPA - गैर-निष्पादित संपत्ति) और बैंक क्षमता क्या है?",
            "summary_en": "An NPA is a loan where repayments have stopped for over 90 days. Banks with high NPAs face lending restrictions.",
            "summary_hi": "एनपीए वह लोन है जिसकी किश्तें 90 दिनों से अधिक समय से रुकी हुई हैं। उच्च एनपीए वाले बैंकों पर ऋण देने की पाबंदी होती है।",
            "details_en": "ArthSetu AI checks NPA threshold compliance of local bank branches so your application is never routed to a restricted or financially paralyzed branch.",
            "details_hi": "अर्थसेतु AI स्थानीय बैंक शाखाओं के एनपीए स्तर की जांच करता है ताकि आपका आवेदन अटके नहीं।",
            "formula_en": "Gross NPA % = (Total Overdue Loans / Total Bank Loans Distributed) x 100",
            "example_en": "If a branch NPA exceeds 12%, ArthSetu AI reroutes your application to a healthier nearby bank.",
            "example_hi": "यदि किसी शाखा का NPA 12% से अधिक है, तो आवेदन दूसरी स्वस्थ निकटतम शाखा को भेजा जाता है।",
            "icon": "ShieldAlert"
        },
        {
            "id": "sca-vs-bank",
            "category": "Risk & Channels",
            "title_en": "State Channelizing Agencies (SCAs) vs Commercial Banks",
            "title_hi": "स्टेट चैनलाइजिंग एजेंसी (SCA) और बैंकों में क्या अंतर है?",
            "summary_en": "SCAs are state government corporations (e.g. UP Scheduled Castes Finance Dev Corp) that execute concessional welfare lending.",
            "summary_hi": "SCA राज्य सरकार के निगम (जैसे राज्य अनुसूचित जाति वित्त विकास निगम) हैं जो रियायती कल्याणकारी ऋण लागू करते हैं।",
            "details_en": "SCAs act as channel partners for apex corporations (NSFDC, NSTFDC, NBCFDC). Applications can be submitted through SCAs or participating public sector banks.",
            "details_hi": "SCA राष्ट्रीय निगमों के आधिकारिक चैनल पार्टनर हैं। आवेदन SCA या सरकारी बैंकों के माध्यम से दिए जा सकते हैं।",
            "formula_en": "Channel Path: Apex Govt Corp -> State Channelizing Agency (SCA) -> Beneficiary",
            "example_en": "In UP, UPSCC (UP Scheduled Castes Corp) acts as the SCA for NSFDC schemes.",
            "example_hi": "उत्तर प्रदेश में, यूपीएससीसी निगम NSFDC योजनाओं के लिए आधिकारिक SCA है।",
            "icon": "Route"
        },
        {
            "id": "cgrs-collateral",
            "category": "Scheme & Guarantee",
            "title_en": "What is Collateral-Free Loan & Credit Guarantee (CGRS)?",
            "title_hi": "बिना गारंटी ऋण (Collateral-Free) और क्रेडिट गारंटी क्या है?",
            "summary_en": "Government credit guarantee schemes (like CGTMSE / Mudra / CGRS) back your loan so you don't need to pledge land or property collateral.",
            "summary_hi": "सरकारी गारंटी योजनाएं बैंक को सुरक्षा देती हैं ताकि आपको अपनी जमीन या मकान गिरवी न रखना पड़े।",
            "details_en": "Under Mudra Kishore and NSFDC micro credit, loans up to ₹5 Lakhs to ₹10 Lakhs are 100% collateral-free with Government guarantee cover.",
            "details_hi": "मुद्रा और NSFDC माइक्रो क्रेडिट में ₹5 लाख तक के ऋण बिना किसी संपत्ति गारंटी के दिए जाते हैं।",
            "formula_en": "Collateral Required = ₹0 (Covered by Govt Credit Guarantee Fund)",
            "example_en": "No land documents needed; only Aadhaar, Caste certificate, and Business Plan required.",
            "example_hi": "किसी जमीन की रजिस्ट्री की जरूरत नहीं; केवल आधार, जाति प्रमाणपत्र और बिजनेस प्लान चाहिए।",
            "icon": "ShieldAlert"
        },
        {
            "id": "project-cost",
            "category": "Scheme & Guarantee",
            "title_en": "Project Cost vs Loan Amount & Margin Money",
            "title_hi": "कुल परियोजना लागत, ऋण राशि और मार्जिन मनी (Margin Money)",
            "summary_en": "Total project cost includes machinery, working capital, and raw materials. Margin money is the small portion paid by the beneficiary (5%-10%).",
            "summary_hi": "परियोजना लागत में मशीनरी और कच्चा माल शामिल होता है। मार्जिन मनी लाभार्थी द्वारा दी जाने वाली छोटी राशि (5%-10%) है।",
            "details_en": "If total tailoring business setup costs ₹4 Lakhs, the beneficiary contributes ₹40,000 (10% margin), and the scheme provides ₹3.6 Lakhs loan.",
            "details_hi": "यदि कुल व्यवसाय लागत ₹4 लाख है, तो लाभार्थी ₹40,000 का योगदान देता है और ₹3.6 लाख का लोन मिलता है।",
            "formula_en": "Loan Required = Total Project Cost - Beneficiary Margin Contribution",
            "example_en": "Project Cost ₹4.0 Lakh - 10% Margin (₹40,000) = Required Loan ₹3.6 Lakh.",
            "example_hi": "लागत ₹4.0 लाख - 10% मार्जिन (₹40,000) = आवश्यक लोन ₹3.6 लाख।",
            "icon": "Calculator"
        },
        {
            "id": "skill-stipend",
            "category": "Skill & Training",
            "title_en": "Skill Development Loans, NSQF & Tool-Kit Grants",
            "title_hi": "कौशल विकास ऋण, NSQF स्तर और टूल-किट ग्रांट (Skill Schemes)",
            "summary_en": "Schemes like PMKVY 4.0 and PM-DAKSH provide free vocational training, monthly stipends (₹1,000-₹1,500), and tool-kit grants.",
            "summary_hi": "PMKVY 4.0 और PM-DAKSH जैसी योजनाएं मुफ्त ट्रेनिंग, ₹1,000-₹1,500 मासिक वजीफा और टूलकिट किट देती हैं।",
            "details_en": "National Skill Qualification Framework (NSQF) levels validate your technical competence, making it easier to get self-employment loan approvals.",
            "details_hi": "NSQF स्किल सर्टिफिकेट आपको बैंक से आसान लोन दिलाने में मदद करता है।",
            "formula_en": "Skill Support = Free Training + Monthly Stipend + Tool-Kit Grant + Loan Linkage",
            "example_en": "Complete 3-month ITI electrician training -> Get ₹4,500 stipend + ₹10,000 toolkit grant + ₹1 Lakh micro loan.",
            "example_hi": "3 महीने की आईटीआई ट्रेनिंग -> ₹4,500 वजीफा + ₹10,000 टूलकिट + ₹1 लाख माइक्रो लोन।",
            "icon": "BookOpen"
        },
        {
            "id": "scheme-comparison",
            "category": "Scheme & Guarantee",
            "title_en": "How to Compare Schemes Side-by-Side?",
            "title_hi": "योजनाओं की तुलना कैसे करें?",
            "summary_en": "Evaluate schemes based on interest rates, moratorium length, required collateral, and eligibility match percentage rather than just maximum loan size.",
            "summary_hi": "केवल अधिकतम ऋण राशि के बजाय ब्याज दरों, मोरेटोरियम अवधि, आवश्यक दस्तावेजों और अपनी पात्रता स्कोर के आधार पर तुलना करें।",
            "details_en": "ArthSetu AI's side-by-side comparison matrix lets you compare up to 3 schemes transparently.",
            "details_hi": "अर्थसेतु AI का मैट्रिक्स आपको 3 योजनाओं की पारदर्शी तुलना करने की सुविधा देता है।",
            "icon": "GitCompare"
        },
        {
            "id": "partner-routing",
            "category": "Risk & Channels",
            "title_en": "What is Geo-Spatial Capacity Router?",
            "title_hi": "जियो-स्पेशियल कैपेसिटी रूटर (Geo-Spatial Router) क्या है?",
            "summary_en": "A system that routes your application to financial partners that are close to you, have active fund availability, and healthy compliance.",
            "summary_hi": "एक ऐसी प्रणाली जो आपके आवेदन को ऐसे निकटतम बैंकों के पास भेजती है जिनके पास निधि उपलब्ध है और NPA सीमा में है।",
            "details_en": "This prevents your application from getting stuck with overloaded or financially restricted branches.",
            "details_hi": "यह आपके आवेदन को अटके रहने से बचाती है।",
            "icon": "Route"
        }
    ]

    return jsonify({"success": True, "modules": modules})

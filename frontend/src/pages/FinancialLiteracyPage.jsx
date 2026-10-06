import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  BookOpen, 
  Calculator, 
  Percent, 
  Clock, 
  ShieldAlert, 
  GitCompare, 
  Route, 
  HelpCircle,
  Search,
  Award,
  CheckCircle2,
  X,
  Sparkles,
  ArrowRight,
  FileText,
  Wallet,
  Zap,
  Info,
  RotateCcw
} from 'lucide-react';

const ALL_QUIZ_QUESTIONS = [
  {
    id: 1,
    question_en: "What does a Moratorium Period allow a borrower to do?",
    question_hi: "मोरेटोरियम अवधि (Moratorium Period) उधारकर्ता को क्या सुविधा देती है?",
    options: [
      { label_en: "Pay double EMI immediately", label_hi: "तुरंत दोगुनी ईएमआई दें", correct: false },
      { label_en: "Pause regular EMI payments while business or income sets up", label_hi: "व्यवसाय या आय शुरू होने तक नियमित ईएमआई स्थगित रखें", correct: true },
      { label_en: "Cancel the loan permanently", label_hi: "लोन हमेशा के लिए माफ करवाएं", correct: false }
    ]
  },
  {
    id: 2,
    question_en: "Why are NSFDC / NBCFDC concessional interest rates beneficial?",
    question_hi: "NSFDC / NBCFDC की रियायती ब्याज दरें (4%-6%) क्यों फायदेमंद हैं?",
    options: [
      { label_en: "Subsidized low rate reduces total interest burden by over 50%", label_hi: "कम ब्याज दर कुल ब्याज के बोझ को 50% से अधिक घटा देती है", correct: true },
      { label_en: "They require extra processing fees", label_hi: "वे अतिरिक्त बैंक चार्ज लेते हैं", correct: false },
      { label_en: "They are high-risk commercial loans", label_hi: "वे उच्च जोखिम वाले व्यावसायिक ऋण हैं", correct: false }
    ]
  },
  {
    id: 3,
    question_en: "What is a Collateral-Free loan under Mudra & CGRS?",
    question_hi: "मुद्रा एवं CGRS के तहत बिना गारंटी (Collateral-Free) लोन का क्या मतलब है?",
    options: [
      { label_en: "Loan requiring personal land or house property documents", label_hi: "लोन के लिए मकान या जमीन के कागजात गिरवी रखना जरूरी है", correct: false },
      { label_en: "Loan backed by Govt Credit Guarantee without pledging property collateral", label_hi: "सरकारी गारंटी से कवर लोन, जिसमें व्यक्तिगत संपत्ति गिरवी नहीं रखनी पड़ती", correct: true },
      { label_en: "Loan given only to foreign investors", label_hi: "केवल विदेशी कंपनियों को दिया जाने वाला लोन", correct: false }
    ]
  },
  {
    id: 4,
    question_en: "What is Interest Subvention in government credit schemes?",
    question_hi: "सरकारी ऋण योजनाओं में ब्याज सबवेंशन (Interest Subvention) क्या होता है?",
    options: [
      { label_en: "Government pays a portion of your loan interest rate, reducing your EMI", label_hi: "सरकार ब्याज दर का एक हिस्सा स्वयं वहन करती है, जिससे आपकी ईएमआई कम हो जाती है", correct: true },
      { label_en: "Penalty interest charged for late monthly payments", label_hi: "देर से भुगतान करने पर लगाया जाने वाला जुर्माना ब्याज", correct: false },
      { label_en: "Tax collected directly from loan principal", label_hi: "लोन राशि पर सीधे काटा जाने वाला कर", correct: false }
    ]
  },
  {
    id: 5,
    question_en: "What is a Non-Performing Asset (NPA) in banking?",
    question_hi: "बैंकिंग प्रणाली में एनपीए (NPA - Non-Performing Asset) क्या है?",
    options: [
      { label_en: "A loan account where repayments are overdue for 90+ days", label_hi: "वह ऋण खाता जिसमें 90 दिनों से अधिक समय से भुगतान बकाया है", correct: true },
      { label_en: "A high-profit fixed deposit account", label_hi: "एक उच्च लाभ वाला फिक्स्ड डिपॉजिट खाता", correct: false },
      { label_en: "A government reward bonus scheme", label_hi: "एक सरकारी इनाम बोनस योजना", correct: false }
    ]
  },
  {
    id: 6,
    question_en: "How does EMI (Equated Monthly Installment) work?",
    question_hi: "ईएमआई (Equated Monthly Installment) कैसे काम करती है?",
    options: [
      { label_en: "Fixed monthly payment covering both Principal and Interest components", label_hi: "नियत मासिक किस्त जिसमें मूलधन और ब्याज दोनों शामिल होते हैं", correct: true },
      { label_en: "Variable payment that increases randomly every month", label_hi: "अस्थिर भुगतान जो हर महीने अपने आप बढ़ता है", correct: false },
      { label_en: "A one-time payment due at loan closure", label_hi: "लोन समाप्ति पर एक बार में दिया जाने वाला अंतिम भुगतान", correct: false }
    ]
  },
  {
    id: 7,
    question_en: "What role do State Channelizing Agencies (SCAs) play?",
    question_hi: "राज्य सरणीबद्ध एजेंसियां (SCAs) क्या भूमिका निभाती हैं?",
    options: [
      { label_en: "Nodal agencies that route target apex scheme funds directly to grassroots beneficiaries", label_hi: "नोडल एजेंसियां जो शीर्ष निगम योजनाओं का फंड जमीनी लाभार्थियों तक पहुंचाती हैं", correct: true },
      { label_en: "Private stock market trading brokers", label_hi: "निजी शेयर बाजार ट्रेडिंग ब्रोकर", correct: false },
      { label_en: "Foreign exchange rate regulators", label_hi: "विदेशी मुद्रा दर नियामक", correct: false }
    ]
  },
  {
    id: 8,
    question_en: "What benefit does PMKVY 4.0 / NAPS skill training provide?",
    question_hi: "PMKVY 4.0 / NAPS कौशल प्रशिक्षण योजना का क्या लाभ है?",
    options: [
      { label_en: "Free certified technical skill training with stipend & toolkit support", label_hi: "मुफ्त प्रमाणित तकनीकी कौशल प्रशिक्षण, स्टाइपेंड और टूलकिट सहायता", correct: true },
      { label_en: "Compulsory real estate property investment", label_hi: "अति-आवश्यक अचल संपत्ति निवेश", correct: false },
      { label_en: "Mandatory corporate tax payment", label_hi: "अनिवार्य कॉर्पोरेट कर भुगतान", correct: false }
    ]
  },
  {
    id: 9,
    question_en: "What happens if you pay off a concessional loan ahead of tenure (Prepayment)?",
    question_hi: "समय सीमा से पहले concessional लोन चुकाने (Prepayment) पर क्या होता है?",
    options: [
      { label_en: "Saves future interest payments with zero prepayment penalty on priority schemes", label_hi: "भविष्य के ब्याज की बचत होती है और प्राथमिक योजनाओं में शून्य पेनल्टी लगती है", correct: true },
      { label_en: "Your loan account is permanently blocked", label_hi: "आपका लोन खाता स्थायी रूप से बंद और ब्लॉक कर दिया जाता है", correct: false },
      { label_en: "You are forced to double your loan amount", label_hi: "आपको लोन राशि दोगुनी करने के लिए मजबूर किया जाता है", correct: false }
    ]
  },
  {
    id: 10,
    question_en: "How does choosing a longer loan tenure affect total repayment?",
    question_hi: "लंबी लोन अवधि (Tenure) चुनने से कुल पुनर्भुगतान पर क्या असर पड़ता है?",
    options: [
      { label_en: "Reduces monthly EMI but increases total interest paid over time", label_hi: "मासिक ईएमआई कम होती है लेकिन कुल ब्याज का भुगतान बढ़ जाता है", correct: true },
      { label_en: "Eliminates interest completely", label_hi: "ब्याज पूरी तरह से खत्म हो जाता है", correct: false },
      { label_en: "Has no effect on EMI or interest", label_hi: "ईएमआई या ब्याज पर कोई प्रभाव नहीं पड़ता", correct: false }
    ]
  },
  {
    id: 11,
    question_en: "What is the primary objective of CGRS (Credit Guarantee Scheme)?",
    question_hi: "CGRS (क्रेडिट गारंटी योजना) का मुख्य उद्देश्य क्या है?",
    options: [
      { label_en: "To protect lenders against defaults, encouraging banks to lend without third-party collateral", label_hi: "ऋणदाताओं को डिफॉल्ट से बचाना, ताकि बैंक बिना थर्ड-पार्टी गारंटी के लोन दे सकें", correct: true },
      { label_en: "To collect fixed deposits from public", label_hi: "जनता से फिक्स्ड डिपॉजिट जमा करना", correct: false },
      { label_en: "To charge high insurance fees on all accounts", label_hi: "सभी खातों पर उच्च बीमा शुल्क लगाना", correct: false }
    ]
  },
  {
    id: 12,
    question_en: "Why is tracking Bank NPA and Capacity Ratio important before applying?",
    question_hi: "आवेदन करने से पहले बैंक के NPA और क्षमता अनुपात (Capacity Ratio) को जांचना क्यों जरूरी है?",
    options: [
      { label_en: "Branches with low NPAs and active capacity process scheme sanctions faster without delays", label_hi: "कम NPA और सक्रिय क्षमता वाले बैंक शाखाएं योजनाओं को बिना देरी के तेजी से स्वीकृत करती हैं", correct: true },
      { label_en: "It is required for opening savings bank accounts", label_hi: "यह केवल बचत खाता खोलने के लिए आवश्यक है", correct: false },
      { label_en: "It doubles your income tax refund", label_hi: "यह आपके आयकर रिफंड को दोगुना करता है", correct: false }
    ]
  }
];

export default function FinancialLiteracyPage() {
  const navigate = useNavigate();
  const { lang, t } = useApp();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);

  // Persistent Attempted Quiz Question Tracker to prevent repetition
  const [attemptedQuestionIds, setAttemptedQuestionIds] = useState(() => {
    try {
      const saved = localStorage.getItem('arthsetu_quiz_attempted');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [activeQuizQuestions, setActiveQuizQuestions] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);
  const [wasResetNotification, setWasResetNotification] = useState(false);

  useEffect(() => {
    fetch('/api/learn')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setModules(data.modules);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Select 3 unique unattempted questions for each round
  const selectNextQuizRound = () => {
    setQuizAnswers({});
    setQuizScore(null);
    setWasResetNotification(false);

    let currentAttempted = attemptedQuestionIds;
    let unattempted = ALL_QUIZ_QUESTIONS.filter(q => !currentAttempted.includes(q.id));

    // If fewer than 3 unattempted questions remain in the pool, reset tracking so pool cycles cleanly
    if (unattempted.length < 3) {
      currentAttempted = [];
      setAttemptedQuestionIds([]);
      try {
        localStorage.setItem('arthsetu_quiz_attempted', JSON.stringify([]));
      } catch (e) {}
      unattempted = [...ALL_QUIZ_QUESTIONS];
      setWasResetNotification(true);
    }

    // Shuffle unattempted questions and pick top 3
    const shuffled = [...unattempted].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    setActiveQuizQuestions(selected);
  };

  const handleOpenQuiz = () => {
    selectNextQuizRound();
    setShowQuiz(true);
  };

  const handleQuizSubmit = () => {
    let score = 0;
    activeQuizQuestions.forEach(q => {
      const selected = quizAnswers[q.id];
      if (selected !== undefined && q.options[selected].correct) {
        score++;
      }
    });
    setQuizScore(score);

    // Save newly attempted question IDs
    const newAttemptedIds = Array.from(new Set([...attemptedQuestionIds, ...activeQuizQuestions.map(q => q.id)]));
    setAttemptedQuestionIds(newAttemptedIds);
    try {
      localStorage.setItem('arthsetu_quiz_attempted', JSON.stringify(newAttemptedIds));
    } catch (e) {}
  };

  const handleResetProgress = () => {
    setAttemptedQuestionIds([]);
    try {
      localStorage.setItem('arthsetu_quiz_attempted', JSON.stringify([]));
    } catch (e) {}
    selectNextQuizRound();
  };

  const categories = [
    { key: 'All', label_en: 'All Topics', label_hi: 'सभी विषय' },
    { key: 'Lending & Interest', label_en: 'Lending & Interest', label_hi: 'ऋण एवं ब्याज दरें' },
    { key: 'Risk & Channels', label_en: 'Risk & Channels', label_hi: 'NPA एवं बैंक चैनल' },
    { key: 'Scheme & Guarantee', label_en: 'Scheme & Guarantee', label_hi: 'सब्सिडी एवं गारंटी' },
    { key: 'Skill & Training', label_en: 'Skill & Training', label_hi: 'कौशल एवं टूलकिट' },
  ];

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Calculator': return Calculator;
      case 'Percent': return Percent;
      case 'Clock': return Clock;
      case 'ShieldAlert': return ShieldAlert;
      case 'GitCompare': return GitCompare;
      case 'Route': return Route;
      case 'BookOpen': return BookOpen;
      default: return HelpCircle;
    }
  };

  const filteredModules = modules.filter(m => {
    const matchCat = activeCategory === 'All' || m.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchCat;
    const titleEn = (m.title_en || '').toLowerCase();
    const titleHi = (m.title_hi || '').toLowerCase();
    const summaryEn = (m.summary_en || '').toLowerCase();
    const summaryHi = (m.summary_hi || '').toLowerCase();
    const matchQuery = titleEn.includes(query) || titleHi.includes(query) || summaryEn.includes(query) || summaryHi.includes(query);
    return matchCat && matchQuery;
  });

  return (
    <div className="min-h-screen bg-[#F0F3F6] py-8 text-[#0B0E14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#D9E2EC] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#FF7328] text-xs font-extrabold uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4 text-[#FF7328]" /> Financial Literacy & Knowledge Hub
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B0E14] tracking-tight">
              {lang === 'hi' ? 'वित्तीय साक्षरता एवं मार्गदर्शन पोर्टल' : 'Financial Literacy & Scheme Guidance'}
            </h1>
            <p className="text-xs text-[#223D4D] font-medium mt-1">
              {lang === 'hi' 
                ? 'ईएमआई, ब्याज सबवेंशन, मोरेटोरियम, एनपीए नियम, और सरकारी सब्सिडी के सभी तकनीकी शब्दों की आसान व्याख्या।'
                : 'In-depth explanations of EMI, interest subvention, moratorium grace periods, NPA compliance, and credit guarantee terms.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenQuiz}
              className="bg-[#FF7328] hover:bg-[#E85E15] text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Award className="w-4 h-4 text-white" />
              {lang === 'hi' ? 'साक्षरता क्विज़ लें (Take Quiz)' : 'Take Literacy Quiz'}
            </button>
          </div>
        </div>

        {/* Search Bar & Filter Options */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#D9E2EC] space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Real-time Search Bar */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#223D4D] absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'hi' ? 'शब्द खोजें (उदा. EMI, NPA, Moratorium)...' : 'Search terms (e.g. EMI, NPA, Moratorium)...'}
                className="w-full pl-10 pr-4 py-2.5 bg-[#F0F3F6] border border-[#D9E2EC] rounded-2xl text-xs text-[#0B0E14] focus:outline-none focus:ring-2 focus:ring-[#FF7328] font-semibold"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-[#223D4D] hover:text-[#0B0E14] text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-[#223D4D] font-bold hidden md:inline">
                Showing {filteredModules.length} Financial Terms
              </span>
              <span className="bg-[#FFF0E8] text-[#FF7328] border border-[#FFC6A8] text-[11px] font-extrabold px-3 py-1 rounded-full">
                Quiz Progress: {attemptedQuestionIds.length} / {ALL_QUIZ_QUESTIONS.length} Solved
              </span>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => {
              const active = activeCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer border ${
                    active
                      ? 'bg-[#223D4D] text-white border-[#172B37] shadow-xs'
                      : 'bg-[#F0F3F6] text-[#223D4D] border-[#D9E2EC] hover:bg-[#E6ECF1]'
                  }`}
                >
                  {lang === 'hi' ? cat.label_hi : cat.label_en}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modules Grid */}
        {loading ? (
          <div className="py-12 text-center text-xs text-[#223D4D] font-bold">
            <div className="w-6 h-6 border-2 border-[#FF7328] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Loading financial literacy terms...
          </div>
        ) : filteredModules.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-[#223D4D] text-xs space-y-2 border border-[#D9E2EC]">
            <Info className="w-8 h-8 text-[#FF7328] mx-auto" />
            <p className="font-bold text-[#0B0E14]">No terms match your search query "{searchQuery}".</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="text-[#FF7328] font-bold hover:underline"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filteredModules.map((mod) => {
              const Icon = getIcon(mod.icon);
              return (
                <div 
                  key={mod.id} 
                  onClick={() => setSelectedModule(mod)}
                  className="bg-white rounded-3xl p-6 border border-[#D9E2EC] shadow-sm space-y-4 hover:border-[#FF7328] transition-all card-hover h-full flex flex-col justify-between cursor-pointer group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#223D4D] text-[#FF7328] group-hover:bg-[#FF7328] group-hover:text-white transition-colors flex items-center justify-center font-bold shadow-2xs border border-[#172B37]">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="bg-[#F0F3F6] text-[#223D4D] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#D9E2EC]">
                        {mod.category}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-[#0B0E14] text-base leading-snug group-hover:text-[#FF7328] transition-colors">
                      {lang === 'hi' ? mod.title_hi : mod.title_en}
                    </h3>

                    <p className="text-xs text-[#223D4D] leading-relaxed font-semibold line-clamp-3">
                      {lang === 'hi' ? mod.summary_hi : mod.summary_en}
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    {mod.example_en && (
                      <div className="bg-[#F0F3F6] p-3 rounded-2xl border border-[#D9E2EC] text-[11px] text-[#0B0E14] font-mono leading-snug font-semibold">
                        💡 {lang === 'hi' ? mod.example_hi : mod.example_en}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[#FF7328] text-xs font-bold group-hover:translate-x-1 transition-transform">
                      <span>Read Deep-Dive & Action Options</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Deep-Dive Term Modal Dialog */}
        {selectedModule && (
          <div className="fixed inset-0 z-50 bg-[#0B0E14]/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#D9E2EC] max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-start justify-between gap-4 border-b border-[#D9E2EC] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#223D4D] text-[#FF7328] flex items-center justify-center font-bold shadow-md border border-[#172B37]">
                    {React.createElement(getIcon(selectedModule.icon), { className: "w-6 h-6" })}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF7328] font-bold block">
                      {selectedModule.category} • Term Explanation
                    </span>
                    <h2 className="text-xl font-black text-[#0B0E14] leading-tight">
                      {lang === 'hi' ? selectedModule.title_hi : selectedModule.title_en}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedModule(null)}
                  className="p-2 rounded-xl text-[#223D4D] hover:text-[#0B0E14] hover:bg-[#F0F3F6] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Detailed Explanation */}
              <div className="space-y-4 text-xs text-[#223D4D] leading-relaxed font-semibold">
                <div>
                  <h4 className="font-extrabold text-[#0B0E14] text-xs uppercase tracking-wider mb-1">Core Summary</h4>
                  <p className="bg-[#FFF0E8] p-3.5 rounded-2xl border border-[#FFC6A8] text-[#0B0E14] font-bold">
                    {lang === 'hi' ? selectedModule.summary_hi : selectedModule.summary_en}
                  </p>
                </div>

                <div>
                  <h4 className="font-extrabold text-[#0B0E14] text-xs uppercase tracking-wider mb-1">Detailed Banking Context</h4>
                  <p className="bg-[#F0F3F6] p-4 rounded-2xl border border-[#D9E2EC] text-[#0B0E14] font-semibold">
                    {lang === 'hi' ? selectedModule.details_hi : selectedModule.details_en}
                  </p>
                </div>

                {selectedModule.formula_en && (
                  <div>
                    <h4 className="font-extrabold text-[#0B0E14] text-xs uppercase tracking-wider mb-1">Formula / Technical Standard</h4>
                    <div className="bg-[#0B0E14] text-[#FF7328] p-3.5 rounded-2xl font-mono text-[11px] border border-[#172B37] font-bold">
                      {selectedModule.formula_en}
                    </div>
                  </div>
                )}

                {selectedModule.example_en && (
                  <div>
                    <h4 className="font-extrabold text-[#0B0E14] text-xs uppercase tracking-wider mb-1">Real-World Case Example</h4>
                    <p className="bg-[#F0F3F6] p-3.5 rounded-2xl border border-[#D9E2EC] text-[#223D4D] font-bold">
                      📌 {lang === 'hi' ? selectedModule.example_hi : selectedModule.example_en}
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Action Options */}
              <div className="pt-4 border-t border-[#D9E2EC] space-y-2">
                <span className="text-xs font-extrabold text-[#0B0E14] block uppercase tracking-wider">Quick Action Options:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => { setSelectedModule(null); navigate('/calculator'); }}
                    className="p-3 rounded-xl bg-[#223D4D] hover:bg-[#172B37] text-white font-bold border border-[#172B37] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Calculator className="w-4 h-4 text-[#FF7328]" /> Calculate EMI
                  </button>

                  <button
                    onClick={() => { setSelectedModule(null); navigate('/schemes'); }}
                    className="p-3 rounded-xl bg-[#FF7328] hover:bg-[#E85E15] text-white font-extrabold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Sparkles className="w-4 h-4" /> Find Schemes
                  </button>

                  <button
                    onClick={() => { setSelectedModule(null); navigate('/partners'); }}
                    className="p-3 rounded-xl bg-[#0B0E14] hover:bg-[#172B37] text-white font-bold border border-[#172B37] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Route className="w-4 h-4 text-[#FF7328]" /> Find Partners
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Interactive Literacy Quiz Modal Option */}
        {showQuiz && (
          <div className="fixed inset-0 z-50 bg-[#0B0E14]/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-[#D9E2EC] max-h-[90vh] overflow-y-auto">
              
              <div className="flex items-center justify-between border-b border-[#D9E2EC] pb-4">
                <div className="flex items-center gap-2.5">
                  <Award className="w-6 h-6 text-[#FF7328]" />
                  <div>
                    <h2 className="text-xl font-black text-[#0B0E14]">
                      {lang === 'hi' ? 'वित्तीय साक्षरता आत्म-मूल्यांकन क्विज़' : 'Financial Literacy Self-Assessment Quiz'}
                    </h2>
                    <p className="text-[11px] text-[#223D4D] font-extrabold mt-0.5">
                      Progress: {attemptedQuestionIds.length} of {ALL_QUIZ_QUESTIONS.length} Questions Attempted
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => { setShowQuiz(false); setQuizScore(null); setQuizAnswers({}); }}
                  className="p-2 rounded-xl text-[#223D4D] hover:text-[#0B0E14] hover:bg-[#F0F3F6] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {wasResetNotification && (
                <div className="bg-[#FFF0E8] border border-[#FFC6A8] p-3 rounded-2xl text-xs text-[#FF7328] font-extrabold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>🎉 Great job! You have answered all available questions in our question bank. Starting a fresh round!</span>
                </div>
              )}

              {quizScore !== null ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#FFF0E8] text-[#FF7328] border border-[#FFC6A8] flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-[#0B0E14]">
                      You Scored {quizScore} / {activeQuizQuestions.length}!
                    </h3>
                    <p className="text-xs text-[#223D4D] font-extrabold">
                      {quizScore === activeQuizQuestions.length 
                        ? '🎉 Outstanding! You have mastered these financial literacy concepts.'
                        : 'Good effort! Review the term cards to strengthen your knowledge.'}
                    </p>
                  </div>

                  <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={selectNextQuizRound}
                      className="px-5 py-2.5 bg-[#FF7328] hover:bg-[#E85E15] text-white font-extrabold rounded-xl text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4" /> Try Next 3 Fresh Questions →
                    </button>
                    
                    <button
                      onClick={handleResetProgress}
                      className="px-4 py-2.5 bg-[#F0F3F6] text-[#223D4D] hover:bg-[#E6ECF1] border border-[#D9E2EC] font-extrabold rounded-xl text-xs cursor-pointer flex items-center gap-1.5"
                      title="Reset question history to start over from Question 1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reset History
                    </button>

                    <button
                      onClick={() => { setShowQuiz(false); navigate('/schemes'); }}
                      className="px-5 py-2.5 bg-[#223D4D] text-white font-extrabold rounded-xl text-xs hover:bg-[#172B37] shadow-xs cursor-pointer"
                    >
                      Apply Knowledge to Find Schemes →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 text-xs text-[#0B0E14]">
                  {activeQuizQuestions.map((q, idx) => (
                    <div key={q.id} className="bg-[#F0F3F6] p-4 rounded-2xl border border-[#D9E2EC] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[#FF7328] text-[11px] block uppercase">Question {idx + 1} of {activeQuizQuestions.length}</span>
                        <span className="text-[10px] bg-white text-[#223D4D] px-2 py-0.5 rounded-full border border-[#D9E2EC] font-bold">
                          Question ID #{q.id} (Unattempted)
                        </span>
                      </div>
                      
                      <p className="font-extrabold text-[#0B0E14] text-sm">
                        {lang === 'hi' ? q.question_hi : q.question_en}
                      </p>

                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => (
                          <label
                            key={optIdx}
                            className={`flex items-center gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                              quizAnswers[q.id] === optIdx
                                ? 'bg-[#FFF0E8] border-[#FF7328] text-[#0B0E14] font-extrabold shadow-xs'
                                : 'bg-white border-[#D9E2EC] text-[#223D4D] hover:bg-slate-100/80 font-bold'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question-${q.id}`}
                              checked={quizAnswers[q.id] === optIdx}
                              onChange={() => setQuizAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                              className="accent-[#FF7328]"
                            />
                            <span>{lang === 'hi' ? opt.label_hi : opt.label_en}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}

                  <div className="pt-2">
                    <button
                      onClick={handleQuizSubmit}
                      disabled={Object.keys(quizAnswers).length < activeQuizQuestions.length}
                      className="w-full py-3 bg-[#FF7328] hover:bg-[#E85E15] text-white font-extrabold rounded-2xl text-xs shadow-sm transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      Submit Quiz Answers →
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

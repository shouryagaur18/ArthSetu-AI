import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Check, 
  Edit2, 
  AlertCircle, 
  ArrowRight, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Globe, 
  Radio,
  Play,
  StopCircle,
  RefreshCw,
  Info,
  FileText,
  Building2,
  Calculator,
  X
} from 'lucide-react';

export default function AISchemeAssistantPage() {
  const navigate = useNavigate();
  const { setUserProfile, userProfile } = useApp();
  
  const [promptInput, setPromptInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedVoiceLang, setSelectedVoiceLang] = useState('hi-IN');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceError, setVoiceError] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const chatEndRef = useRef(null);

  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'assistant',
      text: "Namaste! I am ArthSetu AI Chatbot. Ask me any question about government scheme eligibility, required documents, EMI calculations, moratorium periods, or channel partner bank branches. Type or speak your query below and I will answer directly in this chatbox!"
    }
  ]);
  const [extractedData, setExtractedData] = useState(null);

  // Supported Multilingual Speech Recognition Languages
  const voiceLanguages = [
    { code: 'hi-IN', label: '🇮🇳 हिंदी (Hindi)' },
    { code: 'en-IN', label: '🇮🇳 English (India)' },
    { code: 'hi-IN', label: '🇮🇳 Hinglish (Hindi+English)' },
    { code: 'mr-IN', label: '🇮🇳 मराठी (Marathi)' },
    { code: 'bn-IN', label: '🇮🇳 বাংলা (Bengali)' },
    { code: 'as-IN', label: '🇮🇳 অসমীয়া (Assamese)' },
    { code: 'ta-IN', label: '🇮🇳 தமிழ் (Tamil)' },
    { code: 'te-IN', label: '🇮🇳 తెలుగు (Telugu)' },
    { code: 'gu-IN', label: '🇮🇳 ગુજરાતી (Gujarati)' },
    { code: 'kn-IN', label: '🇮🇳 ಕನ್ನಡ (Kannada)' },
  ];

  const samplePrompts = [
    {
      lang: 'Hindi (Business)',
      text: "मुझे लखनऊ में सिलाई का व्यापार शुरू करने के लिए ₹3 लाख का लोन चाहिए। मेरी वार्षिक आय ₹3 लाख है।"
    },
    {
      lang: 'Hindi (Skill Dev)',
      text: "मुझे लखनऊ में PMKVY 4.0 कौशल विकास ट्रेनिंग और ITI कंप्यूटर कोर्स के लिए ₹50,000 की सहायता चाहिए।"
    },
    {
      lang: 'English (Documents)',
      text: "What documents are required to apply for NSFDC or PMEGP concessional loans?"
    },
    {
      lang: 'Hinglish (EMI & Moratorium)',
      text: "3 lakh loan par kitna EMI Dena hoga aur moratorium kitne mahine milta hai?"
    },
    {
      lang: 'English (Banks)',
      text: "Which bank branches in Lucknow accept NSFDC and Mudra applications?"
    },
    {
      lang: 'Hinglish (Business)',
      text: "Mujhe Lucknow me tailoring shop kholne ke liye 3 lakh ka loan chahiye, family income 3 lakh hai."
    }
  ];

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, loading]);

  // Safe BCP-47 language code mapping for browser Web Speech API
  const getValidLangCode = (code) => {
    const supported = {
      'hi-IN': 'hi-IN',
      'en-IN': 'en-IN',
      'mr-IN': 'mr-IN',
      'bn-IN': 'bn-IN',
      'as-IN': 'hi-IN',
      'ta-IN': 'ta-IN',
      'te-IN': 'te-IN',
      'gu-IN': 'gu-IN',
      'kn-IN': 'kn-IN'
    };
    return supported[code] || 'hi-IN';
  };

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      isListeningRef.current = false;
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e){}
      }
    };
  }, []);

  // Toggle Speech Recognition
  const toggleListening = () => {
    setVoiceError(null);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError("Web Speech API is not supported in this browser. Click 'Try Simulated Voice' below to test!");
      simulateVoiceInput();
      return;
    }

    if (isListening || isListeningRef.current) {
      isListeningRef.current = false;
      setIsListening(false);
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) {}
      }
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = getValidLangCode(selectedVoiceLang);

      recognition.onstart = () => {
        isListeningRef.current = true;
        setIsListening(true);
        setVoiceError(null);
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setPromptInput(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition notice:", event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          isListeningRef.current = false;
          setIsListening(false);
          setVoiceError("Microphone access was denied. Please allow microphone permissions in your browser address bar.");
        } else if (event.error === 'no-speech') {
          // Do not turn off listening state on momentary silence pause
          console.log("No speech detected during pause; keeping microphone active...");
        } else if (event.error === 'network') {
          setVoiceError("Speech recognition network error. Please check your internet connection.");
        }
      };

      recognition.onend = () => {
        // Auto-restart recognition if user is still in listening mode to prevent silent dropouts
        if (isListeningRef.current) {
          try {
            recognition.start();
          } catch (e) {
            isListeningRef.current = false;
            setIsListening(false);
          }
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
      isListeningRef.current = true;
      setIsListening(true);
      recognition.start();

    } catch (err) {
      console.error("Error starting speech recognition:", err);
      isListeningRef.current = false;
      setIsListening(false);
      setVoiceError("Could not start microphone. Please check your browser microphone settings.");
    }
  };

  // Simulated Voice Input Mode
  const simulateVoiceInput = (sampleText) => {
    const textToType = sampleText || "Mujhe Lucknow me 3 lakh rupees ka loan tailoring shop kholne ke liye chahiye. Family income 3 lakh hai.";
    setIsSimulating(true);
    setPromptInput('');
    setVoiceError(null);
    setIsListening(true);

    let charIndex = 0;
    const interval = setInterval(() => {
      if (charIndex < textToType.length) {
        setPromptInput(textToType.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(interval);
        setIsSimulating(false);
        setIsListening(false);
      }
    }, 35);
  };

  // Text to Speech Response Reader
  const speakText = (textToSpeak) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = selectedVoiceLang.startsWith('hi') ? 'hi-IN' : selectedVoiceLang;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  // In-Chat Multi-Turn Question Answering Handler
  const handleExtract = async (overrideText) => {
    const textToSubmit = overrideText || promptInput;
    if (!textToSubmit.trim()) return;

    // Add User Message to Chat History
    const userMsg = { sender: 'user', text: textToSubmit };
    setChatHistory(prev => [...prev, userMsg]);
    setPromptInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSubmit })
      });
      const data = await res.json();
      
      if (data.success && data.extracted_data) {
        setExtractedData(data.extracted_data);

        const replyText = data.extracted_data.assistant_reply || 
          `Here is what I found for your query about ${data.extracted_data.purpose || 'schemes'} in ${data.extracted_data.location || 'your area'}.`;
        
        setChatHistory(prev => [
          ...prev,
          {
            sender: 'assistant',
            text: replyText,
            extracted: data.extracted_data,
            matched_schemes: data.extracted_data.matched_schemes || [],
            followup_suggestions: data.extracted_data.followup_suggestions || []
          }
        ]);

        if (data.extracted_data.missing_fields && data.extracted_data.missing_fields.length > 0) {
          setTimeout(() => {
            setChatHistory(prev => [
              ...prev,
              {
                sender: 'assistant',
                text: data.extracted_data.missing_fields[0].prompt,
                options: data.extracted_data.missing_fields[0].options
              }
            ]);
          }, 300);
        }

        // Auto-speak response if TTS enabled
        speakText(replyText.split('\n')[0]);
      }
    } catch (err) {
      setChatHistory(prev => [...prev, { sender: 'assistant', text: "Error answering query. Please try again." }]);
    } finally {
      setLoading(false);
      setPromptInput('');
    }
  };

  const handleOptionSelect = (optionValue) => {
    if (extractedData) {
      const updated = { ...extractedData, education_level: optionValue };
      setExtractedData(updated);
      setChatHistory(prev => [
        ...prev,
        { sender: 'user', text: optionValue },
        { sender: 'assistant', text: `Got it! Set education level to ${optionValue}. You can ask any follow-up questions below or request scheme details.` }
      ]);
    }
  };

  // In-Chat Scheme Evaluation without navigating away
  const handleInChatMatching = () => {
    if (extractedData) {
      const merged = {
        ...userProfile,
        purpose: extractedData.purpose || 'Business',
        business_type: extractedData.business_type || 'Tailoring',
        district: extractedData.location || 'Lucknow',
        loan_required: extractedData.loan_required || 300000,
        annual_family_income: extractedData.annual_family_income || 320000,
        social_category: extractedData.social_category || 'SC'
      };
      setUserProfile(merged);
      
      setChatHistory(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: `Your profile has been updated! Ask me anything about these schemes, required documents, EMI calculation, or nearby bank branches right here in this chat.`
        }
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F3F6] py-8 text-[#0B0E14]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#D9E2EC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#223D4D] text-[#FF7328] flex items-center justify-center shadow-md shrink-0 border border-[#172B37]">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-[#0B0E14] tracking-tight">Talk to ArthSetu AI Chatbot</h1>
                <span className="bg-[#FFF0E8] text-[#FF7328] text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-[#FFC6A8] flex items-center gap-1">
                  <Radio className="w-3 h-3 text-[#FF7328] animate-pulse" /> Live In-Chat QA
                </span>
              </div>
              <p className="text-xs text-[#223D4D] font-semibold">Ask any question about schemes, loans, documents, or banks — answers directly in this chatbox!</p>
            </div>
          </div>

          {/* Voice Language Selector */}
          <div className="flex items-center gap-2 bg-[#F0F3F6] p-2 rounded-2xl border border-[#D9E2EC] text-xs self-stretch sm:self-auto">
            <Globe className="w-4 h-4 text-[#FF7328] shrink-0" />
            <select
              value={selectedVoiceLang}
              onChange={(e) => setSelectedVoiceLang(e.target.value)}
              className="bg-transparent font-bold text-[#0B0E14] focus:outline-none cursor-pointer"
            >
              {voiceLanguages.map((vl, idx) => (
                <option key={idx} value={vl.code}>{vl.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Voice Error Notice Banner (If Any) */}
        {voiceError && (
          <div className="bg-[#FFF0E8] border border-[#FFC6A8] rounded-2xl p-4 flex items-start justify-between gap-3 text-xs text-[#0B0E14] shadow-xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-[#FF7328] shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold block text-[#FF7328]">Voice Assistant Notice:</span>
                <p className="font-medium">{voiceError}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => simulateVoiceInput()}
                className="bg-[#FF7328] hover:bg-[#E85E15] text-white font-extrabold text-[11px] px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                Try Simulated Voice
              </button>
              <button
                onClick={() => setVoiceError(null)}
                className="text-[#223D4D] hover:text-[#0B0E14] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Sample Voice/Text Prompts */}
        <div className="bg-white p-4 rounded-3xl border border-[#D9E2EC] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-[#0B0E14] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#FF7328]" /> Click or Speak Sample Queries:
            </span>
            <button
              onClick={() => simulateVoiceInput()}
              className="text-[11px] text-[#FF7328] font-extrabold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5" /> Test Simulated Voice
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => { setPromptInput(p.text); handleExtract(p.text); }}
                className="p-2.5 rounded-2xl bg-[#F0F3F6] hover:bg-[#E6ECF1] border border-[#D9E2EC] text-left text-xs space-y-1 transition-all cursor-pointer group"
              >
                <span className="text-[10px] font-extrabold text-[#FF7328] block">{p.lang}</span>
                <p className="text-slate-800 text-[11px] font-semibold line-clamp-2 group-hover:text-[#0B0E14]">"{p.text}"</p>
              </button>
            ))}
          </div>
        </div>

        {/* Multi-Turn Chat Conversation Window */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#D9E2EC] space-y-6">
          
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
            {chatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-[#223D4D] text-[#FF7328] flex items-center justify-center text-xs font-bold shrink-0 border border-[#172B37]">
                    AS
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-3xl p-4 text-xs space-y-3 shadow-2xs ${
                    msg.sender === 'user'
                      ? 'bg-[#FF7328] text-white font-extrabold rounded-tr-none'
                      : 'bg-[#F0F3F6] text-[#0B0E14] border border-[#D9E2EC] font-semibold rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed text-xs">{msg.text}</p>

                  {/* Render Parsed Parameter Summary inside Chat Bubble */}
                  {msg.extracted && msg.extracted.loan_required > 0 && (
                    <div className="bg-white p-3.5 rounded-2xl border border-[#D9E2EC] text-xs text-[#0B0E14] space-y-2 mt-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF7328] block">Parsed Requirements:</span>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-[#F0F3F6] p-2.5 rounded-xl border border-[#D9E2EC]">
                          <span className="text-[10px] text-[#223D4D] block font-bold">Purpose</span>
                          <span className="font-extrabold text-[#0B0E14]">{msg.extracted.purpose}</span>
                        </div>
                        <div className="bg-[#F0F3F6] p-2.5 rounded-xl border border-[#D9E2EC]">
                          <span className="text-[10px] text-[#223D4D] block font-bold">Business Type</span>
                          <span className="font-extrabold text-[#0B0E14]">{msg.extracted.business_type}</span>
                        </div>
                        <div className="bg-[#F0F3F6] p-2.5 rounded-xl border border-[#D9E2EC]">
                          <span className="text-[10px] text-[#223D4D] block font-bold">Location</span>
                          <span className="font-extrabold text-[#0B0E14]">{msg.extracted.location}</span>
                        </div>
                        <div className="bg-[#F0F3F6] p-2.5 rounded-xl border border-[#D9E2EC]">
                          <span className="text-[10px] text-[#223D4D] block font-bold">Loan Required</span>
                          <span className="font-extrabold text-[#FF7328]">₹{msg.extracted.loan_required.toLocaleString()}</span>
                        </div>
                        <div className="bg-[#F0F3F6] p-2.5 rounded-xl border border-[#D9E2EC]">
                          <span className="text-[10px] text-[#223D4D] block font-bold">Annual Income</span>
                          <span className="font-extrabold text-[#0B0E14]">₹{msg.extracted.annual_family_income.toLocaleString()}</span>
                        </div>
                        <div className="bg-[#F0F3F6] p-2.5 rounded-xl border border-[#D9E2EC]">
                          <span className="text-[10px] text-[#223D4D] block font-bold">Social Category</span>
                          <span className="font-extrabold text-[#0B0E14]">{msg.extracted.social_category}</span>
                        </div>
                      </div>

                      <div className="pt-1">
                        <button
                          onClick={handleInChatMatching}
                          className="w-full py-2 bg-[#223D4D] hover:bg-[#172B37] text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-[#172B37] transition-colors cursor-pointer"
                        >
                          <Check className="w-4 h-4 text-[#FF7328]" /> Save Parameters in Chat Context
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Render Inline Matched Scheme Cards inside Chat Bubble */}
                  {msg.matched_schemes && msg.matched_schemes.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-[#D9E2EC]">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF7328] block">Top Matched Government Schemes:</span>
                      <div className="space-y-2">
                        {msg.matched_schemes.map((s, idx) => (
                          <div key={idx} className="bg-white p-3 rounded-2xl border border-[#D9E2EC] text-xs text-[#0B0E14] space-y-1.5 shadow-2xs">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-extrabold text-[#0B0E14] text-xs leading-snug">{s.name}</span>
                              <span className="bg-[#FFF0E8] text-[#FF7328] text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-[#FFC6A8] shrink-0">
                                {s.match_score}% Match
                              </span>
                            </div>
                            <p className="text-[11px] text-[#223D4D] line-clamp-2 leading-relaxed font-medium">{s.description}</p>
                            <div className="flex flex-wrap items-center justify-between text-[10px] text-[#223D4D] font-bold pt-1 border-t border-[#D9E2EC] gap-1">
                              <span>Interest Rate: <strong className="text-[#FF7328]">{s.interest_rate}% p.a.</strong></span>
                              <span>Moratorium: <strong className="text-[#0B0E14]">{s.moratorium_months}m</strong></span>
                              <span>Max Loan: <strong className="text-[#FF7328]">₹{(s.max_loan/100000).toFixed(1)}L</strong></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Render Missing Field Options */}
                  {msg.options && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {msg.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleOptionSelect(opt)}
                          className="bg-[#FF7328] hover:bg-[#E85E15] text-white text-xs font-extrabold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Render Clickable Follow-up Question Chips inside Chat */}
                  {msg.followup_suggestions && msg.followup_suggestions.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-[#D9E2EC]">
                      <span className="text-[10px] font-extrabold text-[#223D4D] uppercase block">Suggested Follow-up Questions:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.followup_suggestions.map((chip, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleExtract(chip)}
                            className="bg-white hover:bg-[#FFF0E8] text-[#FF7328] text-[11px] font-extrabold px-2.5 py-1 rounded-xl border border-[#FFC6A8] transition-colors cursor-pointer text-left shadow-2xs"
                          >
                            💬 {chip}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-[#223D4D] font-bold">
                <div className="w-4 h-4 border-2 border-[#FF7328] border-t-transparent rounded-full animate-spin"></div>
                ArthSetu AI is analyzing your question & formulating response...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Voice & Input Controls Box */}
          <div className="pt-4 border-t border-[#D9E2EC] space-y-3">
            
            {/* Real-time Voice Recording Status Bar */}
            {isListening && (
              <div className="bg-[#FFF0E8] border border-[#FFC6A8] text-[#FF7328] text-xs px-4 py-3 rounded-2xl space-y-2 animate-pulse">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold flex items-center gap-2">
                    <Mic className="w-4 h-4 text-[#FF7328] animate-bounce" />
                    {isSimulating ? "Simulating Voice Dictation..." : `Voice Detector Active: Speak now in ${voiceLanguages.find(l=>l.code===selectedVoiceLang)?.label.split(' ')[1] || 'your language'}!`}
                  </span>
                  <button
                    onClick={toggleListening}
                    className="bg-[#FF7328] hover:bg-[#E85E15] text-white text-[11px] font-extrabold px-3 py-1 rounded-xl transition-colors cursor-pointer"
                  >
                    Stop Recording
                  </button>
                </div>

                {/* Animated Speech Waveform Bars */}
                <div className="flex items-center justify-center gap-1.5 h-6">
                  {[40, 70, 100, 60, 90, 50, 80, 60, 95, 40].map((baseH, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-[#FF7328] rounded-full animate-pulse"
                      style={{ height: `${baseH}%`, animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="relative flex items-center gap-2">
              
              {/* Multilingual Voice Microphone Button */}
              <button
                onClick={toggleListening}
                className={`p-3.5 rounded-2xl transition-all shadow-md cursor-pointer flex items-center justify-center shrink-0 ${
                  isListening
                    ? 'bg-[#FF7328] text-white ring-4 ring-[#FFC6A8] scale-105'
                    : 'bg-[#223D4D] text-white hover:bg-[#172B37] border border-[#172B37]'
                }`}
                title={isListening ? "Click to stop recording voice" : "Click microphone to convert your voice to text"}
              >
                {isListening ? <MicOff className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-[#FF7328] animate-pulse" />}
              </button>

              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleExtract()}
                placeholder={isListening ? "Voice Detector active... Speak your question now..." : "Ask any question e.g. What documents are needed? or Mujhe 3 lakh loan chahiye..."}
                className="w-full pl-4 pr-12 py-3.5 bg-[#F0F3F6] border border-[#D9E2EC] rounded-2xl text-xs text-[#0B0E14] focus:outline-none focus:ring-2 focus:ring-[#FF7328] font-semibold shadow-inner"
              />

              <button
                onClick={() => handleExtract()}
                disabled={loading || !promptInput.trim()}
                className="absolute right-2.5 bg-[#FF7328] hover:bg-[#E85E15] text-white p-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-40 shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>

            </div>

            <div className="flex items-center justify-between text-[11px] text-[#223D4D] font-bold px-1">
              <span className="flex items-center gap-1 font-extrabold">
                <Globe className="w-3 h-3 text-[#FF7328]" /> Continuous Multi-Turn AI Chatbox
              </span>
              <span className="flex items-center gap-1 font-extrabold text-[#FF7328]">
                <Info className="w-3.5 h-3.5 text-[#FF7328]" /> STT & TTS Voice Engine Active
              </span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

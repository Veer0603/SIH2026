import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/useApp';
import { generateLocalBotResponse, queryGeminiAPI, QUICK_PROMPTS, DEFAULT_GEMINI_API_KEY } from '../utils/chatbotEngine';

let msgSequence = 0;
function createChatMessage(sender, text, actions = [], isGemini = false, model = 'Gemini 3.5') {
  msgSequence += 1;
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  return {
    id: `msg-${Date.now()}-${msgSequence}`,
    sender,
    timestamp: timeStr,
    text,
    actions,
    isGemini,
    model
  };
}

export default function AIAQIChatbot({ isFloating = true, onNavigate }) {
  const {
    stations,
    selectedStation,
    setSelectedStation,
    language,
    userProfile,
    addToast,
    t
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = sessionStorage.getItem('aeris_chat_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [
      {
        id: 'msg-welcome',
        sender: 'bot',
        timestamp: 'Live',
        text: language === 'hi'
          ? `👋 **नमस्ते! मैं AERIS दिल्ली वायु गुणवत्ता एआई सहायक हूँ।**\n\nवर्तमान में सक्रिय स्टेशन **${selectedStation.name}** है, जहाँ AQI **${selectedStation.aqi}** (${selectedStation.category}) दर्ज है।\n\nआप मुझसे बच्चों और बुजुर्गों की सुरक्षा, N95 मास्क, ग्रैप (GRAP) पाबंदियों, सुबह की सैर, या तापमान इनवर्जन के बारे में कुछ भी पूछ सकते हैं!`
          : `👋 **Hello! I am your AERIS Delhi Air Quality AI Assistant.**\n\nCurrently monitoring **${selectedStation.name}** with live AQI **${selectedStation.aqi}** (${selectedStation.category}).\n\nYou can ask me about child & elderly safety, N95 masks, GRAP stage restrictions, morning jogging hazards, or atmospheric inversion trapping!`,
        actions: [
          { type: 'select-station', stationId: selectedStation.id, label: `📍 ${selectedStation.shortName} AQI` },
          { type: 'navigate', page: 'ai-advisor', label: language === 'hi' ? '🤖 स्वास्थ्य सलाहकार' : '🤖 Health Advisor' }
        ]
      }
    ];
  });

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isFabDismissed, setIsFabDismissed] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);

  // Pre-configured Integrated Google Gemini 3.5 API
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY || DEFAULT_GEMINI_API_KEY;

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const handleSendMessageRef = useRef(null);

  // Keyboard Escape listener to close floating chatbot
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && isFloating) {
        setIsOpen(false);
        if (isSpeaking) {
          window.speechSynthesis.cancel();
          setIsSpeaking(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFloating, isSpeaking]);

  const handleCopyMessage = (msgId, text) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedMessageId(msgId);
      setTimeout(() => setCopiedMessageId(null), 2000);
      addToast(language === 'hi' ? 'उत्तर कॉपी किया गया' : 'Response copied to clipboard', 'info');
    } catch {
      // Fallback
    }
  };

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen || !isFloating) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping, isFloating]);

  // Persist session messages
  useEffect(() => {
    try {
      sessionStorage.setItem('aeris_chat_history', JSON.stringify(messages.slice(-30)));
    } catch {
      // Ignore
    }
  }, [messages]);

  // Setup Web Speech API Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputText(transcript);
          handleSendMessageRef.current?.(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const handleToggleVoiceInput = () => {
    if (!recognitionRef.current) {
      addToast(language === 'hi' ? 'आपके ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है' : 'Speech recognition is not supported in this browser', 'info');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        recognitionRef.current.start();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Text-To-Speech (TTS) Voice Synthesis
  const handleSpeakText = (text) => {
    if (!('speechSynthesis' in window)) {
      addToast('Speech synthesis not supported', 'info');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Clean markdown symbols for cleaner speech
    const cleanText = text
      .replace(/[*#_`]/g, '')
      .replace(/\[.*?\]\(.*?\)/g, '')
      .replace(/•/g, ', ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Dispatch message and get intelligent response
  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    setInputText('');

    const userMsg = createChatMessage('user', query);
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    const context = {
      stations,
      selectedStation,
      language,
      userProfile
    };

    try {
      let botResult = null;

      // 1. Direct Integrated Google Gemini 3.5 AI Engine
      try {
        botResult = await queryGeminiAPI(geminiKey, query, context);
      } catch (geminiErr) {
        console.warn('Gemini 3.5 query issue, smoothly falling back to local expert engine:', geminiErr);
      }

      // 2. Seamless Local Fallback if offline, error, or incomplete text
      if (!botResult || !botResult.text || botResult.text.trim().length < 30) {
        await new Promise(r => setTimeout(r, 350));
        botResult = generateLocalBotResponse(query, context);
      } else {
        // Double-check terminal punctuation so answers never cut off mid-thought
        const trimmed = botResult.text.trim();
        const validEnds = ['.', '!', '?', '।', ')', '}', ']', '"', "'", '*'];
        if (!validEnds.includes(trimmed.slice(-1))) {
          const lastPeriod = Math.max(
            trimmed.lastIndexOf('.'),
            trimmed.lastIndexOf('!'),
            trimmed.lastIndexOf('?'),
            trimmed.lastIndexOf('।')
          );
          if (lastPeriod > 40) {
            botResult.text = trimmed.substring(0, lastPeriod + 1);
          } else {
            botResult = generateLocalBotResponse(query, context);
          }
        }
      }

      const botMsg = createChatMessage(
        'bot',
        botResult.text,
        botResult.actions || [],
        botResult.isGemini || false,
        botResult.model || 'Gemini 3.5'
      );

      setMessages(prev => [...prev, botMsg]);

      if (!isOpen && isFloating) {
        setUnreadCount(prev => prev + 1);
      }
    } catch (err) {
      console.error('Error generating AI response:', err);
      const fallbackMsg = createChatMessage(
        'bot',
        language === 'hi'
          ? 'क्षमा करें, उत्तर तैयार करने में समस्या आई। कृपया पुनः प्रयास करें।'
          : 'I apologize, an error occurred while processing your request. Please try again.'
      );
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    handleSendMessageRef.current = handleSendMessage;
  });

  const handleActionClick = (action) => {
    if (action.type === 'select-station') {
      const found = stations.find(s => s.id === action.stationId);
      if (found) {
        setSelectedStation(found);
        addToast(language === 'hi' ? `${found.name} चयनित किया गया` : `Selected ${found.name}`, 'info');
      }
    } else if (action.type === 'navigate' && onNavigate) {
      onNavigate(action.page);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'msg-welcome-new',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: language === 'hi'
          ? `चैट इतिहास साफ़ कर दिया गया है। आप दिल्ली की वायु गुणवत्ता और स्वास्थ्य सावधानियों के बारे में कोई भी प्रश्न पूछ सकते हैं!`
          : `Chat conversation cleared. How can I assist you with Delhi air telemetry or health precautions today?`
      }
    ]);
    sessionStorage.removeItem('aeris_chat_history');
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    addToast(language === 'hi' ? 'चैट इतिहास साफ़ किया गया' : 'Chat history cleared', 'info');
  };

  // High-fidelity structured markdown parser (eliminates sloppy AI output)
  const renderFormattedText = (rawText) => {
    if (!rawText) return null;
    const lines = rawText.split('\n');
    const elements = [];
    let currentList = [];

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul
            key={`list-${elements.length}`}
            style={{
              margin: '6px 0 10px 0',
              paddingLeft: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            {currentList.map((item, i) => (
              <li
                key={i}
                dangerouslySetInnerHTML={{ __html: item }}
                style={{ lineHeight: 1.55, fontSize: '13px' }}
              />
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      if (!trimmed) {
        flushList();
        return;
      }

      // Check for bullet items (*, -, •, 1., 2., etc.)
      const bulletMatch = trimmed.match(/^([*\-•]|\d+\.)\s+(.+)$/);
      if (bulletMatch) {
        let content = bulletMatch[2];
        content = content.replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--text-main); font-weight: 700;">$1</strong>');
        content = content.replace(/`([^`]+)`/g, '<code style="background: rgba(120,120,120,0.15); padding: 1px 4px; border-radius: 3px; font-size: 11.5px;">$1</code>');
        currentList.push(content);
        return;
      }

      // Not a bullet line -> flush any preceding bullet list
      flushList();

      // Check for header (###, ##, #)
      const headerMatch = trimmed.match(/^#{1,4}\s+(.+)$/);
      if (headerMatch) {
        let title = headerMatch[1].replace(/\*\*(.*?)\*\*/g, '$1');
        elements.push(
          <div
            key={`h-${idx}`}
            style={{
              fontWeight: 800,
              fontSize: '13.5px',
              marginTop: '10px',
              marginBottom: '4px',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{title}</span>
          </div>
        );
        return;
      }

      // Regular paragraph line
      let formatted = trimmed
        .replace(/\*\*(.*?)\*\*/g, '<strong style="color: var(--text-main); font-weight: 700;">$1</strong>')
        .replace(/`([^`]+)`/g, '<code style="background: rgba(120,120,120,0.15); padding: 1px 4px; border-radius: 3px; font-size: 11.5px;">$1</code>');

      elements.push(
        <div
          key={`p-${idx}`}
          dangerouslySetInnerHTML={{ __html: formatted }}
          style={{
            marginBottom: '6px',
            lineHeight: 1.55,
            fontSize: '13px'
          }}
        />
      );
    });

    flushList();
    return elements;
  };

  // Chat window body content (shared between floating drawer and standalone page)
  const chatBody = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Messages Thread Container */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                gap: '8px'
              }}
            >
              {!isUser && (
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1e3a8a, #0284c7)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '15px',
                    flexShrink: 0,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                  }}
                >
                  🤖
                </div>
              )}

              <div
                style={{
                  maxWidth: isFloating ? '84%' : '78%',
                  backgroundColor: isUser ? 'var(--accent-primary)' : 'var(--bg-panel-subtle)',
                  color: isUser ? '#ffffff' : 'var(--text-main)',
                  borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  padding: '12px 15px',
                  fontSize: '13px',
                  boxShadow: 'var(--shadow-sm)',
                  border: isUser ? 'none' : '1px solid var(--border-color)',
                  position: 'relative'
                }}
              >
                {/* Bot Message Header: Model Tag + Copy Action (No Absolute Overlap) */}
                {!isUser && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                      paddingBottom: '5px',
                      borderBottom: '1px solid rgba(120, 120, 120, 0.15)',
                      gap: '8px'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        backgroundColor: msg.isGemini ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                        color: msg.isGemini ? '#2563eb' : '#059669',
                        padding: '2px 7px',
                        borderRadius: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px'
                      }}
                    >
                      {msg.isGemini ? `⚡ ${msg.model || 'Gemini 3.5'}` : '🛡️ AERIS Local'}
                    </span>

                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.text)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '11px',
                        color: copiedMessageId === msg.id ? '#16a34a' : 'var(--text-muted)',
                        padding: '2px 5px',
                        borderRadius: '4px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Copy response"
                    >
                      {copiedMessageId === msg.id ? '✓ Copied' : '📋 Copy'}
                    </button>
                  </div>
                )}

                <div>{renderFormattedText(msg.text)}</div>

                {/* Interactive Action Chips */}
                {msg.actions && msg.actions.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(120,120,120,0.15)' }}>
                    {msg.actions.map((act, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => handleActionClick(act)}
                        className="btn btn-outline btn-sm"
                        style={{
                          fontSize: '11px',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: 'var(--bg-panel)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-main)'
                        }}
                      >
                        {act.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Footer timestamp & listen button */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '8px',
                    fontSize: '10.5px',
                    opacity: isUser ? 0.75 : 0.65
                  }}
                >
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleSpeakText(msg.text)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '1px 4px',
                        fontSize: '12px',
                        color: 'inherit',
                        opacity: 0.85
                      }}
                      title={language === 'hi' ? 'सुनें (Text-to-Speech)' : 'Listen aloud'}
                    >
                      {isSpeaking ? '⏹️ Stop' : '🔊 Listen'}
                    </button>
                  )}
                </div>
              </div>

              {isUser && (
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-secondary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    flexShrink: 0
                  }}
                >
                  👤
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1e3a8a, #0284c7)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px'
              }}
            >
              🤖
            </div>
            <div
              style={{
                backgroundColor: 'var(--bg-panel-subtle)',
                padding: '8px 14px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                fontSize: '12px',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span className="live-pulse-dot" style={{ width: '6px', height: '6px' }} />
              {language === 'hi' ? 'उत्तर तैयार कर रहा है...' : 'AERIS AI is analyzing telemetry...'}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Question Chips */}
      <div
        style={{
          padding: '8px 12px',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-panel)',
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          scrollbarWidth: 'none'
        }}
      >
        {(QUICK_PROMPTS[language] || QUICK_PROMPTS.en).map(qp => (
          <button
            key={qp.id}
            onClick={() => handleSendMessage(qp.label)}
            className="btn btn-outline btn-sm"
            style={{
              fontSize: '11px',
              padding: '4px 9px',
              borderRadius: '14px',
              flexShrink: 0,
              backgroundColor: 'var(--bg-panel-subtle)',
              border: '1px solid var(--border-color)'
            }}
          >
            {qp.icon} {qp.label}
          </button>
        ))}
      </div>

      {/* Input Form Bar */}
      <div
        style={{
          padding: '12px 14px',
          borderTop: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-panel)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        {/* Voice Input Mic */}
        <button
          onClick={handleToggleVoiceInput}
          className="btn btn-outline btn-sm"
          style={{
            padding: '8px 10px',
            fontSize: '14px',
            borderRadius: '8px',
            backgroundColor: isListening ? '#ef4444' : 'transparent',
            color: isListening ? '#ffffff' : 'var(--text-main)',
            borderColor: isListening ? '#ef4444' : 'var(--border-color)',
            transition: 'all 0.2s ease'
          }}
          title={isListening ? 'Listening... click to stop' : 'Speak your question (Hindi / English)'}
        >
          {isListening ? '🔴' : '🎙️'}
        </button>

        {/* Text Input */}
        <input
          type="text"
          className="input-text"
          placeholder={
            language === 'hi'
              ? 'दिल्ली वायु गुणवत्ता, N95, ग्रैप या स्वास्थ्य संबंधित प्रश्न पूछें...'
              : 'Ask about Delhi air, health advice, N95 masks, GRAP...'
          }
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          style={{
            flex: 1,
            fontSize: '13px',
            padding: '9px 12px',
            borderRadius: '8px'
          }}
        />

        {/* Send Button */}
        <button
          onClick={() => handleSendMessage()}
          className="btn btn-sm"
          disabled={!inputText.trim()}
          style={{
            padding: '9px 14px',
            fontSize: '13px',
            fontWeight: 700,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <span>{language === 'hi' ? 'पूछें' : 'Ask'}</span>
          <span>➤</span>
        </button>
      </div>
    </div>
  );

  // Settings Drawer View
  const settingsModal = showSettings && (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        className="panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: 'var(--bg-panel)',
          borderRadius: 'var(--radius-panel)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⚡ Google Gemini 3.5 AI Engine</span>
            </div>
            <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 700, marginTop: '2px' }}>
              ● {language === 'hi' ? 'सक्रिय एवं प्रमाणित (कोई कस्टम कुंजी आवश्यक नहीं)' : 'Active & Authenticated (No Custom API Key Required)'}
            </div>
          </div>
          <button
            onClick={() => setShowSettings(false)}
            className="btn btn-outline btn-sm"
            style={{ padding: '3px 8px' }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12.5px' }}>
          <div style={{ padding: '12px', backgroundColor: 'var(--bg-panel-subtle)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontWeight: 800, marginBottom: '6px' }}>
              🧠 {language === 'hi' ? 'एआई आर्किटेक्चर विनिर्देश:' : 'Integrated AI Architecture:'}
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', lineHeight: 1.6, color: 'var(--text-main)', fontSize: '12px' }}>
              <li><strong>Model:</strong> Google Gemini 3.5 Flash &amp; Flash-Lite Cascade</li>
              <li><strong>Grounding:</strong> Live telemetry from 16 CPCB monitoring stations</li>
              <li><strong>Authentication:</strong> Pre-configured integrated production key</li>
              <li><strong>Fallback:</strong> Built-in AERIS clinical expert engine if offline</li>
            </ul>
          </div>

          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '12px', lineHeight: 1.5 }}>
            {language === 'hi'
              ? 'यह चैटबॉट सीधे Google Gemini 3.5 और दिल्ली प्रदूषण नियंत्रण बोर्ड (CPCB) के वास्तविक समय के डेटा से संचालित होता है। नागरिक बिना किसी अतिरिक्त कॉन्फ़िगरेशन के सीधे प्रश्न पूछ सकते हैं।'
              : 'This assistant runs on Google Gemini 3.5 seamlessly coupled with real-time Delhi NCR environmental chemistry models. Fully pre-authenticated for all citizens.'}
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
            <button onClick={() => setShowSettings(false)} className="btn btn-sm">
              {t('common.close', 'Close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // If rendering in Full-Page Standalone mode
  if (!isFloating) {
    return (
      <div
        className="panel"
        style={{
          height: 'calc(100vh - 200px)',
          minHeight: '620px',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Standalone Header */}
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--border-color)',
            backgroundColor: 'var(--bg-panel)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px',
                boxShadow: '0 2px 8px rgba(30, 58, 138, 0.25)'
              }}
            >
              🤖
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
                  {language === 'hi' ? 'AERIS दिल्ली एआई वायु परामर्शदाता' : 'AERIS Delhi Air Quality AI Assistant'}
                </h2>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(22, 163, 74, 0.12)',
                    color: '#16a34a'
                  }}
                >
                  ● {language === 'hi' ? 'सक्रिय एवं लाइव' : 'Online & Live'}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {language === 'hi'
                  ? `सक्रिय संदर्भ: ${selectedStation.name} (AQI: ${selectedStation.aqi} • ${selectedStation.category})`
                  : `Active Telemetry Context: ${selectedStation.name} (AQI: ${selectedStation.aqi} • ${selectedStation.category})`}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {onNavigate && (
              <button
                onClick={() => onNavigate('overview')}
                className="btn btn-outline btn-sm"
                style={{ fontWeight: 700 }}
              >
                ← {language === 'hi' ? 'डैशबोर्ड पर वापस' : 'Dashboard'}
              </button>
            )}
            <button
              onClick={() => setShowSettings(true)}
              className="btn btn-outline btn-sm"
              title="Configure AI Engine"
            >
              ⚙️ {language === 'hi' ? 'सेटिंग्स' : 'Engine Settings'}
            </button>
            <button
              onClick={handleClearHistory}
              className="btn btn-outline btn-sm"
              title="Clear chat"
            >
              🗑️ {language === 'hi' ? 'साफ़ करें' : 'Clear Chat'}
            </button>
          </div>
        </div>

        {chatBody}
        {settingsModal}
      </div>
    );
  }

  // Floating Mode Rendering
  return (
    <>
      {/* Floating Launcher Button at Bottom Right */}
      {!isOpen && !isFabDismissed && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <button
            onClick={() => {
              setIsOpen(true);
              setUnreadCount(0);
            }}
            className="chatbot-fab"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 18px',
              borderRadius: '30px',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #0284c7 100%)',
              color: '#ffffff',
              border: '2px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 8px 24px rgba(2, 132, 199, 0.45)',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '14px',
              transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            }}
          >
            <span style={{ fontSize: '18px' }}>🤖</span>
            <span>{language === 'hi' ? 'एआई से पूछें' : 'Ask AERIS AI'}</span>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#4ade80',
                boxShadow: '0 0 8px #4ade80'
              }}
            />

            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 800,
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #ffffff'
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dismiss button for floating launcher so user can hide it whenever they want */}
          <button
            onClick={() => {
              setIsFabDismissed(true);
              addToast(
                language === 'hi'
                  ? 'चैटबॉट छिपाया गया (नेविगेशन मेनू से कभी भी पुनः खोलें)'
                  : 'Chatbot hidden (accessible anytime from top navigation menu)',
                'info'
              );
            }}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              transition: 'all 0.2s ease'
            }}
            title={language === 'hi' ? 'फ्लोटिंग बटन बंद करें / हटाएं' : 'Close / dismiss floating button'}
          >
            ✕
          </button>
        </div>
      )}

      {/* Floating Expandable Chatbot Drawer & Backdrop */}
      {isOpen && (
        <>
          {/* Backdrop Click Dismiss */}
          <div
            onClick={() => {
              setIsOpen(false);
              if (isSpeaking) {
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
              }
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.45)',
              backdropFilter: 'blur(2px)',
              zIndex: 99998
            }}
            title="Click outside to close (Esc)"
          />

          <div
            className="panel chatbot-drawer"
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              width: '425px',
              maxWidth: 'calc(100vw - 32px)',
              height: '620px',
              maxHeight: 'calc(100vh - 48px)',
              zIndex: 99999,
              display: 'flex',
              flexDirection: 'column',
              padding: 0,
              overflow: 'hidden',
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
              border: '2px solid rgba(59, 130, 246, 0.4)',
              animation: 'fadeInUp 0.25s ease-out'
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #1e3a8a 0%, #0369a1 100%)',
                color: '#ffffff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px'
                  }}
                >
                  🤖
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '14.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{language === 'hi' ? 'AERIS दिल्ली एआई चैटबॉट' : 'AERIS Delhi Air AI'}</span>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#4ade80' }} />
                  </div>
                  <div style={{ fontSize: '11px', opacity: 0.85 }}>
                    {selectedStation.shortName} • AQI {selectedStation.aqi}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {/* Settings button */}
                <button
                  onClick={() => setShowSettings(true)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    padding: '4px 6px',
                    fontSize: '14px',
                    opacity: 0.9
                  }}
                  title="AI Settings"
                >
                  ⚙️
                </button>

                {/* Clear chat */}
                <button
                  onClick={handleClearHistory}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    padding: '4px 6px',
                    fontSize: '14px',
                    opacity: 0.9
                  }}
                  title="Clear Chat"
                >
                  🗑️
                </button>

                {/* Prominent High-Contrast Close Button */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    if (isSpeaking) {
                      window.speechSynthesis.cancel();
                      setIsSpeaking(false);
                    }
                  }}
                  style={{
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    padding: '5px 12px',
                    fontSize: '12px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)',
                    marginLeft: '4px'
                  }}
                  title={language === 'hi' ? 'चैटबॉट बंद करें (Esc)' : 'Close Chatbot (Esc)'}
                >
                  <span>✕</span>
                  <span>{language === 'hi' ? 'बंद करें' : 'Close'}</span>
                </button>
              </div>
            </div>

            {chatBody}
            {settingsModal}
          </div>
        </>
      )}
    </>
  );
}

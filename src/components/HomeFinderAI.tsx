import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  ShieldAlert,
  ArrowRight,
  Calendar,
  Layers,
  Phone,
  MessageSquare,
  AlertCircle,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { Project, AssistantChatMessage } from '../lib/types';
import { sendAssistantMessage, matchPropertiesFromQuery } from '../lib/ai-assistant';
import { PROPERTIES } from '../lib/data/properties';

interface HomeFinderAIProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProject: (project: Project) => void;
  onBookSiteVisit: (project: Project) => void;
}

export const HomeFinderAI: React.FC<HomeFinderAIProps> = ({
  isOpen,
  onClose,
  onSelectProject,
  onBookSiteVisit,
}) => {
  const [messages, setMessages] = useState<AssistantChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      content:
        'Greetings. I am **HomeFinder AI**, your personal advisory assistant for Elvira Crest Luxury Realty.\n\nI can recommend verified residences across Chennai, Coimbatore, and Bengaluru based on your preferred city, BHK configuration, budget, or lifestyle preferences.\n\nHow may I assist your property discovery today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedPrompts: [
        'I want a 2 BHK apartment in Chennai under ₹80 lakh',
        'Luxury 4 BHK beachfront sky villa on ECR',
        'Ready to move garden villas in Coimbatore',
        'Bespoke penthouses near Boat Club',
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    setErrorMessage(null);
    setLastQuery(query);

    const userMessage: AssistantChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await sendAssistantMessage(query, messages);
      
      const assistantMessage: AssistantChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProjectIds: response.recommendedProjects.map((p) => p.id),
        suggestedPrompts: response.suggestedFollowUps,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      // Deterministic recovery
      const fallback = matchPropertiesFromQuery(query);
      const fallbackMessage: AssistantChatMessage = {
        id: `ai-fallback-${Date.now()}`,
        sender: 'assistant',
        content: fallback.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        recommendedProjectIds: fallback.recommendedProjects.map((p) => p.id),
        suggestedPrompts: fallback.suggestedFollowUps,
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastQuery) {
      handleSendMessage(lastQuery);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // WhatsApp human advisor handoff
  const handleWhatsAppHandoff = () => {
    const text = encodeURIComponent(
      'Hello Elvira Crest Realty, I was chatting with HomeFinder AI regarding luxury residences in Tamil Nadu. I would like to speak with a senior acquisitions advisor.'
    );
    window.open(`https://wa.me/914448902200?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="assistant-drawer-title"
    >
      <div className="bg-[#FAF8F5] text-[#161D1A] w-full max-w-lg h-full shadow-2xl flex flex-col border-l border-[#DDD6C8] animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="bg-[#0D2818] text-[#FAF8F5] p-4 sm:px-6 flex items-center justify-between border-b border-[#1C3E29] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#C5A880] to-[#E8DFD0] p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-[#0D2818] rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#C5A880]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="assistant-drawer-title" className="font-serif text-base font-bold text-[#FAF8F5]">
                  HomeFinder AI™
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/40">
                  Live Catalogue
                </span>
              </div>
              <div className="text-[11px] text-[#A8BEB2]">
                Architectural Advisory • Tamil Nadu Portfolio
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-[#183F29] text-[#DFCCA8] hover:text-[#FAF8F5] transition-colors"
            aria-label="Close HomeFinder AI"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Factual Grounding Disclaimer Banner */}
        <div className="bg-[#123120] text-[#D1DDD6] px-4 py-2 text-[11px] flex items-center justify-between border-b border-[#1C3E29] shrink-0">
          <span className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-[#C5A880]" />
            Strictly grounded in verified developer RERA records
          </span>
          <button
            onClick={handleWhatsAppHandoff}
            className="text-[#DFCCA8] hover:text-white underline decoration-[#C5A880] flex items-center gap-1"
          >
            <span>WhatsApp Advisor</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Chat Transcript Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Message Bubble */}
              <div
                className={`max-w-[88%] rounded-sm p-4 text-xs leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-[#0D2818] text-[#FAF8F5] rounded-tr-none'
                    : 'bg-[#FFFFFF] text-[#1E2B24] border border-[#E5DFD3] rounded-tl-none'
                }`}
              >
                {/* Assistant formatted text with markdown styling */}
                <div className="whitespace-pre-wrap space-y-2">
                  {msg.content.split('\n\n').map((paragraph, pIdx) => (
                    <p key={pIdx}>
                      {paragraph.split('**').map((chunk, cIdx) =>
                        cIdx % 2 === 1 ? (
                          <strong key={cIdx} className="font-bold text-[#0D2818]">
                            {chunk}
                          </strong>
                        ) : (
                          chunk
                        )
                      )}
                    </p>
                  ))}
                </div>

                <div
                  className={`mt-2 text-[10px] text-right ${
                    msg.sender === 'user' ? 'text-[#8FAFA0]' : 'text-[#8C9690]'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {/* Embedded Recommended Project Cards */}
              {msg.recommendedProjectIds && msg.recommendedProjectIds.length > 0 && (
                <div className="mt-3 w-full space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#7A8680]">
                    Verified Property Matches:
                  </span>
                  {msg.recommendedProjectIds.map((pid) => {
                    const project = PROPERTIES.find((p) => p.id === pid);
                    if (!project) return null;

                    return (
                      <div
                        key={project.id}
                        className="bg-[#FFFFFF] border border-[#DDD6C8] rounded p-3 shadow-xs hover:border-[#0D2818] transition-all flex items-center justify-between gap-3"
                      >
                        <img
                          src={project.heroImage}
                          alt={project.name}
                          className="w-16 h-14 object-cover rounded shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-[#0D2818] truncate">
                            {project.name}
                          </div>
                          <div className="text-[11px] text-[#636F69] truncate">
                            {project.locality}, {project.city}
                          </div>
                          <div className="text-xs font-semibold text-[#0D2818] mt-0.5">
                            From {project.startingPriceDisplay}
                          </div>
                        </div>

                        <div className="flex flex-col gap-1 shrink-0">
                          <button
                            onClick={() => {
                              onSelectProject(project);
                              onClose();
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold border border-[#0D2818] text-[#0D2818] hover:bg-[#0D2818] hover:text-white rounded transition-colors"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => {
                              onBookSiteVisit(project);
                              onClose();
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold bg-[#C5A880] text-[#0D2818] hover:bg-[#D4BC9B] rounded transition-colors"
                          >
                            Visit
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Suggested Follow-up Prompt Chips */}
              {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5 max-w-[95%]">
                  {msg.suggestedPrompts.map((promptText, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => handleSendMessage(promptText)}
                      className="text-[11px] text-[#1E3B2B] bg-[#F2ECE1] hover:bg-[#E8DFC9] border border-[#DDD6C8] px-2.5 py-1 rounded text-left transition-colors flex items-center gap-1 active:scale-95"
                    >
                      <span>{promptText}</span>
                      <ArrowRight className="w-2.5 h-2.5 text-[#C5A880]" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-[#0D2818] text-[#C5A880] flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="bg-[#FFFFFF] border border-[#E5DFD3] rounded p-3 text-xs text-[#636F69] flex items-center gap-2">
                <span>Searching verified Tamil Nadu project inventory...</span>
              </div>
            </div>
          )}

          {/* Error Banner with Retry */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={handleRetry}
                className="flex items-center gap-1 text-red-800 font-semibold underline text-xs"
              >
                <RefreshCw className="w-3 h-3" /> Retry
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[#FFFFFF] border-t border-[#DDD6C8] shrink-0">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. 2 BHK in Chennai under ₹80 lakh..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="flex-1 bg-[#FAF8F5] border border-[#DDD6C8] rounded px-3 py-2 text-xs text-[#161D1A] placeholder:text-[#8C9690] focus:outline-none focus:border-[#0D2818] disabled:opacity-50"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputQuery.trim() || isLoading}
              className="h-[34px] px-3.5 rounded bg-[#0D2818] text-[#FAF8F5] hover:bg-[#183F29] disabled:opacity-40 transition-colors flex items-center justify-center"
              aria-label="Send message to assistant"
            >
              <Send className="w-3.5 h-3.5 text-[#C5A880]" />
            </button>
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px] text-[#8C9690]">
            <span>Grounded strictly on Elvira Crest portfolio.</span>
            <button
              onClick={handleWhatsAppHandoff}
              className="text-[#2A5E3F] hover:underline flex items-center gap-1"
            >
              <Phone className="w-2.5 h-2.5" /> Speak with Human Advisor
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

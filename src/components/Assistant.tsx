import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { X, Send, Sparkles, Bot, Lock } from 'lucide-react';

type Message = {
    id: string;
    text: string;
    isBot: boolean;
};

const Assistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hi! I'm your ReviewJet Assistant. I can help you navigate or check your metrics. Try asking 'How many reviews have we sent?'",
            isBot: true
        }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();
    const metrics = useStore(state => state.metrics);
    const customers = useStore(state => state.customers);
    const subscriptionTier = useStore(state => state.subscriptionTier);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        const newMessages = [...messages, { id: Date.now().toString(), text: userMsg, isBot: false }];
        setMessages(newMessages);
        setInput('');

        // Basic NLP / Intent Parsing
        const lowerInput = userMsg.toLowerCase();
        let botResponse = "I'm not sure how to help with that yet. Try asking about your stats, or ask me to navigate somewhere!";

        // Navigation Intents
        if (lowerInput.includes('billing') || lowerInput.includes('upgrade') || lowerInput.includes('plan')) {
            botResponse = "Taking you to the Billing page now!";
            setTimeout(() => navigate('/billing'), 800);
        } else if (lowerInput.includes('setting') || lowerInput.includes('setup') || lowerInput.includes('twilio')) {
            botResponse = "Taking you to Settings!";
            setTimeout(() => navigate('/settings'), 800);
        } else if (lowerInput.includes('dashboard') || lowerInput.includes('home')) {
            botResponse = "Taking you to the Dashboard!";
            setTimeout(() => navigate('/'), 800);
        } else if (lowerInput.includes('customer') || lowerInput.includes('directory') || lowerInput.includes('client')) {
            botResponse = "Taking you to your Customers Directory!";
            setTimeout(() => navigate('/customers'), 800);
        }

        // Data Fetching Intents
        else if (lowerInput.includes('how many review') || lowerInput.includes('total review') || (lowerInput.includes('sms') && lowerInput.includes('review'))) {
            botResponse = `You have sent ${metrics.reviewsSent} review requests so far!`;
        } else if (lowerInput.includes('how many offer') || lowerInput.includes('total offer') || (lowerInput.includes('sms') && lowerInput.includes('offer'))) {
            botResponse = `You have sent ${metrics.offersSent} special offers to returning clients!`;
        } else if (lowerInput.includes('sms was sent') || lowerInput.includes('sms sent') || lowerInput.includes('total sms')) {
            botResponse = `You've sent ${metrics.reviewsSent + metrics.offersSent} total SMS messages today (${metrics.reviewsSent} reviews, ${metrics.offersSent} offers).`;
        } else if (lowerInput.includes('how much have i made') || lowerInput.includes('revenue') || lowerInput.includes('earnings')) {
            const revEarnings = metrics.reviewClicks * 15; // Assume returning for review brings $15
            const offerEarnings = metrics.offerClicks * 45; // Assume returning for offer brings $45
            botResponse = `Based on your SMS click-through conversions, you've generated an estimated $${revEarnings + offerEarnings} in revenue today!`;
        } else if (lowerInput.includes('ctr') || lowerInput.includes('click through rate') || lowerInput.includes('clicks') || lowerInput.includes('stats')) {
            const reviewCtr = metrics.reviewsSent > 0 ? Math.round((metrics.reviewClicks / metrics.reviewsSent) * 100) : 0;
            const offerCtr = metrics.offersSent > 0 ? Math.round((metrics.offerClicks / metrics.offersSent) * 100) : 0;
            botResponse = `Here are your stats! Your Review CTR is ${reviewCtr}% (${metrics.reviewClicks} clicks). Your Offer CTR is ${offerCtr}%. (${metrics.offerClicks} clicks).`;
        } else if (lowerInput.includes('how many customer') || lowerInput.includes('total customer')) {
            botResponse = `You currently have ${customers.length} customers in your directory.`;
        } else if (lowerInput.includes('return') && (lowerInput.includes('client') || lowerInput.includes('customer'))) {
            const returnClients = customers.filter(c => c.visitCount > 1).length;
            botResponse = `You have ${returnClients} returning clients (more than 1 visit)!`;
        }

        setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now().toString(), text: botResponse, isBot: true }]);
        }, 500);
    };

    return (
        <>
            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all hover:scale-105 z-50 flex items-center justify-center group ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
            >
                <Sparkles size={24} className="group-hover:animate-pulse" />
            </button>

            {/* Chat Window */}
            <div
                className={`fixed bottom-6 right-6 w-[350px] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
                    }`}
                style={{ height: '500px', maxHeight: 'calc(100vh - 48px)' }}
            >
                {/* Header */}
                <div className="bg-indigo-600 p-4 rounded-t-2xl flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-white">
                        <Bot size={20} />
                        <h3 className="font-semibold text-sm tracking-wide">AI Assistant</h3>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-indigo-200 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {subscriptionTier === 'standard' ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-50 rounded-b-2xl">
                        <div className="bg-indigo-100 p-4 rounded-full mb-4">
                            <Lock size={32} className="text-indigo-600" />
                        </div>
                        <h4 className="font-bold text-slate-900 mb-2">Pro Feature Locked</h4>
                        <p className="text-sm text-slate-500 mb-6">Upgrade to the Pro tier to unlock the ReviewJet Sparkle AI Assistant.</p>
                        <button
                            onClick={() => {
                                setIsOpen(false);
                                navigate('/billing');
                            }}
                            className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
                        >
                            View Upgrade Plans
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                                    <div
                                        className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.isBot
                                            ? 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'
                                            : 'bg-indigo-600 text-white rounded-tr-none shadow-sm'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-slate-100 rounded-b-2xl">
                            <form onSubmit={handleSend} className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask me anything..."
                                    className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-sm transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send size={16} />
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Assistant;

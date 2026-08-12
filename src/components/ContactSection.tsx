import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Clock, 
  MessageSquare,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import { PortfolioProfile, ContactMessage } from '../types';
import { ThemeColor, themeSchemes } from '../utils/theme';

interface ContactSectionProps {
  profile: PortfolioProfile;
  currentTheme: ThemeColor;
  onSendMessage: (msg: ContactMessage) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  profile,
  currentTheme,
  onSendMessage
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const themeScheme = themeSchemes[currentTheme];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}`,
      name,
      email,
      subject: subject || 'สอบถามข้อมูลผลงาน / เสนอโครงการ',
      message,
      createdAt: new Date().toLocaleString('th-TH'),
      read: false
    };

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          subject: subject || 'สอบถามข้อมูลผลงาน / เสนอโครงการ',
          message
        })
      });
    } catch (err) {
      console.error("Error submitting message to backend REST API:", err);
    }

    onSendMessage(newMessage);
    setSubmitted(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');

    setTimeout(() => {
      setSubmitted(false);
    }, 6000);
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <section id="contact" className="py-20 relative bg-[#0A0A0A] text-[#F5F5F5] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF3B00]/10 border border-[#FF3B00]/40 text-[#FF3B00] font-mono text-xs uppercase tracking-widest font-bold">
            <Mail className="w-3.5 h-3.5" />
            <span>INITIATE CONTACT</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-anton uppercase tracking-tight text-white leading-none">
            GET IN TOUCH & <span className="text-[#FF3B00]">COLLABORATE</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed font-normal">
            Open for software consulting, high-impact project engineering, or creative tech collaborations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-6 sm:p-8 bg-[#111111] border border-white/15 space-y-6">
              
              <h3 className="font-anton text-2xl uppercase tracking-wide text-white">
                DIRECT CHANNELS
              </h3>

              {/* Email Item */}
              <div className="flex items-start justify-between p-4 bg-black border border-white/10 group hover:border-[#FF3B00] transition-all">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#FF3B00] text-black shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-slate-500 uppercase">
                      EMAIL ADDRESS
                    </div>
                    <div className="text-sm font-mono font-bold text-white break-all">
                      {profile.email}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(profile.email, 'email')}
                  className="p-2 text-slate-400 hover:text-[#FF3B00] transition-all cursor-pointer"
                  title="Copy Email"
                >
                  {copiedField === 'email' ? <Check className="w-4 h-4 text-[#FF3B00]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Phone Item */}
              {profile.phone && (
                <div className="flex items-start justify-between p-4 bg-black border border-white/10 group hover:border-[#FF3B00] transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#FF3B00] text-black shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase">
                        PHONE NUMBER
                      </div>
                      <div className="text-sm font-mono font-bold text-white">
                        {profile.phone}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(profile.phone, 'phone')}
                    className="p-2 text-slate-400 hover:text-[#FF3B00] transition-all cursor-pointer"
                    title="Copy Phone"
                  >
                    {copiedField === 'phone' ? <Check className="w-4 h-4 text-[#FF3B00]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}

              {/* Location Item */}
              <div className="flex items-center gap-3 p-4 bg-black border border-white/10">
                <div className="p-2.5 bg-[#FF3B00] text-black shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase">
                    LOCATION / BASED IN
                  </div>
                  <div className="text-sm font-mono font-bold text-white">
                    {profile.location}
                  </div>
                </div>
              </div>

              {/* Response Time Note */}
              <div className="p-4 bg-white/5 border border-white/10 flex items-center gap-3 text-xs font-mono text-slate-400">
                <Clock className="w-4 h-4 text-[#FF3B00] shrink-0" />
                <span>Typical response window: &lt; 24 business hours</span>
              </div>

            </div>

          </div>

          {/* Right Interactive Form */}
          <div className="lg:col-span-7">
            
            <div className="p-6 sm:p-8 bg-[#111111] border border-white/15 relative">
              
              {submitted && (
                <div className="mb-6 p-4 bg-[#FF3B00]/10 border border-[#FF3B00]/40 text-[#FF3B00] font-mono text-xs flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FF3B00] shrink-0" />
                  <div>
                    <span className="font-bold uppercase">MESSAGE DISPATCHED!</span> Thank you. Your inquiry has been registered into the queue.
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      YOUR NAME *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Mercer"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-black border border-white/20 text-white text-sm font-mono focus:outline-none focus:border-[#FF3B00] transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-black border border-white/20 text-white text-sm font-mono focus:outline-none focus:border-[#FF3B00] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    SUBJECT
                  </label>
                  <input
                    type="text"
                    placeholder="Project Inquiry / Tech Consulting"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-white/20 text-white text-sm font-mono focus:outline-none focus:border-[#FF3B00] transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                    MESSAGE CONTENT *
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe project details, timeline, or scope requirements..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-white/20 text-white text-sm font-mono focus:outline-none focus:border-[#FF3B00] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#FF3B00] text-black font-anton uppercase text-lg tracking-wider hover:bg-[#ff5520] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-5 h-5" />
                  <span>DISPATCH MESSAGE</span>
                </button>

              </form>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

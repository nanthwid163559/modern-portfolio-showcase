import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Terminal, 
  Database, 
  Activity, 
  ShieldCheck, 
  Lock, 
  Key, 
  Send, 
  Trash2, 
  Mail, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  FolderGit2, 
  Code2, 
  User, 
  Plus, 
  X, 
  ExternalLink,
  ChevronRight,
  Eye,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { PortfolioConfig, Project, Skill, ContactMessage } from '../types';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  config: PortfolioConfig;
  onRefreshData: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  isOpen,
  onClose,
  config,
  onRefreshData
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'messages' | 'api-tester' | 'projects-crud' | 'skills-crud' | 'supabase'>('overview');

  // Supabase Status State
  const [supabaseStatus, setSupabaseStatus] = useState<{
    configured: boolean;
    connected?: boolean;
    message: string;
    supabaseUrl?: string | null;
    sqlSchema?: string;
  } | null>(null);
  const [loadingSupabaseStatus, setLoadingSupabaseStatus] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Backend Stats
  const [stats, setStats] = useState<{
    serverTime: string;
    uptimeSeconds: number;
    totalApiRequests: number;
    totalProjects: number;
    totalSkills: number;
    totalExperiences: number;
    totalMessages: number;
    unreadMessages: number;
    nodeVersion: string;
    memoryUsageMB: number;
  } | null>(null);

  // Messages list from REST API
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // API Tester Console state
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('GET /api/portfolio');
  const [customRequestBody, setCustomRequestBody] = useState<string>('{\n  "title": "New REST API Test Project",\n  "category": "Web"\n}');
  const [apiResponse, setApiResponse] = useState<{ status: number; text: string; latencyMs: number } | null>(null);
  const [executingApi, setExecutingApi] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  // Quick form state for new project/skill via REST
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjCategory, setNewProjCategory] = useState<'Web' | 'Mobile' | 'AI & Data' | 'Full Stack'>('Web');
  const [newProjDesc, setNewProjDesc] = useState('');

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<'Frontend' | 'Backend' | 'Database' | 'AI & ML'>('Frontend');
  const [newSkillProf, setNewSkillProf] = useState(85);

  const [actionStatus, setActionStatus] = useState<string>('');

  // Fetch backend admin stats & messages
  const fetchAdminStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error("Failed to fetch admin stats:", e);
    }
  };

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (e) {
      console.error("Failed to fetch messages:", e);
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchSupabaseStatus = async () => {
    setLoadingSupabaseStatus(true);
    try {
      const res = await fetch('/api/supabase/status');
      if (res.ok) {
        const data = await res.json();
        setSupabaseStatus(data);
      }
    } catch (e) {
      console.error("Failed to fetch Supabase status:", e);
    } finally {
      setLoadingSupabaseStatus(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      fetchAdminStats();
      fetchMessages();
      fetchSupabaseStatus();
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen) return null;

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passcode || 'admin123' })
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
      } else {
        setAuthError(data.error || 'รหัสผ่านไม่ถูกต้อง');
      }
    } catch (err) {
      setAuthError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };

  const handleToggleMessageRead = async (id: string, currentRead: boolean) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: !currentRead })
      });
      if (res.ok) {
        fetchMessages();
        fetchAdminStats();
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('คุณต้องการลบข้อความนี้ใช่หรือไม่?')) return;
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchMessages();
        fetchAdminStats();
        onRefreshData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // REST API Tester execution
  const handleExecuteApiTester = async () => {
    setExecutingApi(true);
    setApiResponse(null);
    const start = performance.now();

    const [method, endpoint] = selectedEndpoint.split(' ');
    try {
      const options: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };

      if (['POST', 'PUT', 'PATCH'].includes(method) && customRequestBody) {
        options.body = customRequestBody;
      }

      const res = await fetch(endpoint, options);
      const text = await res.text();
      const end = performance.now();

      let formattedText = text;
      try {
        formattedText = JSON.stringify(JSON.parse(text), null, 2);
      } catch (e) {
        // raw text
      }

      setApiResponse({
        status: res.status,
        text: formattedText,
        latencyMs: Math.round(end - start)
      });

      // Refresh stats & data if mutation occurred
      if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
        fetchAdminStats();
        fetchMessages();
        onRefreshData();
      }
    } catch (err: any) {
      const end = performance.now();
      setApiResponse({
        status: 500,
        text: JSON.stringify({ error: err?.message || 'Network request failed' }, null, 2),
        latencyMs: Math.round(end - start)
      });
    } finally {
      setExecutingApi(false);
    }
  };

  // Quick REST Create Project
  const handleAddProjectViaRest = async () => {
    if (!newProjTitle) return;
    setActionStatus('กำลังส่งคำขอ POST /api/projects...');
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newProjTitle,
          category: newProjCategory,
          shortDescription: newProjDesc,
          tags: ["React", "TypeScript", "REST API"]
        })
      });
      if (res.ok) {
        setNewProjTitle('');
        setNewProjDesc('');
        setActionStatus('เพิ่มผลงานผ่าน REST API สำเร็จ!');
        fetchAdminStats();
        onRefreshData();
        setTimeout(() => setActionStatus(''), 3000);
      }
    } catch (err) {
      setActionStatus('เกิดข้อผิดพลาดในการส่งข้อมูล');
    }
  };

  // Quick REST Delete Project
  const handleDeleteProjectViaRest = async (id: string) => {
    if (!confirm(`ลบผลงานรหัส ${id} ผ่าน DELETE /api/projects/${id}?`)) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAdminStats();
        onRefreshData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Quick REST Add Skill
  const handleAddSkillViaRest = async () => {
    if (!newSkillName) return;
    setActionStatus('กำลังส่งคำขอ POST /api/skills...');
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newSkillName,
          category: newSkillCategory,
          proficiency: Number(newSkillProf) || 80
        })
      });
      if (res.ok) {
        setNewSkillName('');
        setActionStatus('เพิ่มทักษะผ่าน REST API สำเร็จ!');
        fetchAdminStats();
        onRefreshData();
        setTimeout(() => setActionStatus(''), 3000);
      }
    } catch (err) {
      setActionStatus('เกิดข้อผิดพลาดในการส่งข้อมูล');
    }
  };

  // Quick REST Delete Skill
  const handleDeleteSkillViaRest = async (id: string) => {
    try {
      const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAdminStats();
        onRefreshData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getCurlCommand = () => {
    const [method, endpoint] = selectedEndpoint.split(' ');
    const origin = window.location.origin;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      return `curl -X ${method} "${origin}${endpoint}" \\\n  -H "Content-Type: application/json" \\\n  -d '${customRequestBody.replace(/\n/g, '')}'`;
    }
    return `curl -X ${method} "${origin}${endpoint}"`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-6xl max-h-[92vh] bg-[#0A0A0A] text-[#F5F5F5] border border-white/20 shadow-2xl overflow-hidden flex flex-col font-mono">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 bg-[#111111] border-b border-white/15">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#FF3B00] text-black font-anton text-xl flex items-center justify-center">
              A
            </div>
            <div>
              <h2 className="font-anton text-2xl uppercase tracking-wider text-white leading-none flex items-center gap-2">
                <span>ADMIN PORTAL BACKEND</span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-[#FF3B00]/20 text-[#FF3B00] border border-[#FF3B00]/40">
                  REST API ENGINE
                </span>
              </h2>
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Express Server Engine running on port 3000</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-[#FF3B00] transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* AUTH SCREEN IF NOT LOGGED IN */}
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-8 bg-[#0A0A0A]">
            <div className="max-w-md w-full bg-[#111111] border border-white/15 p-6 sm:p-8 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-[#FF3B00]/20 border border-[#FF3B00] text-[#FF3B00] mx-auto flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="font-anton text-2xl uppercase tracking-wider text-white">
                  AUTHENTICATION REQUIRED
                </h3>
                <p className="text-xs text-slate-400">
                  เข้าสู่ระบบแผงควบคุมหลังบ้านด้วยรหัสผ่านแอดมิน
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 uppercase font-bold flex items-center justify-between">
                    <span>ADMIN PASSCODE</span>
                    <span className="text-slate-500">DEFAULT: admin123</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="admin123"
                      className="w-full px-4 py-3 bg-black border border-white/20 text-white text-sm focus:border-[#FF3B00] focus:outline-none"
                    />
                    <Key className="w-4 h-4 text-slate-500 absolute right-3 top-3.5" />
                  </div>
                </div>

                {authError && (
                  <div className="p-2.5 bg-rose-950/40 border border-rose-500/50 text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{authError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-[#FF3B00] hover:bg-[#ff5520] text-black font-anton text-sm uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>UNLOCK BACKEND PORTAL</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPasscode('admin123');
                    handleLogin();
                  }}
                  className="w-full py-2 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-mono transition-colors cursor-pointer border border-white/10"
                >
                  ⚡ Click to Demo Auto-Unlock (admin123)
                </button>
              </form>
            </div>
          </div>
        ) : (
          <>
            {/* Navigation Bar */}
            <div className="flex items-center gap-1 p-2 bg-black border-b border-white/15 overflow-x-auto text-xs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 font-anton text-xs uppercase tracking-wider flex items-center gap-2 border cursor-pointer transition-colors whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'bg-[#FF3B00] text-black border-[#FF3B00]'
                    : 'bg-[#111111] text-slate-300 border-white/10 hover:border-[#FF3B00] hover:text-[#FF3B00]'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>REST SYSTEM OVERVIEW</span>
              </button>

              <button
                onClick={() => setActiveTab('messages')}
                className={`px-4 py-2 font-anton text-xs uppercase tracking-wider flex items-center gap-2 border cursor-pointer transition-colors whitespace-nowrap relative ${
                  activeTab === 'messages'
                    ? 'bg-[#FF3B00] text-black border-[#FF3B00]'
                    : 'bg-[#111111] text-slate-300 border-white/10 hover:border-[#FF3B00] hover:text-[#FF3B00]'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>INBOX MESSAGES ({messages.length})</span>
                {messages.some(m => !m.read) && (
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('api-tester')}
                className={`px-4 py-2 font-anton text-xs uppercase tracking-wider flex items-center gap-2 border cursor-pointer transition-colors whitespace-nowrap ${
                  activeTab === 'api-tester'
                    ? 'bg-[#FF3B00] text-black border-[#FF3B00]'
                    : 'bg-[#111111] text-slate-300 border-white/10 hover:border-[#FF3B00] hover:text-[#FF3B00]'
                }`}
              >
                <Terminal className="w-4 h-4" />
                <span>REST API EXPLORER & CONSOLE</span>
              </button>

              <button
                onClick={() => setActiveTab('projects-crud')}
                className={`px-4 py-2 font-anton text-xs uppercase tracking-wider flex items-center gap-2 border cursor-pointer transition-colors whitespace-nowrap ${
                  activeTab === 'projects-crud'
                    ? 'bg-[#FF3B00] text-black border-[#FF3B00]'
                    : 'bg-[#111111] text-slate-300 border-white/10 hover:border-[#FF3B00] hover:text-[#FF3B00]'
                }`}
              >
                <FolderGit2 className="w-4 h-4" />
                <span>PROJECTS CRUD</span>
              </button>

              <button
                onClick={() => setActiveTab('skills-crud')}
                className={`px-4 py-2 font-anton text-xs uppercase tracking-wider flex items-center gap-2 border cursor-pointer transition-colors whitespace-nowrap ${
                  activeTab === 'skills-crud'
                    ? 'bg-[#FF3B00] text-black border-[#FF3B00]'
                    : 'bg-[#111111] text-slate-300 border-white/10 hover:border-[#FF3B00] hover:text-[#FF3B00]'
                }`}
              >
                <Code2 className="w-4 h-4" />
                <span>SKILLS CRUD</span>
              </button>

              <button
                onClick={() => setActiveTab('supabase')}
                className={`px-4 py-2 font-anton text-xs uppercase tracking-wider flex items-center gap-2 border cursor-pointer transition-colors whitespace-nowrap ${
                  activeTab === 'supabase'
                    ? 'bg-[#FF3B00] text-black border-[#FF3B00]'
                    : 'bg-[#111111] text-slate-300 border-white/10 hover:border-[#FF3B00] hover:text-[#FF3B00]'
                }`}
              >
                <Database className="w-4 h-4 text-emerald-400" />
                <span>SUPABASE DATABASE</span>
              </button>
            </div>

            {/* TAB CONTENT AREA */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#0A0A0A]">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  
                  {/* Status Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-[#111111] border border-white/15 space-y-2">
                      <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span>SERVER STATUS</span>
                        <Server className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-2xl font-anton text-emerald-400 uppercase">
                        ONLINE 200 OK
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Uptime: {stats ? `${stats.uptimeSeconds}s` : 'Calculated'} | Node {stats?.nodeVersion || 'v20'}
                      </div>
                    </div>

                    <div className="p-4 bg-[#111111] border border-white/15 space-y-2">
                      <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span>API REQUESTS SERVED</span>
                        <Activity className="w-4 h-4 text-[#FF3B00]" />
                      </div>
                      <div className="text-2xl font-anton text-white">
                        {stats?.totalApiRequests || 0} CALLS
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Logged in-memory & disk persistence
                      </div>
                    </div>

                    <div className="p-4 bg-[#111111] border border-white/15 space-y-2">
                      <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span>MESSAGES INBOX</span>
                        <Mail className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="text-2xl font-anton text-cyan-400">
                        {stats?.totalMessages || messages.length} MSG
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Unread: {stats?.unreadMessages || 0} new messages
                      </div>
                    </div>

                    <div className="p-4 bg-[#111111] border border-white/15 space-y-2">
                      <div className="flex items-center justify-between text-slate-400 text-xs">
                        <span>DATA ENTITIES</span>
                        <Database className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-2xl font-anton text-amber-400">
                        {config.projects.length} PROJ / {config.skills.length} SKILLS
                      </div>
                      <div className="text-[10px] text-slate-500">
                        JSON file store: ./data/portfolio-store.json
                      </div>
                    </div>
                  </div>

                  {/* REST Endpoint Matrix Summary */}
                  <div className="p-6 bg-[#111111] border border-white/15 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <h3 className="font-anton text-lg uppercase text-white flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-[#FF3B00]" />
                        <span>ACTIVE REST API ENDPOINT SPECIFICATIONS</span>
                      </h3>
                      <button
                        onClick={fetchAdminStats}
                        className="px-3 py-1 bg-black border border-white/20 text-xs text-slate-300 hover:text-[#FF3B00] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>PING REFRESH</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-black border border-white/10 space-y-1">
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold">GET</span>
                        <code className="text-white ml-2 font-bold">/api/portfolio</code>
                        <p className="text-[11px] text-slate-400 mt-1">Retrieves complete portfolio configuration JSON</p>
                      </div>

                      <div className="p-3 bg-black border border-white/10 space-y-1">
                        <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 font-bold">PUT</span>
                        <code className="text-white ml-2 font-bold">/api/portfolio</code>
                        <p className="text-[11px] text-slate-400 mt-1">Updates profile metadata and global store state</p>
                      </div>

                      <div className="p-3 bg-black border border-white/10 space-y-1">
                        <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 font-bold">GET</span>
                        <code className="text-white ml-2 font-bold">/api/projects</code>
                        <p className="text-[11px] text-slate-400 mt-1">Fetches all portfolio project records</p>
                      </div>

                      <div className="p-3 bg-black border border-white/10 space-y-1">
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 font-bold">POST</span>
                        <code className="text-white ml-2 font-bold">/api/projects</code>
                        <p className="text-[11px] text-slate-400 mt-1">Creates a new project item in backend store</p>
                      </div>

                      <div className="p-3 bg-black border border-white/10 space-y-1">
                        <span className="px-2 py-0.5 bg-rose-500/20 text-rose-400 font-bold">DELETE</span>
                        <code className="text-white ml-2 font-bold">/api/projects/:id</code>
                        <p className="text-[11px] text-slate-400 mt-1">Deletes project entity by unique identifier</p>
                      </div>

                      <div className="p-3 bg-black border border-white/10 space-y-1">
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 font-bold">POST</span>
                        <code className="text-white ml-2 font-bold">/api/messages</code>
                        <p className="text-[11px] text-slate-400 mt-1">Receives contact form submissions from visitors</p>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: INBOX MESSAGES */}
              {activeTab === 'messages' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-anton text-xl uppercase text-white tracking-wide">
                      VISITOR CONTACT MESSAGES ({messages.length})
                    </h3>
                    <button
                      onClick={fetchMessages}
                      className="px-3 py-1.5 bg-[#111111] border border-white/20 text-xs text-white hover:border-[#FF3B00] hover:text-[#FF3B00] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loadingMessages ? 'animate-spin' : ''}`} />
                      <span>RELOAD MESSAGES</span>
                    </button>
                  </div>

                  {messages.length === 0 ? (
                    <div className="p-12 text-center bg-[#111111] border border-white/15 space-y-2">
                      <Mail className="w-10 h-10 text-slate-600 mx-auto" />
                      <p className="text-sm font-anton uppercase text-slate-400">NO MESSAGES INBOX YET</p>
                      <p className="text-xs text-slate-500">
                        When visitors fill out the Contact section form, their REST POST payload will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-4 border transition-all space-y-3 ${
                            msg.read
                              ? 'bg-[#0A0A0A] border-white/10 opacity-75'
                              : 'bg-[#111111] border-[#FF3B00]/60 shadow-lg'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
                            <div className="flex items-center gap-2">
                              {!msg.read && (
                                <span className="px-2 py-0.5 bg-[#FF3B00] text-black font-bold text-[10px] uppercase">
                                  NEW UNREAD
                                </span>
                              )}
                              <span className="text-sm font-bold text-white">{msg.name}</span>
                              <span className="text-xs text-[#FF3B00]">&lt;{msg.email}&gt;</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{new Date(msg.createdAt).toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="text-xs font-bold text-slate-300 uppercase">
                              SUBJECT: {msg.subject}
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed bg-black/60 p-3 border border-white/5 whitespace-pre-wrap">
                              {msg.message}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <a
                              href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                              className="px-3 py-1 bg-[#FF3B00]/20 border border-[#FF3B00] text-[#FF3B00] text-xs hover:bg-[#FF3B00] hover:text-black transition-colors flex items-center gap-1"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>REPLY VIA EMAIL</span>
                            </a>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleToggleMessageRead(msg.id, msg.read)}
                                className="px-3 py-1 bg-white/5 border border-white/20 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
                              >
                                {msg.read ? 'MARK UNREAD' : 'MARK READ'}
                              </button>
                              <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="p-1 text-rose-500 hover:text-rose-400 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: REST API EXPLORER & CONSOLE */}
              {activeTab === 'api-tester' && (
                <div className="space-y-6">
                  
                  <div className="p-6 bg-[#111111] border border-white/15 space-y-4">
                    <h3 className="font-anton text-lg uppercase text-white flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-[#FF3B00]" />
                      <span>INTERACTIVE REST API EXPLORER</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      
                      {/* Endpoint Selector */}
                      <div className="md:col-span-5 space-y-3">
                        <label className="text-[10px] text-slate-400 uppercase font-bold">
                          SELECT API ENDPOINT
                        </label>
                        <select
                          value={selectedEndpoint}
                          onChange={(e) => {
                            setSelectedEndpoint(e.target.value);
                            if (e.target.value.includes('POST /api/projects')) {
                              setCustomRequestBody(JSON.stringify({
                                title: "REST Created Project",
                                category: "AI & Data",
                                shortDescription: "Created dynamically via REST API Console",
                                tags: ["Express", "REST", "Node.js"]
                              }, null, 2));
                            } else if (e.target.value.includes('POST /api/messages')) {
                              setCustomRequestBody(JSON.stringify({
                                name: "Test Client",
                                email: "client@example.com",
                                subject: "Project Inquiry via REST Console",
                                message: "Hello! I would like to hire you for a custom full-stack web project."
                              }, null, 2));
                            } else if (e.target.value.includes('POST /api/skills')) {
                              setCustomRequestBody(JSON.stringify({
                                name: "GraphQL & REST Architecture",
                                category: "Backend",
                                proficiency: 92
                              }, null, 2));
                            }
                          }}
                          className="w-full px-3 py-2.5 bg-black border border-white/20 text-xs text-white focus:border-[#FF3B00] focus:outline-none font-mono"
                        >
                          <option value="GET /api/portfolio">GET /api/portfolio (Fetch full portfolio)</option>
                          <option value="GET /api/projects">GET /api/projects (List projects)</option>
                          <option value="POST /api/projects">POST /api/projects (Create project)</option>
                          <option value="GET /api/skills">GET /api/skills (List skills)</option>
                          <option value="POST /api/skills">POST /api/skills (Create skill)</option>
                          <option value="GET /api/messages">GET /api/messages (List inbox messages)</option>
                          <option value="POST /api/messages">POST /api/messages (Submit contact message)</option>
                          <option value="GET /api/admin/stats">GET /api/admin/stats (Backend system metrics)</option>
                          <option value="GET /api/health">GET /api/health (Server health & uptime)</option>
                        </select>

                        {/* Request payload editor for POST/PUT */}
                        {['POST', 'PUT', 'PATCH'].some(m => selectedEndpoint.startsWith(m)) && (
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 uppercase font-bold">
                              REQUEST JSON PAYLOAD
                            </label>
                            <textarea
                              value={customRequestBody}
                              onChange={(e) => setCustomRequestBody(e.target.value)}
                              rows={8}
                              className="w-full px-3 py-2 bg-black border border-white/20 text-xs font-mono text-emerald-400 focus:border-[#FF3B00] focus:outline-none"
                            />
                          </div>
                        )}

                        <button
                          onClick={handleExecuteApiTester}
                          disabled={executingApi}
                          className="w-full py-3 bg-[#FF3B00] hover:bg-[#ff5520] text-black font-anton text-sm uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
                        >
                          {executingApi ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          <span>EXECUTE REST REQUEST</span>
                        </button>
                      </div>

                      {/* Response Console */}
                      <div className="md:col-span-7 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-[10px] text-slate-400 uppercase font-bold">
                            REST RESPONSE INSPECTOR
                          </label>
                          {apiResponse && (
                            <span className="text-xs font-mono text-emerald-400">
                              STATUS: {apiResponse.status} | LATENCY: {apiResponse.latencyMs}ms
                            </span>
                          )}
                        </div>

                        <div className="p-4 bg-black border border-white/20 min-h-[260px] max-h-[380px] overflow-y-auto font-mono text-xs text-slate-200 custom-scrollbar">
                          {apiResponse ? (
                            <pre className="text-emerald-400 text-[11px] whitespace-pre-wrap leading-relaxed">
                              {apiResponse.text}
                            </pre>
                          ) : (
                            <div className="text-slate-600 text-center py-16">
                              Click "EXECUTE REST REQUEST" to test endpoint live on Node.js Express server.
                            </div>
                          )}
                        </div>

                        {/* cURL snippet copy */}
                        <div className="p-3 bg-[#0A0A0A] border border-white/10 flex items-center justify-between text-[11px]">
                          <code className="text-slate-400 truncate max-w-sm">
                            {getCurlCommand().replace(/\n/g, ' ')}
                          </code>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(getCurlCommand());
                              setCopiedCurl(true);
                              setTimeout(() => setCopiedCurl(false), 2000);
                            }}
                            className="px-2.5 py-1 bg-white/10 hover:bg-[#FF3B00] hover:text-black text-white text-[10px] font-mono transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            {copiedCurl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedCurl ? 'COPIED cURL' : 'COPY cURL'}</span>
                          </button>
                        </div>

                      </div>

                    </div>
                  </div>

                </div>
              )}

              {/* TAB 4: PROJECTS CRUD VIA REST */}
              {activeTab === 'projects-crud' && (
                <div className="space-y-6">
                  
                  {/* Create New Project Form */}
                  <div className="p-6 bg-[#111111] border border-white/15 space-y-4">
                    <h3 className="font-anton text-lg uppercase text-white flex items-center gap-2">
                      <Plus className="w-5 h-5 text-[#FF3B00]" />
                      <span>CREATE NEW PROJECT (REST POST /api/projects)</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase">PROJECT TITLE *</label>
                        <input
                          type="text"
                          value={newProjTitle}
                          onChange={(e) => setNewProjTitle(e.target.value)}
                          placeholder="e.g. AI Workflow SaaS"
                          className="w-full px-3 py-2 bg-black border border-white/20 text-xs text-white focus:border-[#FF3B00] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase">CATEGORY</label>
                        <select
                          value={newProjCategory}
                          onChange={(e) => setNewProjCategory(e.target.value as any)}
                          className="w-full px-3 py-2 bg-black border border-white/20 text-xs text-white focus:border-[#FF3B00] focus:outline-none"
                        >
                          <option value="Web">Web</option>
                          <option value="Mobile">Mobile</option>
                          <option value="AI & Data">AI & Data</option>
                          <option value="Full Stack">Full Stack</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 uppercase">SHORT DESCRIPTION</label>
                      <input
                        type="text"
                        value={newProjDesc}
                        onChange={(e) => setNewProjDesc(e.target.value)}
                        placeholder="Brief summary of what this project accomplishes"
                        className="w-full px-3 py-2 bg-black border border-white/20 text-xs text-white focus:border-[#FF3B00] focus:outline-none"
                      />
                    </div>

                    <button
                      onClick={handleAddProjectViaRest}
                      className="px-6 py-2.5 bg-[#FF3B00] hover:bg-[#ff5520] text-black font-anton text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      POST /api/projects
                    </button>

                    {actionStatus && (
                      <p className="text-xs font-mono text-[#FF3B00]">{actionStatus}</p>
                    )}
                  </div>

                  {/* List of Current Projects */}
                  <div className="space-y-3">
                    <h3 className="font-anton text-lg uppercase text-white">
                      EXISTING PROJECTS ({config.projects.length})
                    </h3>

                    {config.projects.map((p) => (
                      <div
                        key={p.id}
                        className="p-4 bg-[#111111] border border-white/15 flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white">{p.title}</span>
                            <span className="px-2 py-0.5 bg-white/10 text-[10px] font-mono text-slate-300">
                              {p.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{p.shortDescription}</p>
                        </div>

                        <button
                          onClick={() => handleDeleteProjectViaRest(p.id)}
                          className="px-3 py-1.5 bg-rose-950/40 border border-rose-500/50 text-rose-400 text-xs hover:bg-rose-500 hover:text-black transition-colors cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>DELETE REST</span>
                        </button>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* TAB 5: SKILLS CRUD VIA REST */}
              {activeTab === 'skills-crud' && (
                <div className="space-y-6">
                  
                  {/* Create New Skill Form */}
                  <div className="p-6 bg-[#111111] border border-white/15 space-y-4">
                    <h3 className="font-anton text-lg uppercase text-white flex items-center gap-2">
                      <Plus className="w-5 h-5 text-[#FF3B00]" />
                      <span>ADD TECHNICAL SKILL (REST POST /api/skills)</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase">SKILL NAME *</label>
                        <input
                          type="text"
                          value={newSkillName}
                          onChange={(e) => setNewSkillName(e.target.value)}
                          placeholder="e.g. Express & REST APIs"
                          className="w-full px-3 py-2 bg-black border border-white/20 text-xs text-white focus:border-[#FF3B00] focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase">CATEGORY</label>
                        <select
                          value={newSkillCategory}
                          onChange={(e) => setNewSkillCategory(e.target.value as any)}
                          className="w-full px-3 py-2 bg-black border border-white/20 text-xs text-white focus:border-[#FF3B00] focus:outline-none"
                        >
                          <option value="Frontend">Frontend</option>
                          <option value="Backend">Backend</option>
                          <option value="Database">Database</option>
                          <option value="AI & ML">AI & ML</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 uppercase">PROFICIENCY (%)</label>
                        <input
                          type="number"
                          value={newSkillProf}
                          onChange={(e) => setNewSkillProf(Number(e.target.value))}
                          min={10}
                          max={100}
                          className="w-full px-3 py-2 bg-black border border-white/20 text-xs text-[#FF3B00] font-bold focus:border-[#FF3B00] focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleAddSkillViaRest}
                      className="px-6 py-2.5 bg-[#FF3B00] hover:bg-[#ff5520] text-black font-anton text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      POST /api/skills
                    </button>

                    {actionStatus && (
                      <p className="text-xs font-mono text-[#FF3B00]">{actionStatus}</p>
                    )}
                  </div>

                  {/* Skills Grid */}
                  <div className="space-y-3">
                    <h3 className="font-anton text-lg uppercase text-white">
                      TECHNICAL SKILLS MATRIX ({config.skills.length})
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {config.skills.map((s) => (
                        <div
                          key={s.id}
                          className="p-3 bg-[#111111] border border-white/15 flex items-center justify-between gap-2"
                        >
                          <div>
                            <div className="text-xs font-bold text-white">{s.name}</div>
                            <div className="text-[10px] text-slate-400">
                              {s.category} • {s.proficiency}%
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteSkillViaRest(s.id)}
                            className="p-1 text-rose-500 hover:text-rose-400 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 6: SUPABASE EXTERNAL DATABASE INTEGRATION */}
              {activeTab === 'supabase' && (
                <div className="space-y-6">
                  
                  {/* Status Banner */}
                  <div className="p-6 bg-[#111111] border border-white/15 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center font-bold">
                          <Database className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-anton text-xl uppercase text-white tracking-wide flex items-center gap-2">
                            <span>SUPABASE DATABASE STATUS</span>
                            {supabaseStatus?.connected ? (
                              <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/50">CONNECTED</span>
                            ) : supabaseStatus?.configured ? (
                              <span className="px-2 py-0.5 text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/50">CONFIGURED (MIGRATION PENDING)</span>
                            ) : (
                              <span className="px-2 py-0.5 text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/50">NOT CONFIGURED YET</span>
                            )}
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            เชื่อมต่อระบบบันทึกข้อมูลฐานข้อมูล Supabase PostgreSQL ภายนอก
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={fetchSupabaseStatus}
                        disabled={loadingSupabaseStatus}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-anton text-xs uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer shrink-0"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${loadingSupabaseStatus ? 'animate-spin' : ''}`} />
                        <span>CHECK CONNECTION LIVE</span>
                      </button>
                    </div>

                    {/* Status details message */}
                    <div className={`p-4 border text-xs font-mono leading-relaxed ${
                      supabaseStatus?.connected 
                        ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300' 
                        : supabaseStatus?.configured 
                        ? 'bg-amber-950/30 border-amber-500/50 text-amber-300'
                        : 'bg-black border-white/20 text-slate-300'
                    }`}>
                      {loadingSupabaseStatus ? (
                        <div className="flex items-center gap-2 text-slate-400">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Testing network roundtrip to Supabase server...</span>
                        </div>
                      ) : (
                        supabaseStatus?.message || "Click 'CHECK CONNECTION LIVE' to query Supabase status."
                      )}
                    </div>
                  </div>

                  {/* Setup Instructions Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Step 1: Environment Variables */}
                    <div className="p-6 bg-[#111111] border border-white/15 space-y-4">
                      <div className="flex items-center gap-2 text-[#FF3B00] font-anton text-sm uppercase">
                        <span className="w-6 h-6 rounded-full bg-[#FF3B00] text-black flex items-center justify-center font-bold text-xs">1</span>
                        <span>ตั้งค่า Environment Variables ใน AI Studio Secrets</span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        เปิดเมนู <strong>Settings / Environment Variables</strong> ใน AI Studio แล้วใส่ค่าดังนี้:
                      </p>

                      <div className="space-y-2 font-mono text-xs">
                        <div className="p-3 bg-black border border-white/10 space-y-1">
                          <span className="text-slate-400 text-[10px] block font-bold">KEY 1:</span>
                          <code className="text-emerald-400 font-bold">SUPABASE_URL</code>
                          <p className="text-[11px] text-slate-500">e.g. https://xyzcompany.supabase.co</p>
                        </div>

                        <div className="p-3 bg-black border border-white/10 space-y-1">
                          <span className="text-slate-400 text-[10px] block font-bold">KEY 2:</span>
                          <code className="text-emerald-400 font-bold">SUPABASE_ANON_KEY</code>
                          <p className="text-[11px] text-slate-500">Public anon key หรือ service role key จาก Supabase Dashboard</p>
                        </div>
                      </div>

                      <div className="p-3 bg-white/5 border border-white/10 text-[11px] text-slate-400 space-y-1">
                        <span className="font-bold text-white">📍 วิธีหาค่าจาก Supabase:</span>
                        <p>1. ไปที่ Supabase Dashboard (supabase.com)</p>
                        <p>2. เลือกโปรเจกต์ของคุณ &gt; Project Settings &gt; API</p>
                        <p>3. คัดลอก Project URL และ anon / service_role key มาใส่ใน Secrets Panel</p>
                      </div>
                    </div>

                    {/* Step 2: SQL Migration Script */}
                    <div className="p-6 bg-[#111111] border border-white/15 space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-[#FF3B00] font-anton text-sm uppercase">
                          <span className="w-6 h-6 rounded-full bg-[#FF3B00] text-black flex items-center justify-center font-bold text-xs">2</span>
                          <span>สร้าง ตาราง (Tables) ใน Supabase SQL Editor</span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          คัดลอก SQL Script ด้านล่าง ไปวางใน <strong>Supabase Dashboard &gt; SQL Editor</strong> แล้วกด Run:
                        </p>

                        <div className="relative">
                          <pre className="p-3 bg-black border border-white/20 font-mono text-[10px] text-emerald-400 max-h-[180px] overflow-y-auto whitespace-pre-wrap custom-scrollbar">
                            {supabaseStatus?.sqlSchema || `CREATE TABLE profiles (...);\nCREATE TABLE projects (...);\nCREATE TABLE skills (...);\nCREATE TABLE messages (...);`}
                          </pre>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (supabaseStatus?.sqlSchema) {
                            navigator.clipboard.writeText(supabaseStatus.sqlSchema);
                            setCopiedSql(true);
                            setTimeout(() => setCopiedSql(false), 2000);
                          }
                        }}
                        className="w-full py-2.5 bg-white/10 hover:bg-[#FF3B00] hover:text-black text-white font-anton text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer border border-white/20"
                      >
                        {copiedSql ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                        <span>{copiedSql ? 'COPIED SQL SCRIPT!' : 'COPY COMPLETE SQL SCHEMA'}</span>
                      </button>
                    </div>

                  </div>

                </div>
              )}

            </div>
          </>
        )}

      </div>
    </div>
  );
};

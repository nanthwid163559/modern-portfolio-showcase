import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { getSupabaseClient, SUPABASE_SQL_SCHEMA } from "./src/lib/supabase";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Ensure data directory exists
const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'portfolio-store.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Default Portfolio state
const initialData = {
  theme: 'orange',
  darkMode: true,
  profile: {
    name: "วิศวกร ซอฟต์แวร์ (Your Name)",
    title: "Senior Full-Stack & AI Solutions Engineer",
    tagline: "สร้างสรรค์ดิจิทัลพอร์ทโฟลิโอ & เว็บแอปพลิเคชันยุคใหม่ด้วย AI และ Modern Web Tech",
    bio: "นักพัฒนาซอฟต์แวร์ผู้หลงใหลในการออกแบบระบบ web architecture ที่มีประสิทธิภาพสูง สวยงาม ใช้งานง่าย และตอบโจทย์ธุรกิจจริง",
    aboutDetail: "ผมมีประสบการณ์กว่า 5 ปีในการพัฒนาระบบ Web Application, Cloud Infrastructure และ AI Integration ทำงานครอบคลุมทั้ง Frontend UI/UX, Scalable Microservices และ Machine Learning Pipelines มีเป้าหมายในการส่งมอบซอฟต์แวร์ระดับพรีเมียมที่รวดเร็ว ปลอดภัย และสร้างคุณค่าอย่างมหาศาล",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    coverUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1600",
    location: "Bangkok, Thailand",
    email: "contact@myportfolio.dev",
    phone: "+66 81 234 5678",
    status: "available",
    statusText: "พร้อมรับงาน Freelance / Full-time / Project Consulting",
    yearsExperience: 5,
    completedProjects: 0,
    happyClients: 0,
    socialLinks: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
      line: "@myportfolio",
      discord: "dev#1234",
      website: "https://myportfolio.dev"
    },
    resumeUrl: "#"
  },
  projects: [
    {
      id: "proj-1",
      title: "OmniAI - Smart Creative Studio",
      category: "AI & Data",
      shortDescription: "แพลตฟอร์ม AI สร้างสรรค์คอนเทนต์อัตโนมัติ รวบรวม GenAI Text, Image และ Data Analytics ในที่เดียว",
      fullDescription: "OmniAI เป็นซอฟต์แวร์ Web SaaS ที่รวมความสามารถของ LLMs และ Image Models เข้ากับระบบ Workflow Management ช่วยให้ทีมการตลาดและนักสร้างสรรค์ผลิตมัลติมีเดียคอนเทนต์ได้เร็วกว่าเดิม 10 เท่า พร้อมระบบ Analytics แบบ Real-time",
      imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000",
      gallery: [
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000"
      ],
      tags: ["React 19", "TypeScript", "Gemini API", "Tailwind CSS", "Node.js", "Redis"],
      featured: true,
      demoUrl: "https://example.com/demo1",
      githubUrl: "https://github.com/example/omniai",
      completionDate: "2026-03",
      client: "Global Tech Inc.",
      role: "Lead Full-Stack Developer",
      metrics: [
        { label: "User Growth", value: "+150k Active Users" },
        { label: "Performance", value: "99.9% Uptime" },
        { label: "Efficiency", value: "85% Time Saved" }
      ]
    },
    {
      id: "proj-2",
      title: "Nexus Dashboard - Enterprise FinTech Platform",
      category: "Full Stack",
      shortDescription: "ระบบบริหารจัดการธุรกรรมการเงินและวิเคราะห์สถิติเรียลไทม์ สำหรับธุรกิจระดับเอ็นเตอร์ไพรส์",
      fullDescription: "ระบบบริหารการเงินแบบ End-to-End รองรับการเชื่อมต่อกับ Payment Gateways หลากหลาย รองรับ Multi-Currency การคำนวณภาษีอัตโนมัติ และแสดงผล Visual Chart แบบ Interactive ตอบสนองการตัดสินใจอย่างแม่นยำ",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
      gallery: [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000"
      ],
      tags: ["Next.js", "TypeScript", "PostgreSQL", "Recharts", "Docker", "Tailwind CSS"],
      featured: true,
      demoUrl: "https://example.com/demo2",
      githubUrl: "https://github.com/example/nexus-fintech",
      completionDate: "2025-11",
      client: "FinTech Enterprise Solution",
      role: "Senior Backend & UI Architect",
      metrics: [
        { label: "Transaction Vol", value: "$12M+/Month" },
        { label: "Latency", value: "<45ms API Response" }
      ]
    }
  ],
  skills: [
    { id: "sk-1", name: "React & Next.js", category: "Frontend", proficiency: 95, iconName: "Code2", years: 5, featured: true },
    { id: "sk-2", name: "TypeScript", category: "Frontend", proficiency: 92, iconName: "FileCode", years: 4, featured: true },
    { id: "sk-3", name: "Tailwind CSS & Styling", category: "Frontend", proficiency: 98, iconName: "Palette", years: 5, featured: true },
    { id: "sk-4", name: "Node.js & Express", category: "Backend", proficiency: 88, iconName: "Server", years: 4, featured: true },
    { id: "sk-5", name: "Python & AI Models", category: "AI & ML", proficiency: 85, iconName: "Cpu", years: 3, featured: true },
    { id: "sk-6", name: "Gemini API & LLMs", category: "AI & ML", proficiency: 90, iconName: "Sparkles", years: 2, featured: true }
  ],
  experiences: [
    {
      id: "exp-1",
      company: "Innovation Digital Labs Co., Ltd.",
      role: "Senior Full-Stack & AI Solutions Lead",
      period: "2024 - ปัจจุบัน",
      location: "Bangkok, Thailand",
      description: "นำทีมพัฒนา Enterprise Web Applications และ AI-driven Products จัดทำสถาปัตยกรรมซอฟต์แวร์ และปรับปรุงประสิทธิภาพของระบบงาน",
      technologies: ["React 19", "TypeScript", "Node.js", "Gemini AI", "Docker", "GCP"],
      highlights: [
        "ออกแบบระบบ AI Assistant ช่วยลดเวลาบริการลูกค้าลง 60%",
        "นำทีมนักพัฒนา 8 คนในการสร้าง Web Dashboard ใหม่ล่าสุด",
        "ปรับปรุง Lighthouse Speed score ให้เพิ่มขึ้นเฉลี่ยเป็น 95+"
      ],
      current: true
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "มหาวิทยาลัยเทคโนโลยีชั้นนำ (University)",
      degree: "ปริญญาตรี วิทยาการคอมพิวเตอร์ (B.Sc. in Computer Science)",
      period: "2017 - 2021",
      description: "เน้นการศึกษาด้าน Software Engineering, Data Structures & Algorithms, Database Design และ Artificial Intelligence",
      honors: "เกียรตินิยมอันดับ 1 (First Class Honors)"
    }
  ],
  testimonials: [
    {
      id: "test-1",
      author: "คุณอนันต์ วงศ์สุวรรณ",
      role: "CEO & Co-Founder",
      company: "OmniTech Solutions",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
      content: "ทำงานด้วยแล้วประทับใจมาก ไม่เพียงแต่โค้ดเนียบและรวดเร็ว แต่ยังให้คำแนะนำเรื่อง UI/UX และระบบ AI เพิ่มเติมที่ทำให้ผลิตภัณฑ์ของเราโดดเด่นเหนือคู่แข่ง!",
      rating: 5
    }
  ],
  inboxMessages: []
};

// Global State in memory + persisted to JSON
let portfolioData = { ...initialData };
let apiCallCount = 0;
const serverStartTime = Date.now();

// Load persisted data if file exists
function loadDataFromDisk() {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      portfolioData = { ...initialData, ...parsed };
      console.log("Loaded portfolio data from disk successfully.");
    } else {
      saveDataToDisk();
    }
  } catch (err) {
    console.error("Error reading store from disk:", err);
  }
}

function saveDataToDisk() {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(portfolioData, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error writing store to disk:", err);
  }
}

// Initialize load
loadDataFromDisk();

// Middleware to log REST API calls
app.use("/api", (req, res, next) => {
  apiCallCount++;
  next();
});

// Lazy Gemini Client setup
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

/* ==========================================================================
   REST APIs - PORTFOLIO CONFIG & MANAGEMENT
   ========================================================================== */

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    uptimeSeconds: Math.floor((Date.now() - serverStartTime) / 1000),
    timestamp: new Date().toISOString(),
    apiRequestsServed: apiCallCount
  });
});

// 2. GET full portfolio
app.get("/api/portfolio", (req, res) => {
  res.json(portfolioData);
});

// 3. PUT update full portfolio
app.put("/api/portfolio", (req, res) => {
  const newConfig = req.body;
  if (!newConfig || typeof newConfig !== 'object') {
    return res.status(400).json({ error: "Invalid payload" });
  }
  portfolioData = { ...portfolioData, ...newConfig };
  saveDataToDisk();
  res.json({ success: true, message: "Portfolio config updated successfully", data: portfolioData });
});

/* ==========================================================================
   REST APIs - PROJECTS (CRUD)
   ========================================================================== */

// GET projects
app.get("/api/projects", (req, res) => {
  res.json({ count: portfolioData.projects.length, projects: portfolioData.projects });
});

// POST new project
app.post("/api/projects", (req, res) => {
  const proj = req.body;
  if (!proj.title) {
    return res.status(400).json({ error: "Project title is required" });
  }
  const newProj = {
    id: `proj-${Date.now()}`,
    category: "Web",
    shortDescription: "",
    fullDescription: "",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
    gallery: [],
    tags: ["React", "TypeScript"],
    featured: false,
    completionDate: new Date().toISOString().slice(0, 7),
    metrics: [],
    ...proj
  };
  portfolioData.projects.unshift(newProj);
  saveDataToDisk();
  res.status(201).json({ success: true, project: newProj });
});

// PUT update project by ID
app.put("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  const index = portfolioData.projects.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Project not found" });
  }
  portfolioData.projects[index] = { ...portfolioData.projects[index], ...req.body };
  saveDataToDisk();
  res.json({ success: true, project: portfolioData.projects[index] });
});

// DELETE project by ID
app.delete("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  const initialLen = portfolioData.projects.length;
  portfolioData.projects = portfolioData.projects.filter(p => p.id !== id);
  if (portfolioData.projects.length === initialLen) {
    return res.status(404).json({ error: "Project not found" });
  }
  saveDataToDisk();
  res.json({ success: true, message: `Project ${id} deleted` });
});

/* ==========================================================================
   REST APIs - SKILLS (CRUD)
   ========================================================================== */

// GET skills
app.get("/api/skills", (req, res) => {
  res.json({ count: portfolioData.skills.length, skills: portfolioData.skills });
});

// POST new skill
app.post("/api/skills", (req, res) => {
  const sk = req.body;
  if (!sk.name) {
    return res.status(400).json({ error: "Skill name is required" });
  }
  const newSkill = {
    id: `sk-${Date.now()}`,
    category: "Frontend",
    proficiency: 80,
    iconName: "Code2",
    years: 1,
    featured: false,
    ...sk
  };
  portfolioData.skills.push(newSkill);
  saveDataToDisk();
  res.status(201).json({ success: true, skill: newSkill });
});

// PUT update skill
app.put("/api/skills/:id", (req, res) => {
  const { id } = req.params;
  const index = portfolioData.skills.findIndex(s => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Skill not found" });
  }
  portfolioData.skills[index] = { ...portfolioData.skills[index], ...req.body };
  saveDataToDisk();
  res.json({ success: true, skill: portfolioData.skills[index] });
});

// DELETE skill
app.delete("/api/skills/:id", (req, res) => {
  const { id } = req.params;
  portfolioData.skills = portfolioData.skills.filter(s => s.id !== id);
  saveDataToDisk();
  res.json({ success: true, message: `Skill ${id} deleted` });
});

/* ==========================================================================
   REST APIs - CONTACT MESSAGES INBOX
   ========================================================================== */

// GET all contact messages
app.get("/api/messages", (req, res) => {
  res.json({
    count: portfolioData.inboxMessages.length,
    unreadCount: portfolioData.inboxMessages.filter(m => !m.read).length,
    messages: portfolioData.inboxMessages
  });
});

// POST submit a contact message (Visitor -> Backend)
app.post("/api/messages", (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message content are required" });
  }

  const newMessage = {
    id: `msg-${Date.now()}`,
    name,
    email,
    subject: subject || "No Subject",
    message,
    createdAt: new Date().toISOString(),
    read: false
  };

  portfolioData.inboxMessages.unshift(newMessage);
  saveDataToDisk();

  res.status(201).json({
    success: true,
    message: "Message submitted successfully",
    data: newMessage
  });
});

// PATCH toggle message read state
app.patch("/api/messages/:id", (req, res) => {
  const { id } = req.params;
  const { read } = req.body;
  const msg = portfolioData.inboxMessages.find(m => m.id === id);
  if (!msg) {
    return res.status(404).json({ error: "Message not found" });
  }
  msg.read = typeof read === 'boolean' ? read : !msg.read;
  saveDataToDisk();
  res.json({ success: true, message: msg });
});

// DELETE message
app.delete("/api/messages/:id", (req, res) => {
  const { id } = req.params;
  portfolioData.inboxMessages = portfolioData.inboxMessages.filter(m => m.id !== id);
  saveDataToDisk();
  res.json({ success: true, message: `Message ${id} removed` });
});

/* ==========================================================================
   REST APIs - SUPABASE EXTERNAL DATABASE INTEGRATION
   ========================================================================== */

app.get("/api/supabase/status", async (req, res) => {
  const supabase = getSupabaseClient();
  const configured = !!supabase;

  if (!configured) {
    return res.json({
      configured: false,
      message: "Supabase environment variables (SUPABASE_URL and SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY) are not set.",
      supabaseUrl: process.env.SUPABASE_URL || null,
      sqlSchema: SUPABASE_SQL_SCHEMA
    });
  }

  try {
    // Attempt a lightweight query to test Supabase connection
    const { data, error } = await supabase.from('projects').select('id').limit(1);
    
    if (error) {
      return res.json({
        configured: true,
        connected: false,
        message: `Connected to Supabase URL (${process.env.SUPABASE_URL}), but table query failed: ${error.message}. You may need to run the SQL migration script in Supabase SQL Editor.`,
        supabaseUrl: process.env.SUPABASE_URL,
        errorDetail: error,
        sqlSchema: SUPABASE_SQL_SCHEMA
      });
    }

    return res.json({
      configured: true,
      connected: true,
      message: `Successfully connected to Supabase Database at ${process.env.SUPABASE_URL}!`,
      supabaseUrl: process.env.SUPABASE_URL,
      sampleRecordsCount: data ? data.length : 0,
      sqlSchema: SUPABASE_SQL_SCHEMA
    });
  } catch (err: any) {
    return res.json({
      configured: true,
      connected: false,
      message: `Error connecting to Supabase: ${err.message}`,
      supabaseUrl: process.env.SUPABASE_URL,
      sqlSchema: SUPABASE_SQL_SCHEMA
    });
  }
});

app.get("/api/supabase/schema", (req, res) => {
  res.json({
    sql: SUPABASE_SQL_SCHEMA,
    instructions: "Copy and paste this SQL script into your Supabase Dashboard -> SQL Editor and click 'Run'."
  });
});

/* ==========================================================================
   REST APIs - ADMIN STATS & LOGIN
   ========================================================================== */

app.get("/api/admin/stats", (req, res) => {
  const supabase = getSupabaseClient();
  res.json({
    serverTime: new Date().toISOString(),
    uptimeSeconds: Math.floor((Date.now() - serverStartTime) / 1000),
    totalApiRequests: apiCallCount,
    totalProjects: portfolioData.projects.length,
    totalSkills: portfolioData.skills.length,
    totalExperiences: portfolioData.experiences.length,
    totalMessages: portfolioData.inboxMessages.length,
    unreadMessages: portfolioData.inboxMessages.filter(m => !m.read).length,
    nodeVersion: process.version,
    memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    supabaseConfigured: !!supabase,
    supabaseUrl: process.env.SUPABASE_URL || null
  });
});

app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  // Default admin passcode: admin123
  if (password === 'admin123' || password === '1234') {
    return res.json({
      success: true,
      token: `admin-token-${Date.now()}`,
      message: "Admin authentication successful"
    });
  } else {
    return res.status(401).json({ success: false, error: "Invalid password. Use 'admin123' or '1234'" });
  }
});

/* ==========================================================================
   AI ASSISTANT & CONTENT REFINER ENDPOINTS
   ========================================================================== */

app.post("/api/chat", async (req, res) => {
  try {
    const { message, profileContext } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured in environment."
      });
    }

    const systemInstruction = `You are a polite, intelligent, and articulate AI Career Assistant representing ${profileContext?.name || portfolioData.profile.name}.
Key Profile Context:
- Name: ${profileContext?.name || portfolioData.profile.name}
- Role: ${profileContext?.title || portfolioData.profile.title}
- Bio: ${profileContext?.bio || portfolioData.profile.bio}
- Location: ${profileContext?.location || portfolioData.profile.location}
- Email: ${profileContext?.email || portfolioData.profile.email}
- Status: ${profileContext?.statusText || portfolioData.profile.statusText}

Instructions:
1. Answer the user's questions about this portfolio, experience, skills, and projects warmly in natural language (use Thai if asked in Thai, or English if asked in English).
2. Keep responses helpful, concise, well-formatted, and enthusiastic about potential collaborations or job opportunities.
3. If asked about contact info, provide the email (${profileContext?.email || portfolioData.profile.email}) and encourage contacting directly.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text || "ขออภัยครับ ไม่สามารถสร้างคำตอบได้ในขณะนี้" });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

app.post("/api/refine-content", async (req, res) => {
  try {
    const { text, type, style } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured in environment."
      });
    }

    const prompt = `You are an expert tech resume writer and portfolio copywriter.
Task: Polish and enhance the following ${type || 'bio/description'} to sound highly professional, impressive, modern, and engaging.
Style preference: ${style || 'Professional and Inspiring'} (Maintain the original language - Thai if input is Thai, English if input is English).

Input Text:
"""
${text}
"""

Return ONLY the polished refined text without extra commentary or markdown quotes.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        temperature: 0.6,
      }
    });

    res.json({ refinedText: response.text?.trim() || text });
  } catch (error: any) {
    console.error("Gemini Refine Error:", error);
    res.status(500).json({ error: error?.message || "Internal server error" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

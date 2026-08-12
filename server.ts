import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { getSupabaseClient, SUPABASE_SQL_SCHEMA } from "./src/lib/supabase";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

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

async function fetchPortfolioFromSupabase() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data: profileRows, error: profileErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', 'default');

    if (profileErr) throw profileErr;

    const { data: projectRows, error: projectErr } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: true });

    if (projectErr) throw projectErr;

    const { data: skillRows, error: skillErr } = await supabase
      .from('skills')
      .select('*')
      .order('created_at', { ascending: true });

    if (skillErr) throw skillErr;

    const { data: expRows, error: expErr } = await supabase
      .from('experiences')
      .select('*')
      .order('created_at', { ascending: true });

    if (expErr) throw expErr;

    const { data: eduRows, error: eduErr } = await supabase
      .from('education')
      .select('*')
      .order('created_at', { ascending: true });

    if (eduErr) throw eduErr;

    const { data: testRows, error: testErr } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: true });

    if (testErr) throw testErr;

    const { data: msgRows, error: msgErr } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (msgErr) throw msgErr;

    if (profileRows && profileRows.length === 0) {
      console.log("No profile row found, initializing Supabase database with default portfolio data...");
      const defaultDbProfile = {
        id: 'default',
        name: initialData.profile.name,
        title: initialData.profile.title,
        tagline: initialData.profile.tagline,
        bio: initialData.profile.bio,
        about_detail: initialData.profile.aboutDetail,
        avatar_url: initialData.profile.avatarUrl,
        cover_url: initialData.profile.coverUrl,
        location: initialData.profile.location,
        email: initialData.profile.email,
        phone: initialData.profile.phone,
        status: initialData.profile.status,
        status_text: initialData.profile.statusText,
        years_experience: initialData.profile.yearsExperience,
        completed_projects: initialData.profile.completedProjects,
        happy_clients: initialData.profile.happyClients,
        social_links: initialData.profile.socialLinks,
        resume_url: initialData.profile.resumeUrl,
        theme: initialData.theme,
        dark_mode: initialData.darkMode
      };

      const { error: profErr } = await supabase.from('profiles').insert(defaultDbProfile);
      if (profErr) {
        console.error("Failed to insert default profile to Supabase:", profErr);
        throw profErr;
      }

      for (const proj of initialData.projects) {
        const { error: projErr } = await supabase.from('projects').insert({
          id: proj.id,
          title: proj.title,
          category: proj.category,
          short_description: proj.shortDescription,
          full_description: proj.fullDescription,
          image_url: proj.imageUrl,
          gallery: proj.gallery,
          tags: proj.tags,
          featured: proj.featured,
          demo_url: proj.demoUrl,
          github_url: proj.githubUrl,
          completion_date: proj.completionDate,
          metrics: proj.metrics,
          client: proj.client || "",
          role: proj.role || ""
        });
        if (projErr) console.error(`Failed to insert project ${proj.id} to Supabase:`, projErr);
      }
      for (const sk of initialData.skills) {
        const { error: skErr } = await supabase.from('skills').insert({
          id: sk.id,
          name: sk.name,
          category: sk.category,
          proficiency: sk.proficiency,
          icon_name: sk.iconName,
          years: sk.years,
          featured: sk.featured
        });
        if (skErr) console.error(`Failed to insert skill ${sk.id} to Supabase:`, skErr);
      }
      for (const exp of initialData.experiences) {
        const { error: expErr } = await supabase.from('experiences').insert({
          id: exp.id,
          company: exp.company,
          role: exp.role,
          period: exp.period,
          location: exp.location,
          description: exp.description,
          technologies: exp.technologies,
          highlights: exp.highlights,
          current: exp.current
        });
        if (expErr) console.error(`Failed to insert experience ${exp.id} to Supabase:`, expErr);
      }
      if (initialData.education) {
        for (const edu of initialData.education) {
          const { error: eduErr } = await supabase.from('education').insert({
            id: edu.id,
            institution: edu.institution,
            degree: edu.degree,
            period: edu.period,
            description: edu.description,
            honors: edu.honors
          });
          if (eduErr) console.error(`Failed to insert education ${edu.id} to Supabase:`, eduErr);
        }
      }
      for (const test of initialData.testimonials) {
        const { error: testErr } = await supabase.from('testimonials').insert({
          id: test.id,
          author: test.author,
          role: test.role,
          company: test.company,
          avatar_url: test.avatarUrl,
          content: test.content,
          rating: test.rating
        });
        if (testErr) console.error(`Failed to insert testimonial ${test.id} to Supabase:`, testErr);
      }

      console.log("Database initialized successfully!");
      return initialData;
    }

    const profileRow = profileRows && profileRows[0];
    const profile = profileRow ? {
      name: profileRow.name || "",
      title: profileRow.title || "",
      tagline: profileRow.tagline || "",
      bio: profileRow.bio || "",
      aboutDetail: profileRow.about_detail || "",
      avatarUrl: profileRow.avatar_url || "",
      coverUrl: profileRow.cover_url || "",
      location: profileRow.location || "",
      email: profileRow.email || "",
      phone: profileRow.phone || "",
      status: profileRow.status || "available",
      statusText: profileRow.status_text || "",
      yearsExperience: profileRow.years_experience || 0,
      completedProjects: profileRow.completed_projects || 0,
      happyClients: profileRow.happy_clients || 0,
      socialLinks: profileRow.social_links || {},
      resumeUrl: profileRow.resume_url || "#"
    } : { ...initialData.profile };

    const theme = profileRow ? (profileRow.theme || initialData.theme) : initialData.theme;
    const darkMode = profileRow ? (profileRow.dark_mode !== false) : initialData.darkMode;

    const projects = (projectRows || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      category: row.category,
      shortDescription: row.short_description || "",
      fullDescription: row.full_description || "",
      imageUrl: row.image_url || "",
      gallery: row.gallery || [],
      tags: row.tags || [],
      featured: !!row.featured,
      demoUrl: row.demo_url || "",
      githubUrl: row.github_url || "",
      completionDate: row.completion_date || "",
      metrics: row.metrics || [],
      client: row.client || "",
      role: row.role || ""
    }));

    const skills = (skillRows || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      category: row.category,
      proficiency: row.proficiency || 80,
      iconName: row.icon_name || "Code2",
      years: row.years || 1,
      featured: !!row.featured
    }));

    const experiences = (expRows || []).map((row: any) => ({
      id: row.id,
      company: row.company,
      role: row.role,
      period: row.period || "",
      location: row.location || "",
      description: row.description || "",
      technologies: row.technologies || [],
      highlights: row.highlights || [],
      current: !!row.current
    }));

    const education = (eduRows || []).map((row: any) => ({
      id: row.id,
      institution: row.institution,
      degree: row.degree,
      period: row.period || "",
      description: row.description || "",
      honors: row.honors || ""
    }));

    const testimonials = (testRows || []).map((row: any) => ({
      id: row.id,
      author: row.author,
      role: row.role || "",
      company: row.company || "",
      avatarUrl: row.avatar_url || "",
      content: row.content,
      rating: row.rating || 5
    }));

    const inboxMessages = (msgRows || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      subject: row.subject || "",
      message: row.message,
      createdAt: row.created_at || new Date().toISOString(),
      read: !!row.read
    }));

    return {
      theme,
      darkMode,
      profile,
      projects,
      skills,
      experiences,
      education,
      testimonials,
      inboxMessages
    };
  } catch (err: any) {
    console.warn("Supabase query failed, falling back to local memory/disk store. Error details:", err.message || err);
    return null;
  }
}

async function savePortfolioToSupabase(newConfig: any) {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    if (newConfig.profile || newConfig.theme !== undefined || newConfig.darkMode !== undefined) {
      const current = await fetchPortfolioFromSupabase() || initialData;
      const profile = newConfig.profile || current.profile;
      const theme = newConfig.theme || current.theme;
      const darkMode = newConfig.darkMode !== undefined ? newConfig.darkMode : current.darkMode;

      const dbProfile = {
        name: profile.name,
        title: profile.title,
        tagline: profile.tagline,
        bio: profile.bio,
        about_detail: profile.aboutDetail,
        avatar_url: profile.avatarUrl,
        cover_url: profile.coverUrl,
        location: profile.location,
        email: profile.email,
        phone: profile.phone,
        status: profile.status,
        status_text: profile.statusText,
        years_experience: profile.yearsExperience,
        completed_projects: profile.completedProjects,
        happy_clients: profile.happyClients,
        social_links: profile.socialLinks,
        resume_url: profile.resumeUrl,
        theme,
        dark_mode: darkMode,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .update(dbProfile)
        .eq('id', 'default');

      if (error) throw error;
    }

    if (newConfig.experiences) {
      await supabase.from('experiences').delete().neq('id', '');
      for (const exp of newConfig.experiences) {
        await supabase.from('experiences').insert({
          id: exp.id,
          company: exp.company,
          role: exp.role,
          period: exp.period,
          location: exp.location,
          description: exp.description,
          technologies: exp.technologies,
          highlights: exp.highlights,
          current: exp.current
        });
      }
    }

    if (newConfig.education) {
      await supabase.from('education').delete().neq('id', '');
      for (const edu of newConfig.education) {
        await supabase.from('education').insert({
          id: edu.id,
          institution: edu.institution,
          degree: edu.degree,
          period: edu.period,
          description: edu.description,
          honors: edu.honors
        });
      }
    }

    if (newConfig.testimonials) {
      await supabase.from('testimonials').delete().neq('id', '');
      for (const test of newConfig.testimonials) {
        await supabase.from('testimonials').insert({
          id: test.id,
          author: test.author,
          role: test.role,
          company: test.company,
          avatar_url: test.avatarUrl,
          content: test.content,
          rating: test.rating
        });
      }
    }

    if (newConfig.projects) {
      await supabase.from('projects').delete().neq('id', '');
      for (const proj of newConfig.projects) {
        await supabase.from('projects').insert({
          id: proj.id,
          title: proj.title,
          category: proj.category,
          short_description: proj.shortDescription,
          full_description: proj.fullDescription,
          image_url: proj.imageUrl,
          gallery: proj.gallery,
          tags: proj.tags,
          featured: proj.featured,
          demo_url: proj.demoUrl,
          github_url: proj.githubUrl,
          completion_date: proj.completionDate,
          metrics: proj.metrics,
          client: proj.client || "",
          role: proj.role || ""
        });
      }
    }

    if (newConfig.skills) {
      await supabase.from('skills').delete().neq('id', '');
      for (const sk of newConfig.skills) {
        await supabase.from('skills').insert({
          id: sk.id,
          name: sk.name,
          category: sk.category,
          proficiency: sk.proficiency,
          icon_name: sk.iconName,
          years: sk.years,
          featured: sk.featured
        });
      }
    }

    return true;
  } catch (err: any) {
    console.error("Failed to save to Supabase:", err.message || err);
    return false;
  }
}

// Initialize load
loadDataFromDisk();
fetchPortfolioFromSupabase().then(dbData => {
  if (dbData) {
    portfolioData = dbData;
    console.log("Initialized portfolio data from Supabase successfully.");
  }
});

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
app.get("/api/portfolio", async (req, res) => {
  const dbData = await fetchPortfolioFromSupabase();
  if (dbData) {
    portfolioData = dbData;
  }
  res.json(portfolioData);
});

// 3. PUT update full portfolio
app.put("/api/portfolio", async (req, res) => {
  const newConfig = req.body;
  if (!newConfig || typeof newConfig !== 'object') {
    return res.status(400).json({ error: "Invalid payload" });
  }
  const savedDb = await savePortfolioToSupabase(newConfig);
  portfolioData = { ...portfolioData, ...newConfig };
  saveDataToDisk();
  res.json({
    success: true,
    message: savedDb ? "Portfolio config updated successfully in Supabase & local disk" : "Portfolio config updated successfully on local disk",
    data: portfolioData
  });
});

/* ==========================================================================
   REST APIs - PROJECTS (CRUD)
   ========================================================================== */

// GET projects
app.get("/api/projects", async (req, res) => {
  const dbData = await fetchPortfolioFromSupabase();
  if (dbData) {
    portfolioData = dbData;
  }
  res.json({ count: portfolioData.projects.length, projects: portfolioData.projects });
});

// POST new project
app.post("/api/projects", async (req, res) => {
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
    client: "",
    role: "",
    ...proj
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('projects').insert({
        id: newProj.id,
        title: newProj.title,
        category: newProj.category,
        short_description: newProj.shortDescription,
        full_description: newProj.fullDescription,
        image_url: newProj.imageUrl,
        gallery: newProj.gallery,
        tags: newProj.tags,
        featured: newProj.featured,
        demo_url: newProj.demoUrl,
        github_url: newProj.githubUrl,
        completion_date: newProj.completionDate,
        metrics: newProj.metrics,
        client: newProj.client,
        role: newProj.role
      });
      if (error) throw error;
    } catch (err: any) {
      console.warn("Supabase project insert failed:", err.message || err);
    }
  }

  portfolioData.projects.unshift(newProj);
  saveDataToDisk();
  res.status(201).json({ success: true, project: newProj });
});

// PUT update project by ID
app.put("/api/projects/:id", async (req, res) => {
  const { id } = req.params;
  const index = portfolioData.projects.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Project not found" });
  }
  const updatedProj = { ...portfolioData.projects[index], ...req.body };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('projects').update({
        title: updatedProj.title,
        category: updatedProj.category,
        short_description: updatedProj.shortDescription,
        full_description: updatedProj.fullDescription,
        image_url: updatedProj.imageUrl,
        gallery: updatedProj.gallery,
        tags: updatedProj.tags,
        featured: updatedProj.featured,
        demo_url: updatedProj.demoUrl,
        github_url: updatedProj.githubUrl,
        completion_date: updatedProj.completionDate,
        metrics: updatedProj.metrics,
        client: updatedProj.client,
        role: updatedProj.role
      }).eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      console.warn("Supabase project update failed:", err.message || err);
    }
  }

  portfolioData.projects[index] = updatedProj;
  saveDataToDisk();
  res.json({ success: true, project: updatedProj });
});

// DELETE project by ID
app.delete("/api/projects/:id", async (req, res) => {
  const { id } = req.params;

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      console.warn("Supabase project delete failed:", err.message || err);
    }
  }

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
app.get("/api/skills", async (req, res) => {
  const dbData = await fetchPortfolioFromSupabase();
  if (dbData) {
    portfolioData = dbData;
  }
  res.json({ count: portfolioData.skills.length, skills: portfolioData.skills });
});

// POST new skill
app.post("/api/skills", async (req, res) => {
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

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('skills').insert({
        id: newSkill.id,
        name: newSkill.name,
        category: newSkill.category,
        proficiency: newSkill.proficiency,
        icon_name: newSkill.iconName,
        years: newSkill.years,
        featured: newSkill.featured
      });
      if (error) throw error;
    } catch (err: any) {
      console.warn("Supabase skill insert failed:", err.message || err);
    }
  }

  portfolioData.skills.push(newSkill);
  saveDataToDisk();
  res.status(201).json({ success: true, skill: newSkill });
});

// PUT update skill
app.put("/api/skills/:id", async (req, res) => {
  const { id } = req.params;
  const index = portfolioData.skills.findIndex(s => s.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Skill not found" });
  }
  const updatedSkill = { ...portfolioData.skills[index], ...req.body };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('skills').update({
        name: updatedSkill.name,
        category: updatedSkill.category,
        proficiency: updatedSkill.proficiency,
        icon_name: updatedSkill.iconName,
        years: updatedSkill.years,
        featured: updatedSkill.featured
      }).eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      console.warn("Supabase skill update failed:", err.message || err);
    }
  }

  portfolioData.skills[index] = updatedSkill;
  saveDataToDisk();
  res.json({ success: true, skill: updatedSkill });
});

// DELETE skill
app.delete("/api/skills/:id", async (req, res) => {
  const { id } = req.params;

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      console.warn("Supabase skill delete failed:", err.message || err);
    }
  }

  portfolioData.skills = portfolioData.skills.filter(s => s.id !== id);
  saveDataToDisk();
  res.json({ success: true, message: `Skill ${id} deleted` });
});

/* ==========================================================================
   REST APIs - CONTACT MESSAGES INBOX
   ========================================================================== */

// GET all contact messages
app.get("/api/messages", async (req, res) => {
  const dbData = await fetchPortfolioFromSupabase();
  if (dbData) {
    portfolioData = dbData;
  }
  res.json({
    count: portfolioData.inboxMessages.length,
    unreadCount: portfolioData.inboxMessages.filter(m => !m.read).length,
    messages: portfolioData.inboxMessages
  });
});

// POST submit a contact message (Visitor -> Backend)
app.post("/api/messages", async (req, res) => {
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

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('messages').insert({
        id: newMessage.id,
        name: newMessage.name,
        email: newMessage.email,
        subject: newMessage.subject,
        message: newMessage.message,
        read: newMessage.read,
        created_at: newMessage.createdAt
      });
      if (error) throw error;
    } catch (err: any) {
      console.warn("Supabase message insert failed:", err.message || err);
    }
  }

  portfolioData.inboxMessages.unshift(newMessage);
  saveDataToDisk();

  res.status(201).json({
    success: true,
    message: "Message submitted successfully",
    data: newMessage
  });
});

// PATCH toggle message read state
app.patch("/api/messages/:id", async (req, res) => {
  const { id } = req.params;
  const { read } = req.body;
  const msg = portfolioData.inboxMessages.find(m => m.id === id);
  if (!msg) {
    return res.status(404).json({ error: "Message not found" });
  }
  const newRead = typeof read === 'boolean' ? read : !msg.read;

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('messages').update({
        read: newRead
      }).eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      console.warn("Supabase message update failed:", err.message || err);
    }
  }

  msg.read = newRead;
  saveDataToDisk();
  res.json({ success: true, message: msg });
});

// DELETE message
app.delete("/api/messages/:id", async (req, res) => {
  const { id } = req.params;

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('messages').delete().eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      console.warn("Supabase message delete failed:", err.message || err);
    }
  }

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

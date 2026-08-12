import { PortfolioConfig } from '../types';

export const defaultPortfolioData: PortfolioConfig = {
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
    },
    {
      id: "proj-3",
      title: "Aura E-Commerce Modern Storefront",
      category: "Web",
      shortDescription: "ร้านค้าออนไลน์ความเร็วสูง พร้อมระบบการค้นหาอัจฉริยะ Checkout ลื่นไหล และ UI ระดับลักชัวรี",
      fullDescription: "พัฒนาขึ้นเพื่อมอบประสบการณ์การช้อปปิ้งแบบไร้รอยต่อ มีระบบ Dynamic Filtering, Instant Search, Live Stock Synchronization และการรองรับการแสดงผลทุกขนาดหน้าจออย่างสมบูรณ์แบบ",
      imageUrl: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=1000",
      gallery: [
        "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&q=80&w=1000"
      ],
      tags: ["React", "Vite", "Zustand", "Stripe API", "Tailwind CSS", "Framer Motion"],
      featured: true,
      demoUrl: "https://example.com/demo3",
      githubUrl: "https://github.com/example/aura-shop",
      completionDate: "2025-08",
      client: "Aura Luxury Brand",
      role: "Frontend Lead",
      metrics: [
        { label: "Conversion Rate", value: "+34%" },
        { label: "Lighthouse Score", value: "99/100" }
      ]
    },
    {
      id: "proj-4",
      title: "HealthPulse - Mobile Health Tracker App",
      category: "Mobile",
      shortDescription: "แอปพลิเคชันบันทึกและวิเคราะห์สุขภาพส่วนบุคคล รองรับ Smartwatch syncing และ AI Health Advice",
      fullDescription: "แอปพลิเคชันสำหรับการดูแลสุขภาพรอบด้าน เชื่อมต่อข้อมูลการออกกำลังกาย หัวใจ การนอนหลับ พร้อม AI บอทช่วยวิเคราะห์และให้คำแนะนำด้านโภชนาการและการดูแลตนเองแบบเฉพาะบุคคล",
      imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000",
      gallery: [
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1000"
      ],
      tags: ["React Native", "TypeScript", "GraphQL", "Node.js", "Firebase"],
      featured: false,
      demoUrl: "https://example.com/demo4",
      githubUrl: "https://github.com/example/health-pulse",
      completionDate: "2025-04",
      client: "HealthPulse Co., Ltd.",
      role: "Mobile App Developer",
      metrics: [
        { label: "Downloads", value: "50,000+" },
        { label: "App Store Rating", value: "4.9 ★" }
      ]
    },
    {
      id: "proj-5",
      title: "Zen Design System & Asset Kit",
      category: "UI/UX Design",
      shortDescription: "ระบบ Design System ดีไซน์ทันสมัย มินิมอล มีองค์ประกอบ UI กว่า 300+ ชิ้น สำหรับแอปพลิเคชันยุคใหม่",
      fullDescription: "ชุดการออกแบบ UI Component Library ที่ครอบคลุมทั้ง Color Tokens, Typography Scale, Adaptive Components, Glassmorphism Elements และ Micro-interactions ที่ใช้ซ้ำได้ทันทีใน Figma และ Code Components",
      imageUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1000",
      gallery: [
        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1000"
      ],
      tags: ["Figma", "UI/UX", "Tailwind CSS", "Storybook", "Design Tokens"],
      featured: false,
      demoUrl: "https://example.com/demo5",
      githubUrl: "https://github.com/example/zen-design-system",
      completionDate: "2025-02",
      client: "Open Source Project",
      role: "UI/UX & Frontend Developer",
      metrics: [
        { label: "Figma Stars", value: "2.4k" },
        { label: "Component Count", value: "320+ Elements" }
      ]
    }
  ],
  skills: [
    { id: "sk-1", name: "React & Next.js", category: "Frontend", proficiency: 95, iconName: "Code2", years: 5, featured: true },
    { id: "sk-2", name: "TypeScript", category: "Frontend", proficiency: 92, iconName: "FileCode", years: 4, featured: true },
    { id: "sk-3", name: "Tailwind CSS & Styling", category: "Frontend", proficiency: 98, iconName: "Palette", years: 5, featured: true },
    { id: "sk-4", name: "Node.js & Express", category: "Backend", proficiency: 88, iconName: "Server", years: 4, featured: true },
    { id: "sk-5", name: "Python & AI Models", category: "AI & ML", proficiency: 85, iconName: "Cpu", years: 3, featured: true },
    { id: "sk-6", name: "Gemini API & LLMs", category: "AI & ML", proficiency: 90, iconName: "Sparkles", years: 2, featured: true },
    { id: "sk-7", name: "PostgreSQL & Prisma", category: "Database", proficiency: 84, iconName: "Database", years: 4, featured: false },
    { id: "sk-8", name: "Docker & Cloud Deploy", category: "DevOps & Cloud", proficiency: 80, iconName: "Cloud", years: 3, featured: false },
    { id: "sk-9", name: "Figma & UI/UX Design", category: "Design & Tools", proficiency: 86, iconName: "Layout", years: 4, featured: false },
    { id: "sk-10", name: "RESTful & GraphQL APIs", category: "Backend", proficiency: 90, iconName: "Globe", years: 4, featured: false }
  ],
  experiences: [
    {
      id: "exp-1",
      company: "Professional Computer Co.,Ltd. (PCC)",
      role: "Senior Full-Stack & AI Solutions",
      period: "March 2026 - September 2026",
      location: "Bangkok, Thailand",
      description: "นำทีมพัฒนา Enterprise Web Applications และ AI-driven Products จัดทำสถาปัตยกรรมซอฟต์แวร์ และปรับปรุงประสิทธิภาพของระบบงาน ของกลมบัญชีกลาง",
      technologies: ["Angular 19", "TypeScript", "Java Spring Boot", "Gemini AI", "Docker", "AWS/S3"],
      highlights: [
        "ออกแบบระบบ สร้างหนังสือจัดสือจัดจาง  60%",
        "สร้าง Web Dashboard สำหรับติดตามผลการดำเนินงานของผู้รับว่าจ้าง",
        "ปรับปรุง โครงสร้างการจัดเก็บเอกสาร เพื่อทำการ ตรวจสอบเงื่อนไขดำเนินงานตามแผนการจัดซื้อจัดจ้าง"
      ],
      current: true
    },
    {
      id: "exp-2",
      company: "PTT EP",
      role: "Full-Stack Web Developer",
      period: "May 2025 - January 2026",
      location: "Bangkok, Thailand",
      description: "พัฒนาระบบ Enterpise Resorce, SaaS Dashboards และ Custom Web Applications ให้แก่ PTT ",
      technologies: ["Angular 19", "Tailwind CSS", "PostgreSQL", "GO"],
      highlights: [
        "สร้างสรรค์ผลงานมากกว่า 15 โครงการที่ประสบความสำเร็จสูง",
        "พัฒนาระบบ Payment Gateway integration ที่รองรับหลายประเทศ"
      ],
      current: false
    },
    {
      id: "exp-3",
      company: "Creative Byte Interactive",
      role: "Frontend Developer & UI Designer",
      period: "2021 - 2022",
      location: "Chiang Mai, Thailand",
      description: "ดูแลการพัฒนาหน้าเว็บ User Interface ที่ตอบสนองลื่นไหล (Responsive UI) และการทดสอบ Usability",
      technologies: ["React", "JavaScript", "CSS3 / Tailwind", "Figma"],
      highlights: [
        "พัฒนามินิมอล UI Component Library ให้แก่องค์กร",
        "ได้รับรางวัล Employee of the Quarter ประจำปี 2021"
      ],
      current: false
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "มหาวิทยาลัยราชภัฏนครปฐม (Rabhutnakhonphathom University)",
      degree: "ปริญญาตรี วิทยาการคอมพิวเตอร์ (B.Sc. in Computer Science)",
      period: "2014 - 2018",
      description: "เน้นการศึกษาด้าน Software Engineering, Data Structures & Algorithms, Database Design และ Artificial Intelligence",
      // honors: "เกียรตินิยมอันดับ 1 (First Class Honors) ผมก็อยากน่ะ แต่ก็น้นแหละ ผมชอบที่ใสใจในสิ่งที่ผมชอบมากว่ารายวิชาที่เพิ่มแค่หน่วยกิจ แล้วจบมาก็ไม่ได้ใช้"
    },
      {
      id: "edu-2",
      institution: "มัธยมฐานบินกำแพงแสน (Mattayomthanbinkampangsaen School)",
      degree: "High School",
      period: "2008 - 2014",
      description: "เน้นการศึกษาด้าน Software Engineering, Data Structures & Algorithms, Database Design และ Artificial Intelligence",
      // honors: "เกียรตินิยมอันดับ 1 (First Class Honors) ผมก็อยากน่ะ แต่ก็น้นแหละ ผมชอบที่ใสใจในสิ่งที่ผมชอบมากว่ารายวิชาที่เพิ่มแค่หน่วยกิจ แล้วจบมาก็ไม่ได้ใช้"
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
    },
    {
      id: "test-2",
      author: "Sarah Jenkins",
      role: "Head of Product",
      company: "Global Commerce Group",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300",
      content: "An extraordinary engineer who truly understands both technical depth and visual aesthetics. Highly recommended for any ambitious full-stack project!",
      rating: 5
    }
  ],
  inboxMessages: []
};

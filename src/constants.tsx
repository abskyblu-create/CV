import React from 'react';
import { 
  Briefcase, 
  Code2, 
  Database, 
  LineChart, 
  BrainCircuit, 
  ShieldCheck, 
  Globe, 
  Mail, 
  Github, 
  Youtube,
  ExternalLink,
  ChevronRight,
  MapPin,
  Calendar,
  Award,
  TrendingUp,
  CreditCard,
  Building2,
  Leaf,
  Car,
  Terminal,
  LayoutDashboard,
  Plane,
  FileText
} from 'lucide-react';

export interface Project {
  id: number;
  title: string;
  domain: string;
  deliverable: string;
  description: string;
  skills: string[];
  links: { label: string; url: string; icon?: React.ReactNode }[];
  icon: React.ReactNode;
}

export interface Experience {
  id: number;
  role: string;
  company: string;
  period: string;
  location: string;
  highlights: string[];
  type: 'banking' | 'insurance' | 'data';
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    title: "Business Analyst AI Agent (LLM)",
    domain: "Generative AI",
    deliverable: "Live AI web application",
    description: "An AI agent that performs automated financial research and generates structured business insights using large language models.",
    skills: ["LLM Applications", "NLP", "AI Reasoning", "Next.js"],
    icon: <BrainCircuit className="w-5 h-5" />,
    links: [
      { label: "GitHub", url: "https://github.com/abskyblu-create/Business-Analyst-AI-agent---LLM" },
      { label: "Live Demo", url: "https://business-analyst-ai-agent-llm.vercel.app" }
    ]
  },
  {
    id: 2,
    title: "Finance Chatbot",
    domain: "FinTech / Analytics",
    deliverable: "Web chatbot application",
    description: "Python-based financial analytics chatbot answering queries about revenue, net income, and financial ratios using structured company datasets.",
    skills: ["Python", "Pandas", "Financial Analytics", "Flask"],
    icon: <LineChart className="w-5 h-5" />,
    links: [
      { label: "GitHub", url: "https://github.com/abskyblu-create/Finance_chatbot" },
      { label: "Live Application", url: "https://finance-chatbot-84pb.onrender.com" }
    ]
  },
  {
    id: 3,
    title: "Credit Card Fraud Detection",
    domain: "Machine Learning / FinTech",
    deliverable: "ML detection pipeline",
    description: "Machine learning pipeline detecting fraudulent transactions in imbalanced financial datasets using Random Forest, XGBoost, and LightGBM.",
    skills: ["Scikit-learn", "XGBoost", "Random Forest", "SMOTE"],
    icon: <ShieldCheck className="w-5 h-5" />,
    links: [
      { label: "GitHub", url: "https://github.com/abskyblu-create/Machine-Learning-Credit-Fraud-Detection" },
      { label: "Demo", url: "https://www.youtube.com/watch?v=Mg6aSdCFSkU" },
      { label: "Report", url: "https://my.visme.co/view/y71jmwyz-report-on-decentralization-and-fintech-transformation" }
    ]
  },
  {
    id: 4,
    title: "Mortgage Lifecycle Analytics Platform",
    domain: "Banking Data Analytics",
    deliverable: "Data architecture + dashboard",
    description: "Data analytics platform modeling mortgage lifecycle workflows across banking systems to understand risk monitoring and credit operations.",
    skills: ["SQL", "Data Modelling", "Financial Analytics", "Domain Expertise"],
    icon: <Building2 className="w-5 h-5" />,
    links: [
      { label: "GitHub", url: "https://github.com/abskyblu-create/Mortgage-Lifecycle-Analytics-Platform-France-India" },
      { label: "Live Platform", url: "https://mortgage-lifecycle-analytics-platform-france-india-65fa9b.gitlab.io" }
    ]
  },
  {
    id: 5,
    title: "Eco-Respire Sustainability Platform",
    domain: "IoT / Analytics",
    deliverable: "Conceptual system",
    description: "Conceptual system combining IoT monitoring and analytics to support circular economy energy generation using agricultural waste.",
    skills: ["IoT Monitoring", "Analytics", "Sustainability"],
    icon: <Leaf className="w-5 h-5" />,
    links: [
      { label: "GitHub", url: "https://github.com/abskyblu-create/eco-respire" },
      { label: "Platform", url: "https://eco-respire-6dcbec.gitlab.io/" },
      { label: "LinkedIn", url: "https://www.linkedin.com/posts/ankit-bhatt-4a1631388_planning-towards-sustainable-cities-activity-7435038183064694784-6YDF?utm_source=share&utm_medium=member_desktop&rcm=ACoAAF99RHkBTPefO4mnkoHkmMF5RFeoFcyxU24" }
    ]
  }
];

export const EXPERIENCES: Experience[] = [
  {
    id: 1,
    role: "Scale-II Branch Manager",
    company: "Uttarakhand Gramin Bank",
    period: "02/2017 – 08/2025",
    location: "Uttarakhand, India",
    type: 'banking',
    highlights: [
      "Managed €2.75M financial portfolio including deposits and lending",
      "200+ credit appraisals per quarter",
      "18% NPA reduction through data-driven risk assessment",
      "Financial literacy programs reaching 500+ beneficiaries",
      "CASA operations, MSME credit appraisal, CKYC/AML compliance, audit monitoring"
    ]
  },
  {
    id: 2,
    role: "Underwriting & Claims Assistant",
    company: "United India Insurance",
    period: "2016 – 2017",
    location: "New Delhi, India",
    type: 'insurance',
    highlights: [
      "Managed underwriting workflows and claims operations",
      "Liability policy assessment and vendor coordination"
    ]
  },
  {
    id: 3,
    role: "Collection Expert",
    company: "Midland Credit Management",
    period: "2013",
    location: "Delhi-NCR, India",
    type: 'banking',
    highlights: [
      "Delinquency analytics and credit bureau analysis",
      "US market debt collection strategies"
    ]
  },
  {
    id: 4,
    role: "Technical Process Associate",
    company: "Interglobe Technologies",
    period: "2012",
    location: "Delhi-NCR, India",
    type: 'data',
    highlights: [
      "Operational flight data management systems",
      "PNR management and SLA compliance"
    ]
  }
];

export interface Education {
  id: number;
  degree: string;
  school: string;
  period: string;
  location: string;
  details?: string;
}

export const EDUCATION: Education[] = [
  {
    id: 1,
    degree: "M.Eng. in Data Engineering & AI",
    school: "ESILV (École Supérieure d'Ingénieurs Léonard de Vinci) – Grande École",
    period: "2025 – 2027",
    location: "Paris, France",
    details: "Specializing in Data Engineering & Artificial Intelligence"
  },
  {
    id: 2,
    degree: "B.Tech. Electrical and Electronics Engineering",
    school: "Uttar Pradesh Technical University",
    period: "2008 – 2014",
    location: "Greater Noida, Delhi-NCR"
  }
];

export const LANGUAGES = [
  { name: "English", level: "C1 (Advanced)" },
  { name: "French", level: "A2 (Intermediate)" },
  { name: "Hindi", level: "Native" }
];

export const CERTIFICATIONS = [
  { title: "JAIIB (Indian Institute of Bankers)", issuer: "IIBF", image: "https://picsum.photos/seed/jaiib/400/300" },
  { title: "AML/KYC & Digital Banking", issuer: "IIBF", image: "https://picsum.photos/seed/aml/400/300" },
  { title: "IBM Data Fundamentals", issuer: "IBM", image: "https://picsum.photos/seed/ibm/400/300" },
  { title: "Google Project Management Foundation", issuer: "Google", image: "https://picsum.photos/seed/google/400/300" },
  { title: "MSME - Reserve Bank of India", issuer: "RBI", image: "https://picsum.photos/seed/rbi/400/300" },
  { title: "Technical and fundamental analysis", issuer: "NSE", image: "https://picsum.photos/seed/nse/400/300" }
];

export const COURSEWORK = [
  "Machine Learning", "Neural Networks & Deep Learning", "Advanced Deep Learning", "AI Algorithms", 
  "Explainable AI", "Green & Responsible AI", "Computational Modeling", "Advanced Probability", 
  "Risk Analysis", "Programming for Data Science", "NoSQL Databases", "MLOps", 
  "Containerization Technologies", "Software Engineering", "Web Data Mining & Semantics", 
  "Agile & Scrum", "Project & Research Methodology"
];

export const SKILLS = {
  programming: ["Python", "SQL"],
  ai_ml: ["Scikit-learn", "XGBoost", "Random Forest", "LLM Applications", "NLP"],
  analytics: ["Pandas", "NumPy", "EDA", "Feature Engineering", "Time Series"],
  tools: ["Power BI", "Jupyter", "VS Code", "Git"],
  enterprise: ["TCS BaNCS", "Genesys", "GC Software", "JIRA"]
};

export const DEEP_DIVE = {
  learning_journey: [
    {
      year: "2025",
      title: "Transition to AI & Data Engineering",
      description: "Enrolled in M.Eng at ESILV Paris to formalize technical skills in scalable data systems and advanced machine learning."
    },
    {
      year: "2017-2025",
      title: "Banking Leadership & Risk Analytics",
      description: "Led branch operations while implementing data-driven Early Warning Systems and predictive NPA management."
    }
  ],
  technical_experiments: [
    {
      title: "Computer Vision Traffic Analysis",
      description: "Real-time vehicle detection and counting system using YOLOv8 and OpenCV for urban traffic flow optimization.",
      tech: ["YOLOv8", "OpenCV", "Python"]
    },
    {
      title: "Rust TCP Port Scanner",
      description: "High-performance multithreaded networking utility built to explore systems programming and memory safety.",
      tech: ["Rust", "Networking", "Concurrency"]
    },
    {
      title: "Financial Analytics Research",
      description: "In-depth study on decentralization and FinTech transformation impacts on traditional banking risk models.",
      tech: ["Research", "FinTech", "Risk Modeling"]
    },
    {
      title: "Machine Learning Experiments",
      description: "Exploration of various algorithms (XGBoost, LightGBM, CatBoost) for predicting credit default probabilities.",
      tech: ["XGBoost", "LightGBM", "Credit Risk"]
    },
    {
      title: "Data Exploration Projects",
      description: "Comprehensive EDA on global financial datasets to identify emerging patterns in digital payment adoption.",
      tech: ["Pandas", "Matplotlib", "EDA"]
    }
  ]
};

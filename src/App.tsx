/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { 
  Briefcase, 
  Database, 
  Mail, 
  Github, 
  Youtube,
  ExternalLink,
  MapPin,
  Award,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  Code2,
  Zap,
  Microscope,
  Layers,
  Calendar,
  Linkedin,
  Settings,
  BarChart3,
  BrainCircuit,
  GraduationCap,
  Languages,
  History,
  ChevronDown,
  X,
  Maximize2,
  Filter,
  CheckCircle2,
  FileDown
} from 'lucide-react';
import { usePortfolio } from './context/PortfolioContext';
import Admin from './components/Admin';
import { MethodologyPipeline } from './components/MethodologyPipeline';
import { ExperimentsGrid } from './components/ExperimentsGrid';
import { ProblemSolvingLenses } from './components/ProblemSolvingLenses';
import { generateResumePDF } from './utils/resumeGenerator';

const IconRenderer = ({ name, className }: { name: string, className?: string }) => {
  const Icon = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
  return <Icon className={className} />;
};

const SectionHeader = ({ title, subtitle, icon: Icon }: { title: string, subtitle?: string, icon: any }) => (
  <div className="mb-12">
    <div className="flex flex-col">
      <div className="inline-flex items-center gap-4 px-6 py-4 bg-[#0F172A] text-white rounded-2xl shadow-2xl w-fit relative z-10 overflow-hidden group border border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-[11px] font-black tracking-[0.25em] uppercase">{title}</h2>
      </div>
    </div>
    {subtitle && <p className="text-slate-500 max-w-2xl mt-6 text-lg font-medium leading-relaxed border-l-4 border-emerald-500/20 pl-4">{subtitle}</p>}
  </div>
);

interface LearningJourneyProps {
  items: any[];
}

const LearningJourney: React.FC<LearningJourneyProps> = ({ items }) => {
  const [expandedId, setExpandedId] = React.useState<number | null>(null);

  return (
    <section className="mb-32">
      <SectionHeader 
        title="Learning Journey" 
        subtitle="From curiosity to systems thinking, finance, and AI-enabled insight."
        icon={BrainCircuit}
      />
      
      <div className="relative group/journey">
        <button 
          onClick={() => {
            const el = document.getElementById('journey-scroll-container');
            if (el) el.scrollBy({ left: -300, behavior: 'smooth' });
          }}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 p-3 bg-white rounded-full shadow-xl border border-slate-100 opacity-0 group-hover/journey:opacity-100 transition-all hover:scale-110 hidden md:block"
        >
          <ChevronLeft className="w-5 h-5 text-slate-900" />
        </button>

        <div 
          id="journey-scroll-container"
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-8 no-scrollbar scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item, idx) => (
            <motion.div 
              key={idx}
              layout
              className={`flex-shrink-0 snap-start transition-all duration-500 ${expandedId === idx ? 'w-[400px]' : 'w-[240px]'}`}
            >
              <div 
                onClick={() => setExpandedId(expandedId === idx ? null : idx)}
                className={`h-full cursor-pointer p-5 rounded-2xl border transition-all duration-300 flex flex-col ${
                  expandedId === idx 
                    ? 'bg-white border-emerald-500 shadow-xl shadow-emerald-100/50 ring-1 ring-emerald-500/10' 
                    : 'bg-slate-50/50 border-slate-100 hover:bg-white hover:border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between mb-2 gap-3">
                  <div className="flex-1">
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest px-2 py-0.5 bg-emerald-50 rounded-md inline-block mb-2">
                      {item.period}
                    </span>
                    <h3 className={`font-bold text-[11px] leading-tight transition-colors ${expandedId === idx ? 'text-slate-900' : 'text-slate-600'}`}>
                      {item.title}
                    </h3>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors shrink-0 mt-1 ${expandedId === idx ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${expandedId === idx ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {expandedId === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-slate-100">
                        <p className="text-[9px] text-slate-400 font-bold uppercase mb-2 tracking-wider">
                          {item.subtitle}
                        </p>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {item.summary}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        <button 
          onClick={() => {
            const el = document.getElementById('journey-scroll-container');
            if (el) el.scrollBy({ left: 300, behavior: 'smooth' });
          }}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 p-3 bg-white rounded-full shadow-xl border border-slate-100 opacity-0 group-hover/journey:opacity-100 transition-all hover:scale-110 hidden md:block"
        >
          <ChevronRight className="w-5 h-5 text-slate-900" />
        </button>
      </div>
    </section>
  );
};

interface ProjectCardProps {
  project: any;
  idx: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, idx }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1 }}
      className="group flex flex-col bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="p-6 flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-xl bg-slate-50 text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-colors">
            <IconRenderer name={project.icon} className="w-5 h-5" />
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-100 px-2 py-1 rounded">
              {project.domain}
            </span>
            {project.deliverable && (
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                {project.deliverable}
              </span>
            )}
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{project.title}</h3>
        
        <div className="relative">
          <AnimatePresence initial={false}>
            {isExpanded ? (
              <motion.div
                key="expanded"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="text-slate-500 text-sm leading-relaxed whitespace-pre-line text-justify">
                  {project.description}
                </p>
              </motion.div>
            ) : (
              <motion.p 
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-slate-500 text-sm leading-relaxed line-clamp-2 whitespace-pre-line text-justify"
              >
                {project.description}
              </motion.p>
            )}
          </AnimatePresence>
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 text-[10px] font-black uppercase tracking-wider text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors group/btn"
          >
            <span className="group-hover/btn:underline">{isExpanded ? 'Show Less' : 'Read Summary'}</span>
            <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-6">
          {project.skills.map((skill: string) => (
            <span key={skill} className="text-[10px] font-semibold bg-slate-50 text-slate-600 px-2 py-1 rounded-md border border-slate-100">
              {skill}
            </span>
          ))}
        </div>
      </div>
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <div className="flex gap-4">
          {project.links.map((link: any) => (
            <a 
              key={link.label}
              href={link.url} 
              target="_blank" 
              className="text-xs font-bold text-slate-900 flex items-center gap-1 hover:underline"
            >
              {link.label}
              <ExternalLink className="w-3 h-3" />
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const CertificateModal = ({ cert, isOpen, onClose }: { cert: any, isOpen: boolean, onClose: () => void }) => {
  if (!cert) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-6xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2 bg-slate-900/10 hover:bg-slate-900/20 rounded-full transition-colors md:hidden"
            >
              <X className="w-6 h-6 text-slate-900" />
            </button>

            <div className="flex-1 bg-slate-50 p-4 md:p-12 flex items-center justify-center overflow-auto">
              {cert.image?.toLowerCase().endsWith('.pdf') ? (
                <iframe 
                  src={cert.image} 
                  className="w-full h-full min-h-[500px] border-0 rounded-lg shadow-2xl"
                  title={cert.title}
                />
              ) : (
                <img 
                  src={cert.image} 
                  alt={cert.title} 
                  className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            <div className="w-full md:w-[400px] p-8 md:p-12 flex flex-col border-l border-slate-100 bg-white">
              <div className="flex justify-between items-start mb-8">
                <div className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                  {cert.category}
                </div>
                <button 
                  onClick={onClose}
                  className="hidden md:block p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="mb-8">
                <p className="text-emerald-600 font-black text-[11px] uppercase tracking-[0.2em] mb-2">{cert.issuer}</p>
                <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2">{cert.title}</h3>
                <p className="text-slate-400 font-bold text-sm uppercase tracking-wider">{cert.date}</p>
              </div>

              <div className="space-y-6 flex-1">
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    Recruiter Insight
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    {cert.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Award className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-900 uppercase tracking-wider">Verified Credential</p>
                      <p className="text-[10px] text-slate-400 font-bold">Authenticity Guaranteed</p>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                onClick={onClose}
                className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
              >
                Close Vault
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const CertificationsVault = ({ items }: { items: any[] }) => {
  const [filter, setFilter] = React.useState<string>('All');
  const [selectedCert, setSelectedCert] = React.useState<any>(null);
  
  const categories = ['All', ...new Set(items.map(item => item.category))];
  const filteredItems = filter === 'All' ? items : items.filter(item => item.category === filter);

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all border ${
              filter === cat 
                ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200' 
                : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300 hover:text-slate-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((cert, idx) => (
            <motion.div
              layout
              key={cert.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              onClick={() => setSelectedCert(cert)}
              className="group cursor-pointer"
            >
              <div className="relative h-full bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 flex flex-col">
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <Maximize2 className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>

                <div className="mb-6">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-emerald-50 transition-colors">
                    <Award className="w-6 h-6 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                  </div>
                  <p className="text-emerald-600 font-black text-[9px] uppercase tracking-[0.2em] mb-1">{cert.issuer}</p>
                  <h4 className="text-lg font-black text-slate-900 leading-tight mb-2 group-hover:text-emerald-600 transition-colors">{cert.title}</h4>
                  <p className="text-slate-400 font-bold text-[10px] uppercase tracking-wider">{cert.date}</p>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 py-1 bg-slate-50 rounded-md">
                    {cert.category}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                    View Certificate
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <CertificateModal 
        cert={selectedCert} 
        isOpen={!!selectedCert} 
        onClose={() => setSelectedCert(null)} 
      />
    </div>
  );
};

export default function App() {
  const { data, loading, error } = usePortfolio();
  const [activeTab, setActiveTab] = React.useState<'main' | 'deep-dive' | 'admin'>('main');

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Loading Portfolio...</p>
      </div>
    </div>
  );

  if (error || !data) return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6 text-center">
      <div>
        <h1 className="text-2xl font-bold text-red-600 mb-2">Error Loading Portfolio</h1>
        <p className="text-slate-500">{error || 'Could not load data'}</p>
      </div>
    </div>
  );

  if (activeTab === 'admin') {
    return <Admin onBack={() => setActiveTab('main')} />;
  }

  const { personalInfo, projects, experiences, certifications, deepDive, skills, learningJourney } = data;

  return (
    <div className="min-h-screen font-sans bg-white text-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-sm">AB</div>
            <span className="font-bold text-slate-900 tracking-tight">{personalInfo.name}</span>
          </div>
          <div className="hidden md:flex items-center gap-4 p-1 bg-slate-100 rounded-xl">
            <button 
              onClick={() => setActiveTab('main')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'main' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Main Portfolio
            </button>
            <button 
              onClick={() => setActiveTab('deep-dive')}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'deep-dive' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              Deep Dive
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('admin')}
              className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
              title="Admin Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={() => data && generateResumePDF(data)}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold hover:bg-emerald-100 transition-all border border-emerald-100"
              title="Download European ATS Resume"
            >
              <FileDown className="w-4 h-4" />
              CV
            </button>
            <a 
              href={`mailto:${personalInfo.email}`}
              className="px-4 py-2 bg-slate-900 text-white rounded-full text-sm font-medium hover:bg-slate-800 transition-all shadow-sm"
            >
              Contact
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-24">
        {activeTab === 'main' ? (
          <>
            {/* Hero Section */}
            <section id="about" className="mb-32">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center lg:items-start text-center lg:text-left mb-12"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6 border border-emerald-100 w-fit">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  {personalInfo.availability}
                </div>
                
                <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-slate-900 mb-4 leading-[0.85]">
                  {personalInfo.name}
                </h1>
                
                <div className="w-full">
                  <h2 className="text-[4.2vw] sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold text-slate-500 tracking-tight whitespace-nowrap leading-none mb-4">
                    {personalInfo.title}
                  </h2>
                  <p className="text-lg text-slate-400 font-medium flex items-center justify-center lg:justify-start gap-2">
                    <MapPin className="w-4 h-4" />
                    {personalInfo.location}
                  </p>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                <div className="lg:col-span-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex flex-col items-center lg:items-start text-center lg:text-left"
                  >
                    <p className="text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed max-w-4xl font-medium tracking-tight text-balance">
                      {personalInfo.summary.split(/(8\+ years banking experience|AI-enabled analytics systems|Master of Engineering – Data Engineering & AI|ESILV Paris)/g).map((part, i) => (
                        /(8\+ years banking experience|AI-enabled analytics systems|Master of Engineering – Data Engineering & AI|ESILV Paris)/.test(part) ? (
                          <span key={i} className="text-slate-900 font-bold inline-block">{part}</span>
                        ) : part
                      ))}
                    </p>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                      <button 
                        onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-all shadow-lg"
                      >
                        View Projects
                      </button>
                      <a 
                        href={personalInfo.github} 
                        target="_blank" 
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl font-medium hover:bg-slate-50 transition-all shadow-sm"
                      >
                        <Github className="w-5 h-5" />
                        GitHub
                      </a>
                      <a 
                        href={personalInfo.linkedin} 
                        target="_blank" 
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-xl font-medium hover:bg-slate-50 transition-all shadow-sm"
                      >
                        <Linkedin className="w-5 h-5" />
                        LinkedIn
                      </a>
                    </div>
                  </motion.div>
                </div>
                
                <div className="lg:col-span-4">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative max-w-[280px] sm:max-w-[320px] mx-auto lg:ml-auto"
                  >
                    <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-400 via-blue-500 to-purple-600 rounded-[2rem] opacity-20 blur-2xl animate-pulse"></div>
                    <div className="aspect-square rounded-3xl bg-white overflow-hidden border-4 border-white shadow-2xl relative group z-10">
                      <img 
                        src={personalInfo.profilePic} 
                        alt={personalInfo.name} 
                        className="w-full h-full object-cover transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-3xl"></div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Quick Scan Highlights */}
            <section className="mb-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Domain Expertise", value: "8+ Years Banking", icon: Briefcase, color: "emerald" },
                { label: "Portfolio Managed", value: "€2.75M Assets", icon: BarChart3, color: "blue" },
                { label: "Current Focus", value: "AI & Data Eng.", icon: BrainCircuit, color: "purple" },
                { label: "Location", value: "Paris, France", icon: MapPin, color: "amber" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-6 rounded-2xl border border-slate-100 bg-white hover:border-${stat.color}-200 transition-all group`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                  <p className="text-xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                </motion.div>
              ))}
            </section>

            {/* Learning Journey Section */}
            {learningJourney && <LearningJourney items={learningJourney} />}

            {/* Projects Section */}
            <section id="projects" className="mb-32">
              <SectionHeader 
                title="Featured Projects" 
                subtitle="AI + Data applied to real-world problems"
                icon={Code2}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project: any, idx: number) => (
                  <ProjectCard key={project.id} project={project} idx={idx} />
                ))}
              </div>
            </section>

            {/* Skills Section */}
            <section id="skills" className="mb-32">
              <SectionHeader 
                title="Technical Stack" 
                subtitle="Applying AI and data analytics to build intelligent decision systems."
                icon={Database}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.entries(skills).map(([key, group]: [string, any], idx) => (
                  <motion.div 
                    key={key}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-8 rounded-3xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all group flex flex-col h-full"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 group-hover:text-emerald-600 transition-colors">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        {group.title}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-300 group-hover:text-emerald-200 transition-colors">0{idx + 1}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((s: string) => (
                        <span key={s} className="px-3 py-1.5 bg-white border border-slate-100 rounded-lg text-[11px] font-bold text-slate-700 shadow-sm group-hover:border-emerald-100 transition-colors">
                          {s}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Soft Skills & Leadership Section */}
            <section id="soft-skills" className="mb-32">
              <SectionHeader 
                title="Soft Skills & Leadership" 
                subtitle="Strategic human-centric capabilities driving organizational impact and bridging technical analysis with business decisions."
                icon={TrendingUp}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(data.soft_skills || []).map((group: any, idx: number) => (
                  <motion.div 
                    key={group.category}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-8 rounded-3xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all group flex flex-col h-full"
                  >
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2 group-hover:text-emerald-600 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      {group.category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((s: string) => (
                        <span key={s} className="px-3 py-1.5 bg-white border border-slate-100 rounded-lg text-[11px] font-bold text-slate-700 shadow-sm group-hover:border-emerald-100 transition-colors">
                          {s}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Experience Section */}
            <section id="experience" className="mb-32">
              <SectionHeader 
                title="Professional Experience" 
                subtitle="8+ years of measurable impact in Banking, Risk, and Financial Analytics."
                icon={Briefcase}
              />
              <div className="space-y-12">
                {experiences.map((exp: any, idx: number) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-8 rounded-2xl border border-slate-100 bg-white group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 relative z-10">
                      <div className="md:col-span-4">
                        <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest mb-3">
                          <Calendar className="w-3.5 h-3.5" />
                          {exp.period}
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight group-hover:text-emerald-600 transition-colors">
                          {exp.role}
                        </h3>
                        <p className="text-slate-500 font-semibold text-sm mb-6 leading-relaxed">
                          {exp.company}
                        </p>
                        <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                          <MapPin className="w-4 h-4" />
                          {exp.location}
                        </div>
                      </div>
                      <div className="md:col-span-8">
                        <ul className="space-y-4">
                          {exp.highlights.map((item: string, i: number) => (
                            <li key={i} className="flex items-start gap-3 text-slate-600 text-[14px] leading-relaxed">
                              <div className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-200 flex-shrink-0 group-hover:bg-emerald-400 transition-colors" />
                              <span className="font-medium">
                                {item.split(/(\d+%|\d+\+?|€\d+(?:\.\d+)?[MK]?|Key Skills|Credit Data Analysis|Collections Analytics|Risk Profiling|U.S. Consumer Credit Reporting|Financial Compliance|underwriting data workflows|claims lifecycle|fraud-risk identification|Third-Party Administrators|delinquent financial portfolios|customer risk profiling|credit bureau data|Experian|Equifax|TransUnion|real-time operational flight data|aviation GUI-based systems|airline datasets)/g).map((part, index) => (
                                  /(\d+%|\d+\+?|€\d+(?:\.\d+)?[MK]?|Key Skills|Credit Data Analysis|Collections Analytics|Risk Profiling|U.S. Consumer Credit Reporting|Financial Compliance|underwriting data workflows|claims lifecycle|fraud-risk identification|Third-Party Administrators|delinquent financial portfolios|customer risk profiling|credit bureau data|Experian|Equifax|TransUnion|real-time operational flight data|aviation GUI-based systems|airline datasets)/.test(part) ? (
                                    <span key={index} className="text-slate-900 font-bold">{part}</span>
                                  ) : part
                                ))}
                              </span>
                            </li>
                          ))}
                          {exp.skillTags && (
                            <li className="flex items-start gap-3 text-slate-600 text-[14px] leading-relaxed">
                              <div className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-200 flex-shrink-0 group-hover:bg-emerald-400 transition-colors" />
                              <div className="text-[14px] leading-relaxed">
                                <span className="font-bold text-slate-900">Key Skills:</span>
                                <span className="text-slate-500 ml-2">
                                  {exp.skillTags.join(", ")}
                                </span>
                              </div>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Education & Languages Section */}
            <section className="mb-32 grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8">
                <SectionHeader 
                  title="Education" 
                  subtitle="Academic foundation in Engineering and AI."
                  icon={LucideIcons.GraduationCap}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.education.map((edu: any, idx: number) => (
                    <motion.div
                      key={edu.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-6 rounded-3xl border border-slate-100 bg-white hover:shadow-xl transition-all group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-3 rounded-xl bg-slate-50 text-slate-900 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <LucideIcons.GraduationCap className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                          {edu.period}
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-slate-900 mb-1 leading-tight">
                        {edu.degree}
                      </h3>
                      <p className="text-slate-500 font-bold text-xs mb-3">
                        {edu.school}
                      </p>
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                        <MapPin className="w-3 h-3" />
                        {edu.location}
                      </div>
                      {edu.details && (
                        <div className="mt-4 pt-4 border-t border-slate-50">
                          <p className="text-xs text-slate-500 font-medium italic">
                            {edu.details}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-4">
                <SectionHeader 
                  title="Languages" 
                  subtitle="Communication"
                  icon={LucideIcons.Languages}
                />
                <div className="space-y-4">
                  {data.languages.map((lang: any, idx: number) => (
                    <motion.div
                      key={lang.name}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-4 rounded-2xl border border-slate-100 bg-white flex items-center justify-between group hover:border-emerald-200 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-900 font-black text-xs group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          {lang.name[0]}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm">{lang.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{lang.level}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((dot) => (
                          <div 
                            key={dot} 
                            className={`w-1.5 h-1.5 rounded-full ${
                              dot <= (lang.level.includes('Native') ? 5 : lang.level.includes('C1') ? 4 : 3) 
                                ? 'bg-emerald-500' 
                                : 'bg-slate-100'
                            }`} 
                          />
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Credential Vault Section */}
            <section id="certifications" className="mb-32">
              <SectionHeader 
                title="Credential Vault" 
                subtitle="Verified professional certifications and academic credentials."
                icon={Award}
              />
              
              <CertificationsVault items={certifications} />
            </section>
          </>
        ) : (
          <motion.div
            key="deep-dive"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-32 pb-32"
          >
            {/* 01. Problem Solving Lenses */}
            <section>
              <div className="text-center mb-20">
                <span className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em] mb-4 block">Methodology</span>
                <h2 className="text-5xl font-black text-slate-900 tracking-tight mb-4">The Three Lenses.</h2>
                <div className="mb-8">
                  <p className="text-slate-500 text-sm font-medium max-w-2xl mx-auto italic mb-2">
                    "Technology alone does not solve problems. The real value emerges when domain understanding, data, and intelligent systems work together."
                  </p>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">— Ankit Bhatt</p>
                </div>
                <div className="w-24 h-1 bg-emerald-500 mx-auto rounded-full" />
              </div>
              <ProblemSolvingLenses lenses={deepDive.approach.lenses} />
            </section>

            {/* 04. Technical Pipeline */}
            <section className="bg-slate-900 rounded-[80px] p-16 md:p-24 text-white">
              <div className="max-w-4xl mb-20">
                <span className="text-xs font-black text-emerald-400 uppercase tracking-[0.3em] mb-4 block">Execution</span>
                <h2 className="text-6xl font-black mb-8 tracking-tight">The Decision Pipeline.</h2>
                <p className="text-slate-400 text-xl leading-relaxed">
                  {deepDive.approach.methodology}
                </p>
              </div>
              <MethodologyPipeline />
            </section>

            {/* 05. Experiments Grid */}
            <section>
              <div className="flex items-center justify-between mb-16">
                <div>
                  <span className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em] mb-4 block">Laboratory</span>
                  <h2 className="text-5xl font-black text-slate-900 tracking-tight">Technical Experiments</h2>
                </div>
                <LucideIcons.FlaskConical className="w-12 h-12 text-slate-200" />
              </div>
              <ExperimentsGrid experiments={deepDive.technical_experiments} />
            </section>

            {/* 06. Future Direction */}
            <section className="relative py-24 overflow-hidden rounded-[60px]">
              <div className="absolute inset-0 bg-emerald-500" />
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
              
              <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
                <LucideIcons.TrendingUp className="w-16 h-16 text-white mx-auto mb-12" />
                <h2 className="text-6xl font-black text-slate-900 mb-12 tracking-tighter uppercase">The Future Vision</h2>
                <div className="space-y-8 text-2xl text-slate-900 font-medium leading-relaxed">
                  {deepDive.future_direction.split('\n\n').map((para: string, i: number) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
                
                <div className="mt-16 flex justify-center gap-8">
                  <div className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl">
                    AI Strategy
                  </div>
                  <div className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl">
                    Sustainable Value
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {/* Footer / Contact */}
        <footer className="border-t border-slate-100 mt-32 pt-12 pb-24">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">{personalInfo.name}</h2>
              <p className="text-slate-500">{personalInfo.title}</p>
            </div>
            <div className="flex gap-4">
              <a href={`mailto:${personalInfo.email}`} className="p-4 bg-slate-50 rounded-2xl text-slate-900 hover:bg-slate-900 hover:text-white transition-all">
                <LucideIcons.Mail className="w-6 h-6" />
              </a>
              <a href={personalInfo.github} target="_blank" className="p-4 bg-slate-50 rounded-2xl text-slate-900 hover:bg-slate-900 hover:text-white transition-all">
                <LucideIcons.Github className="w-6 h-6" />
              </a>
              <a href={personalInfo.linkedin} target="_blank" className="p-4 bg-slate-50 rounded-2xl text-slate-900 hover:bg-slate-900 hover:text-white transition-all">
                <LucideIcons.Linkedin className="w-6 h-6" />
              </a>
              <a href={personalInfo.youtube} target="_blank" className="p-4 bg-slate-50 rounded-2xl text-slate-900 hover:bg-slate-900 hover:text-white transition-all">
                <LucideIcons.Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>
          <div className="mt-12 text-center text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
            {personalInfo.location} • {personalInfo.stats.availableFrom}
          </div>
        </footer>
      </main>
    </div>
  );
}

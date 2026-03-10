import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Code2, Cpu, Globe, Shield, BarChart3, FlaskConical, ChevronDown, ChevronUp } from 'lucide-react';

interface Experiment {
  title: string;
  description: string;
  tech: string[];
  link?: string;
  links?: { label: string; url: string }[];
}

interface Props {
  experiments: Experiment[];
}

const iconsMap: Record<string, any> = {
  "Earthquake": Globe,
  "Fraud": Shield,
  "Traffic": Cpu,
  "TCP": Code2,
  "Financial": BarChart3,
  "Machine": FlaskConical
};

const ExperimentCard: React.FC<{ exp: Experiment; idx: number }> = ({ exp, idx }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = Object.entries(iconsMap).find(([key]) => exp.title.includes(key))?.[1] || FlaskConical;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      viewport={{ once: true }}
      className={`rounded-[32px] border border-slate-100 bg-white hover:border-emerald-200 hover:shadow-xl transition-all group flex flex-col relative overflow-hidden h-full`}
    >
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-emerald-50 transition-colors" />
      
      <div className="relative z-10 flex flex-col flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg">
            <Icon className="w-6 h-6" />
          </div>
        </div>

        <h4 className="font-black text-slate-900 mb-4 tracking-tight text-xl leading-tight">
          {exp.title}
        </h4>
        
        <div className="relative flex-1">
          <p className={`text-slate-500 leading-relaxed text-sm transition-all duration-300 whitespace-pre-line text-justify ${isExpanded ? '' : 'line-clamp-3'}`}>
            {exp.description}
          </p>
          
          {exp.description.length > 120 && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-4 flex items-center gap-1 text-xs font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest transition-colors"
            >
              {isExpanded ? (
                <>Show Less <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>Read Summary <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          )}
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-6 flex flex-wrap gap-2">
                {exp.tech.map(t => (
                  <span key={t} className="px-3 py-1 bg-slate-50 text-[10px] font-bold text-slate-400 rounded-full uppercase tracking-wider border border-slate-100">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isExpanded && (
          <div className="pt-6 flex flex-wrap gap-2">
            {exp.tech.slice(0, 3).map(t => (
              <span key={t} className="px-3 py-1 bg-slate-50 text-[10px] font-bold text-slate-400 rounded-full uppercase tracking-wider border border-slate-100">
                {t}
              </span>
            ))}
            {exp.tech.length > 3 && (
              <span className="text-[10px] font-bold text-slate-300 self-center">+{exp.tech.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* Footer Links */}
      {(exp.link || (exp.links && exp.links.length > 0)) && (
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between relative z-10">
          <div className="flex gap-4">
            {exp.link && (
              <a 
                href={exp.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-bold text-slate-900 flex items-center gap-1 hover:underline"
              >
                View Project
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {exp.links?.map((link, lIdx) => (
              <a 
                key={lIdx}
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-bold text-slate-900 flex items-center gap-1 hover:underline"
              >
                {link.label}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export const ExperimentsGrid: React.FC<Props> = ({ experiments }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {experiments.map((exp, idx) => (
        <ExperimentCard key={idx} exp={exp} idx={idx} />
      ))}
    </div>
  );
};


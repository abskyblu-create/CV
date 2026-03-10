import React from 'react';
import { motion } from 'motion/react';
import { 
  Target, 
  Search, 
  Layout, 
  Database, 
  Cpu, 
  BrainCircuit, 
  Lightbulb, 
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface PipelineStep {
  step: string;
  description: string;
}

const steps: PipelineStep[] = [
  { step: "Problem Context", description: "Defining the boundaries and environment of the challenge." },
  { step: "Domain Understanding", description: "Deep dive into finance, risk, and operational dynamics." },
  { step: "Problem Structuring", description: "Formulating key questions, hypotheses, and decision metrics." },
  { step: "Data Discovery", description: "Identifying structured data, signals, and operational records." },
  { step: "Data Processing", description: "Cleaning, transformation, and feature engineering." },
  { step: "Analytics & Modeling", description: "Applying statistics, machine learning, and predictive analysis." },
  { step: "AI Reasoning", description: "Using LLMs for pattern interpretation and scenario exploration." },
  { step: "Decision Options", description: "Evaluating multiple potential solutions and their impacts." },
  { step: "Strategic Recommendation", description: "Delivering data-driven and context-aware decisions." }
];

const icons = [Target, Search, Layout, Database, Cpu, BrainCircuit, Lightbulb, CheckCircle2, ArrowRight];

export const MethodologyPipeline: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {steps.map((item, idx) => {
        const Icon = icons[idx % icons.length];
        return (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            viewport={{ once: true }}
            className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 hover:bg-white transition-all group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Phase 0{idx + 1}</span>
            </div>
            <h4 className="font-bold text-slate-900 mb-2">{item.step}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
};

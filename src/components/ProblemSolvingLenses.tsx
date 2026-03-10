import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, Microscope, Cpu } from 'lucide-react';

interface Lens {
  name: string;
  description: string;
}

interface Props {
  lenses: Lens[];
}

const icons = [Briefcase, Microscope, Cpu];
const colors = ['emerald', 'blue', 'indigo'];

export const ProblemSolvingLenses: React.FC<Props> = ({ lenses }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {lenses.map((lens, idx) => {
        const Icon = icons[idx % icons.length];
        const color = colors[idx % colors.length];
        
        const colorClass = {
          emerald: 'bg-emerald-500 shadow-emerald-200 text-emerald-500',
          blue: 'bg-blue-500 shadow-blue-200 text-blue-500',
          indigo: 'bg-indigo-500 shadow-indigo-200 text-indigo-500'
        }[color as 'emerald' | 'blue' | 'indigo'];

        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            viewport={{ once: true }}
            className="relative p-10 bg-white rounded-[40px] border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all group"
          >
            <div className={`w-16 h-16 rounded-3xl bg-white shadow-xl border border-slate-50 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform ${colorClass.split(' ')[2]}`}>
              <Icon className="w-8 h-8" />
            </div>

            <h4 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase">{lens.name}</h4>
            <p className="text-slate-500 leading-relaxed text-lg">
              {lens.description}
            </p>

            {/* Decorative Number */}
            <div className="absolute top-10 right-10 text-6xl font-black text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">
              0{idx + 1}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

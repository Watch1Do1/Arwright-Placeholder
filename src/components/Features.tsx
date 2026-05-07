import { motion } from 'motion/react';
import { PenTool, Eye, GraduationCap, ShieldCheck, Zap, History, FileText, Search } from 'lucide-react';

const features = [
  {
    title: "Draft Evolution Replay",
    description: "Observe how an essay developed over time. Understand student thinking through revision patterns.",
    icon: History,
    color: "bg-orange-50",
    iconColor: "bg-orange-500"
  },
  {
    title: "AI Thinking Partner",
    description: "Pedagogical AI help that acts as a writing partner, not a replacement writer. Transparency in every moment.",
    icon: PenTool,
    color: "bg-blue-50",
    iconColor: "bg-blue-500"
  },
  {
    title: "Process Insights",
    description: "Meaningful data on time spent, paste events, and revision depth without intrusive surveillance.",
    icon: Eye,
    color: "bg-stone-50",
    iconColor: "bg-stone-500"
  },
  {
    title: "School-Grade Security",
    description: "Hierarchy management for Districts, Schools, and Classes. Student privacy and trust at the core.",
    icon: ShieldCheck,
    color: "bg-green-50",
    iconColor: "bg-green-500"
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-6 bg-paper">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-24 mb-24 items-center">
          <div className="space-y-6">
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-ink">
              It is not an AI essay generator. It is a writing environment with <span className="italic">process transparency.</span>
            </h2>
            <p className="text-xl text-ink/60 font-serif leading-relaxed">
              Arwright preserves student trust while giving teachers the insight they need to guide authentic literacy development.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-8 rounded-3xl ${feature.color} border border-ink/5 space-y-4`}
              >
                <div className={`w-10 h-10 rounded-xl ${feature.iconColor} flex items-center justify-center text-paper`}>
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl font-medium text-ink">{feature.title}</h3>
                <p className="text-sm text-ink/60 leading-relaxed font-sans">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div id="students" className="grid md:grid-cols-3 gap-8 py-16 border-t border-accent/10">
          <div className="md:col-span-1">
            <h3 className="font-serif text-3xl text-ink underline decoration-accent/30 underline-offset-8">For Students</h3>
            <p className="text-ink/50 mt-2">A calm, focused writing space.</p>
          </div>
          <div className="md:col-span-2 grid sm:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-medium text-ink flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent" /> Focus Mode
              </h4>
              <p className="text-sm text-ink/60 leading-relaxed">A workspace that feels like writing on a page. Supports drafting, revising, and deep reflection.</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-ink flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-accent" /> Final Submissions
              </h4>
              <p className="text-sm text-ink/60 leading-relaxed">Turn final drafts into clean, properly formatted PDFs ready for traditional grading.</p>
            </div>
          </div>
        </div>
        <div id="teachers" className="grid md:grid-cols-3 gap-8 py-16 border-t border-accent/10">
          <div className="md:col-span-1">
            <h3 className="font-serif text-3xl text-ink underline decoration-accent/30 underline-offset-8">For Teachers</h3>
            <p className="text-ink/50 mt-2">Insights that guide instruction.</p>
          </div>
          <div className="md:col-span-2 grid sm:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-medium text-ink flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent" /> Traditional Grading
              </h4>
              <p className="text-sm text-ink/60 leading-relaxed">See final submitted work first. Grades stay focused on the output, while insights remain optional supports.</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-ink flex items-center gap-2">
                <Search className="w-4 h-4 text-accent" /> Writing Insights
              </h4>
              <p className="text-sm text-ink/60 leading-relaxed">Understand the process: view time spent, revision intensity, and AI consultation moments to give targeted feedback.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

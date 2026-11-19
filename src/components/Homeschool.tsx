import { motion } from 'motion/react';
import { ClipboardList, MessageCircleQuestion, ListChecks, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

// Event the contact form listens for, so "Join the founding family beta" opens the form
// with the homeschool inquiry type already selected.
export const SELECT_INQUIRY_TYPE_EVENT = 'arwright:select-inquiry-type';

// Yearly totals (founding / regular), cumulative. Pending Joseph's confirmation; change only this array.
const FAMILY_YEARLY_TOTALS = [
  { students: '1 student', founding: '$37.50', regular: '$75' },
  { students: '2–4 students', founding: '$49', regular: '$99' },
  { students: '5–8 students', founding: '$73.99', regular: '$148' },
  { students: '9–12 students', founding: '$86.49', regular: '$172.99' },
] as const;

// Survey wording: Joseph is deciding whether surveys are optional or required.
// Add a sentence to this list; it renders in order, before the quotes paragraph.
const FOUNDING_IN_RETURN_SURVEY = [
  'A few short surveys during the year about how Arwright is working for your family.',
  "Surveys are optional and won't affect your price.",
] as const;

const FOUNDING_IN_RETURN_QUOTES =
  "With your written permission, we may quote your feedback by first name or anonymously, whichever you prefer. You can always say no to quotes and still keep your founding price. Quotes come from parents only, never from students, and we never publish a student's writing. Published quotes will note that the family receives founding pricing.";

const benefits = [
  {
    title: 'Your assignments, your rubrics',
    description:
      'Create the assignment and the rubric, then see how the writing developed: drafts, revisions, and the questions they asked the coach.',
    icon: ClipboardList,
  },
  {
    title: 'Students do the writing',
    description: 'The coach asks questions and offers feedback. Students do the writing.',
    icon: MessageCircleQuestion,
  },
  {
    title: 'Optional practice quizzes',
    description:
      'After each piece of coach feedback, students can choose an optional 3-question practice quiz on that skill, built from their own draft, with instant explanations. You see the date, skill and score with the submitted paper.',
    icon: ListChecks,
  },
  {
    title: "Student's name removed before AI",
    description:
      "Before a student's writing is sent to our AI providers, we automatically replace the student's own name (as it appears on their account, including anywhere it appears in their writing), along with email addresses and U.S. phone numbers we detect. Other names or personal details a student types may still be sent, so we encourage students not to include them. Automatic detection may not catch everything.",
    icon: ShieldCheck,
  },
];

export default function Homeschool() {
  const selectHomeschoolInquiry = () => {
    window.dispatchEvent(new CustomEvent(SELECT_INQUIRY_TYPE_EVENT, { detail: 'homeschool_family' }));
  };

  return (
    <div id="homeschool" className="grid md:grid-cols-3 gap-8 py-16 border-t border-accent/10 scroll-mt-24">
      <div className="md:col-span-1 space-y-4">
        <h3 className="font-serif text-3xl text-ink underline decoration-accent/30 underline-offset-8">For Families</h3>
        <p className="font-serif text-2xl text-ink/80 leading-snug pt-2">
          Built for the parent who is also the writing teacher.
        </p>
        <span className="inline-block px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium border border-accent/20 rounded-full text-accent">
          Homeschool beta · Students 13+
        </span>
      </div>

      <div className="md:col-span-2 space-y-10">
        <p className="text-lg text-ink/70 font-serif leading-relaxed">
          Arwright helps your student write with an AI coach that asks questions instead of writing the paper for them.
          You act as their teacher: you create assignments with your own rubrics, and you can see their drafting,
          revision, and AI use.
        </p>
        <p className="text-ink/70 leading-relaxed">
          <span className="font-medium text-ink">How it works:</span> You create a family account, add each student (13
          and up), and set up classes. Each student signs up with their own email and joins using your family code.
        </p>

        <div className="grid sm:grid-cols-2 gap-8">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="space-y-4">
              <h4 className="font-medium text-ink flex items-center gap-2">
                <benefit.icon className="w-4 h-4 text-accent" /> {benefit.title}
              </h4>
              <p className="text-sm text-ink/60 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-3xl bg-blue-50 border border-ink/5 space-y-6"
        >
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-accent">Founding-family pricing</p>
            <p className="font-serif text-3xl text-ink">
              Founding price: $49 a year for up to 4 students (first 20 families)
            </p>
            <p className="text-sm text-ink/60">Regular price $99 a year for 2 to 4 students. Just one student? It's $37.50 a year founding ($75 regular). Prices in USD, plus any applicable tax.</p>
          </div>

          <div className="space-y-2 text-sm text-ink/70">
            <h4 className="font-medium text-ink">Yearly totals</h4>
            <div className="overflow-x-auto">
              <table className="w-full max-w-lg text-left">
                <thead>
                  <tr className="text-ink/60 border-b border-ink/10">
                    <th className="font-medium py-1.5 pr-4">Students</th>
                    <th className="font-medium py-1.5 pr-4">Founding (per year)</th>
                    <th className="font-medium py-1.5">Regular (per year)</th>
                  </tr>
                </thead>
                <tbody>
                  {FAMILY_YEARLY_TOTALS.map((row) => (
                    <tr key={row.students} className="text-ink">
                      <td className="py-1.5 pr-4">{row.students}</td>
                      <td className="py-1.5 pr-4">{row.founding}</td>
                      <td className="py-1.5">{row.regular}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-sm text-ink/70 leading-relaxed">
            Arwright for families is an annual plan, built for writing all year long. We're opening the homeschool beta
            to the first 20 families who pay their first invoice. Founding families keep founding prices as long as they
            pay each yearly renewal invoice by the end of its 14-day grace period. Regular prices may change in future
            years.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 text-sm text-ink/60 leading-relaxed">
            <div className="space-y-2">
              <h4 className="font-medium text-ink">What we ask in return</h4>
              <p>
                {FOUNDING_IN_RETURN_SURVEY.join(' ')} {FOUNDING_IN_RETURN_QUOTES}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-ink">Refunds</h4>
              <p>
                If Arwright isn't working for your family, email us within 30 days of paying any invoice for a full
                refund of that invoice. After 30 days, payments aren't refundable, but you keep access through the end
                of the year you paid for.
              </p>
            </div>
          </div>

          <div className="space-y-2 text-sm text-ink/60 leading-relaxed">
            <h4 className="font-medium text-ink">Billing</h4>
            <p>
              All family plans are billed once a year by invoice, based on how many students are in your family (up to
              12). Nothing renews or charges automatically: we email your next invoice about 30 days before your year
              ends, and each year starts only when you pay it. If you add a student mid-year, we'll invoice a prorated
              amount for the rest of that year. If a renewal invoice isn't paid, you get a 14-day grace period; after
              that your family's account becomes read-only, and we don't delete your students' writing because a
              payment is late. To stop, just don't pay the next invoice, or email hello@arwrightlearning.com.
            </p>
          </div>
        </motion.div>

        <div className="p-6 rounded-3xl bg-stone-50 border border-ink/5 space-y-2">
          <h4 className="font-medium text-ink flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" /> Coming soon: grading assistant
          </h4>
          <p className="text-sm text-ink/60 leading-relaxed">
            A grading assistant that notes which rubric criteria look met or not yet met, plus writing strengths and
            areas still developing, each tied to a passage in the paper. It never assigns a grade. You decide. It isn't
            part of the beta yet.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-ink/70">
            The homeschool beta is open to students 13 and up. Join the founding family beta and we'll help you get
            your family set up.
          </p>
          <a
            href="#contact"
            onClick={selectHomeschoolInquiry}
            className="inline-flex items-center gap-2 px-8 py-3 bg-accent text-paper rounded-xl font-medium text-sm hover:scale-105 transition-transform duration-300 shadow-xl shadow-accent/10"
          >
            Join the founding family beta <ArrowRight className="w-4 h-4" />
          </a>
          <p className="text-sm text-ink/50">
            Or email{' '}
            <a
              href="mailto:hello@arwrightlearning.com"
              className="underline underline-offset-4 hover:text-ink transition-colors"
            >
              hello@arwrightlearning.com
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

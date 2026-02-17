import Link from 'next/link';

const features = [
  {
    title: 'Medical Frameworks',
    description: 'SOAP notes, H&P, procedure notes, and annual wellness visits with CMS/AMA compliance built in.',
    count: '7 frameworks',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    title: 'Rehabilitation',
    description: 'PT, OT, and SLP evaluations with ROM, MMT, outcome measures, and Medicare-compliant skilled need justification.',
    count: '6 frameworks',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10" /><path d="M12 20V4" /><path d="M6 20v-6" />
      </svg>
    ),
  },
  {
    title: 'Behavioral Health',
    description: 'Biopsychosocial intakes, therapy notes, psychiatric evaluations, group notes, and crisis assessments with DSM-5-TR alignment.',
    count: '6 frameworks',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
];

const steps = [
  { num: '1', title: 'Record', description: 'Capture your clinical encounter with one click. Our ambient AI listens so you can focus on the patient.' },
  { num: '2', title: 'Generate', description: 'AI transcribes and maps your conversation to the selected evidence-based framework — every section, every required element.' },
  { num: '3', title: 'Review & Sign', description: 'Edit inline, provide feedback, and export. Your note is complete in minutes, not hours.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-[#1e3a5f] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <span className="text-xl font-bold text-[#1e3a5f]">OmniScribe</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/frameworks" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 transition-colors">
            Frameworks
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 transition-colors">
            Log In
          </Link>
          <Link href="/dashboard" className="bg-[#0d9488] hover:bg-[#0f766e] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 md:px-12 py-20 md:py-32 max-w-5xl mx-auto text-center animate-fade-in">
        <div className="inline-block px-3 py-1 bg-[#0d9488]/10 text-[#0d9488] text-xs font-semibold rounded-full mb-6">
          19 Evidence-Based Frameworks • 3 Clinical Domains
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-[#1e3a5f] leading-tight mb-6">
          Evidence-Based Clinical Documentation,{' '}
          <span className="text-[#0d9488]">Powered by AI</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Record your clinical encounter. OmniScribe transcribes, structures, and generates
          compliant documentation using frameworks built on CMS guidelines, APTA standards,
          DSM-5-TR criteria, and more.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/visit/new" className="bg-[#0d9488] hover:bg-[#0f766e] text-white font-semibold px-8 py-3.5 rounded-xl text-lg transition-colors shadow-lg hover:shadow-xl">
            Start Recording — Free
          </Link>
          <Link href="/frameworks" className="text-[#1e3a5f] font-semibold px-8 py-3.5 rounded-xl text-lg border-2 border-[#1e3a5f]/20 hover:border-[#1e3a5f]/40 transition-colors">
            Browse Frameworks
          </Link>
        </div>
      </section>

      {/* Framework domains */}
      <section className="px-6 md:px-12 py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1e3a5f] mb-3">Three Domains. Complete Coverage.</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every framework is built from regulatory sources, professional guidelines, and clinical best practices — not generic templates.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all">
                <div className="mb-4">{f.icon}</div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{f.title}</h3>
                  <span className="text-xs font-medium text-gray-400">{f.count}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 md:px-12 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1e3a5f] mb-3">How It Works</h2>
            <p className="text-gray-600">From encounter to signed note in minutes.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-[#1e3a5f] text-white text-2xl font-bold flex items-center justify-center mx-auto mb-4">
                  {s.num}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 md:px-12 py-16 bg-[#1e3a5f]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {[
            { num: '19', label: 'Clinical Frameworks' },
            { num: '708', label: 'Documentation Items' },
            { num: '30+', label: 'Regulatory Sources' },
            { num: '10', label: 'Provider Types' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-bold mb-1">{s.num}</div>
              <div className="text-sm text-white/70">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-12 py-20 text-center">
        <h2 className="text-3xl font-bold text-[#1e3a5f] mb-4">Ready to transform your documentation?</h2>
        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
          Stop spending hours on notes. Start spending minutes — with the depth and compliance your practice demands.
        </p>
        <Link href="/dashboard" className="inline-block bg-[#0d9488] hover:bg-[#0f766e] text-white font-semibold px-8 py-3.5 rounded-xl text-lg transition-colors shadow-lg">
          Get Started Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-8 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-400">&copy; 2026 OmniScribe. Evidence-based clinical documentation.</p>
      </footer>
    </div>
  );
}

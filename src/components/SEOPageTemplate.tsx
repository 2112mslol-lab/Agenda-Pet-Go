import { Link } from "react-router-dom";
import { PawPrint, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";

interface SEOPageProps {
  title: string;
  description: string;
  h1: string;
  intro: string;
  benefits: { title: string; desc: string }[];
  ctaText: string;
}

export const SEOPageTemplate = ({ title, description, h1, intro, benefits, ctaText }: SEOPageProps) => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <SEO title={title} description={description} />
      
      {/* Subtle Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

      <nav className="border-b border-slate-100 h-20 flex items-center bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="AgendaPetGo" className="h-10 w-auto object-contain" />
          </Link>
        </div>
      </nav>

      <main className="relative z-10">
        <header className="py-24 bg-slate-50 relative overflow-hidden border-b border-slate-100">
          <div className="absolute inset-0 z-0 opacity-40">
             <img src="/hero-bg.png" className="w-full h-full object-cover grayscale opacity-20" alt="" />
          </div>
          <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter">
              {h1}
            </h1>
            <p className="text-xl text-slate-600 font-medium leading-relaxed mb-10 max-w-2xl mx-auto">
              {intro}
            </p>
            <Link to="/login">
              <Button size="lg" className="h-16 px-10 text-xl font-black rounded-2xl bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                {ctaText}
              </Button>
            </Link>
          </div>
        </header>

        <section className="py-32 bg-white">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center shrink-0 mt-1 border border-primary/10 transition-colors group-hover:bg-primary/10">
                    <Check className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black mb-3 tracking-tight">{benefit.title}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-slate-900 text-white text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />
            <div className="container mx-auto px-4 relative z-10">
                <h2 className="text-4xl font-black mb-6 tracking-tight">Pronto para organizar seu negócio?</h2>
                <p className="text-slate-400 mb-10 text-xl font-medium max-w-xl mx-auto">Comece agora e veja a diferença na sua rotina já na primeira semana.</p>
                <Link to="/login">
                    <Button size="lg" className="h-16 px-10 text-xl font-black rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/40 transition-all hover:scale-105 active:scale-95">
                        Testar 14 dias grátis
                        <ArrowRight className="w-6 h-6 ml-2" />
                    </Button>
                </Link>
            </div>
        </section>
      </main>

      <footer className="py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">© 2026 AgendaPetGo</p>
      </footer>
    </div>
  );
};

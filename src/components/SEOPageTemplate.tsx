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
    <div className="min-h-screen bg-white text-slate-900">
      <SEO title={title} description={description} />
      
      <nav className="border-b border-slate-100 h-20 flex items-center">
        <div className="container mx-auto px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <PawPrint className="text-white w-5 h-5" />
            </div>
            <span className="font-black text-xl tracking-tighter">AgendaPetGo</span>
          </Link>
        </div>
      </nav>

      <main>
        <header className="py-20 bg-slate-50">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter">
              {h1}
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10">
              {intro}
            </p>
            <Link to="/login">
              <Button size="lg" className="h-16 px-10 text-xl font-black rounded-2xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20">
                {ctaText}
              </Button>
            </Link>
          </div>
        </header>

        <section className="py-24">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black mb-2">{benefit.title}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-slate-900 text-white text-center">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-black mb-6">Pronto para organizar seu negócio?</h2>
                <p className="text-slate-400 mb-10 text-lg">Comece agora e veja a diferença na primeira semana.</p>
                <Link to="/login">
                    <Button size="lg" className="h-14 px-8 font-black rounded-xl bg-primary hover:bg-primary/90 text-white">
                        Testar 14 dias grátis
                        <ArrowRight className="w-5 h-5 ml-2" />
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

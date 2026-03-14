import { Link } from "wouter";
import { Plane, Compass } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b-white/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-all duration-300 group-hover:-translate-y-0.5">
            <Plane className="w-5 h-5 text-white -rotate-45 ml-1" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-foreground group-hover:text-primary transition-colors">
            LastMinute
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Как это работает
          </a>
          <a href="#reviews" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Отзывы
          </a>
          <button className="px-5 py-2.5 rounded-full bg-primary/10 text-primary font-bold text-sm hover:bg-primary/20 transition-colors flex items-center gap-2">
            <Compass className="w-4 h-4" />
            Куда полететь
          </button>
        </div>
      </div>
    </nav>
  );
}

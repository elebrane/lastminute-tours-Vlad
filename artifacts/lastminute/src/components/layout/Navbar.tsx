import { Link, useLocation } from "wouter";
import { Plane, HelpCircle, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [location] = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/30 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-all duration-300 group-hover:-translate-y-0.5">
            <Plane className="w-5 h-5 text-white -rotate-45 ml-1" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-foreground group-hover:text-primary transition-colors">
            LastMinute
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {location === "/" && (
            <>
              <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Как работает
              </a>
              <a href="#benefits" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Преимущества
              </a>
              <a href="#reviews" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Отзывы
              </a>
            </>
          )}
          <Link href="/help" className={cn(
            "flex items-center gap-1.5 text-sm font-medium transition-colors",
            location === "/help" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          )}>
            <HelpCircle className="w-4 h-4" />
            Помощь
          </Link>
          {location === "/" && (
            <a
              href="#search"
              className="px-5 py-2.5 rounded-full bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("search")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Найти тур
            </a>
          )}
        </div>

        <div className="md:hidden flex items-center gap-3">
          <Link href="/help" className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <HelpCircle className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </nav>
  );
}

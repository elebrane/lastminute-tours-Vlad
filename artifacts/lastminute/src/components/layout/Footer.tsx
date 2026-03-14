import { Plane } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
          <Plane className="w-5 h-5 -rotate-45" />
          <span className="font-display font-bold text-xl tracking-tight">
            LastMinute
          </span>
        </div>
        
        <p className="text-sm text-muted-foreground text-center md:text-left">
          © {new Date().getFullYear()} LastMinute Tours. Поиск горящих туров на выходные.
        </p>
        
        <div className="flex items-center gap-6">
          <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Правила</a>
          <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Поддержка</a>
        </div>
      </div>
    </footer>
  );
}

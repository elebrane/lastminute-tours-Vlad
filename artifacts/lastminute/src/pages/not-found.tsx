import { Link } from "wouter";
import { Plane } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
          <Plane className="w-10 h-10 text-primary -rotate-45" />
          <div className="absolute -bottom-2 -right-2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg border border-border">
            <span className="text-sm font-bold text-slate-800">404</span>
          </div>
        </div>
        
        <h1 className="text-4xl font-display font-bold mb-4 text-foreground">Рейс отменен</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Похоже, этой страницы не существует. Вернитесь на главную, чтобы найти реальные горящие туры.
        </p>
        
        <Link 
          href="/" 
          className="inline-flex items-center justify-center h-14 px-8 rounded-2xl font-bold text-white bg-gradient-brand shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}

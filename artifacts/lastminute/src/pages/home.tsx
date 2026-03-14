import { useState, useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { Results } from "@/components/home/Results";
import { useSearchTours } from "@/hooks/use-tours";

export default function Home() {
  const { mutate, data, isPending, isError } = useSearchTours();
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const handleSearch = (city: string, budget: number) => {
    mutate({
      data: {
        departureCity: city,
        budget: budget,
        adults: 2
      }
    }, {
      onSuccess: () => {
        // Scroll to results slightly after render
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero onSearch={handleSearch} isSearching={isPending} />
        
        <div ref={resultsRef}>
          {(isPending || data || isError) && (
            <Results data={data} isPending={isPending} isError={isError} />
          )}
        </div>

        {/* How it works section */}
        <section className="py-24 bg-white" id="how-it-works">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Ленивое планирование</h2>
              <p className="text-lg text-muted-foreground">
                Не нужно часами листать сайты туроператоров. Мы сделали всё за вас.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center group">
                <div className="w-20 h-20 mx-auto bg-orange-50 rounded-3xl flex items-center justify-center text-3xl font-display font-bold text-orange-500 mb-6 group-hover:scale-110 transition-transform group-hover:shadow-xl shadow-orange-500/20">1</div>
                <h3 className="text-xl font-bold mb-3">Задайте условия</h3>
                <p className="text-muted-foreground">Просто скажите откуда летите и сколько готовы потратить. Без лишних фильтров.</p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 mx-auto bg-primary/10 rounded-3xl flex items-center justify-center text-3xl font-display font-bold text-primary mb-6 group-hover:scale-110 transition-transform group-hover:shadow-xl shadow-primary/20">2</div>
                <h3 className="text-xl font-bold mb-3">Умный поиск</h3>
                <p className="text-muted-foreground">Наш алгоритм сканирует сотни горящих туров на ближайшие 7 дней и выбирает самые выгодные.</p>
              </div>
              <div className="text-center group">
                <div className="w-20 h-20 mx-auto bg-indigo-50 rounded-3xl flex items-center justify-center text-3xl font-display font-bold text-indigo-500 mb-6 group-hover:scale-110 transition-transform group-hover:shadow-xl shadow-indigo-500/20">3</div>
                <h3 className="text-xl font-bold mb-3">Оценка ИИ</h3>
                <p className="text-muted-foreground">Нейросеть пишет короткое саммари для каждого отеля: что ждать, какие плюсы и минусы.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

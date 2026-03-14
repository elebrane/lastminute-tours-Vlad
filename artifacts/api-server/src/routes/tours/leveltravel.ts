import OpenAI from "openai";
import { gigaChatComplete, isGigaChatConfigured } from "../../lib/gigachat.js";
import { db } from "@workspace/db";
import { settingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const openai = new OpenAI({
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
});

export interface RawTour {
  id: string;
  destination: string;
  country: string;
  city: string;
  hotel: string;
  stars: number;
  departureDate: string;
  returnDate: string;
  nights: number;
  price: number;
  totalPrice: number;
  mealType: string;
  imageUrl: string;
  operatorName?: string;
}

const DESTINATION_IMAGES: Record<string, string> = {
  "Турция": "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?w=800&q=80",
  "Египет": "https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800&q=80",
  "Таиланд": "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80",
  "ОАЭ": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
  "Греция": "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80",
  "Испания": "https://images.unsplash.com/photo-1509840841025-9088d49d7f86?w=800&q=80",
  "Кипр": "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
  "Черногория": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  "Тунис": "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800&q=80",
  "Мальдивы": "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
  "Куба": "https://images.unsplash.com/photo-1508361001413-7a9dca21d08a?w=800&q=80",
  "Италия": "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800&q=80",
  "Грузия": "https://images.unsplash.com/photo-1565008576549-57ee4ae6ef48?w=800&q=80",
  "Израиль": "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=800&q=80",
  "Индонезия": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
};

const HOTELS_BY_COUNTRY: Record<string, { hotel: string; city: string; stars: number; operator: string }[]> = {
  "Турция": [
    { hotel: "Delphin Imperial Lara", city: "Анталья", stars: 5, operator: "Tez Tour" },
    { hotel: "Akka Alinda Hotel", city: "Кемер", stars: 5, operator: "TUI" },
    { hotel: "Bellis Deluxe Hotel", city: "Белек", stars: 5, operator: "Coral Travel" },
    { hotel: "Crystal Sunrise Queen", city: "Сиде", stars: 5, operator: "Pegas Touristik" },
    { hotel: "Club Hotel Sera", city: "Анталья", stars: 5, operator: "Tez Tour" },
    { hotel: "Rixos Premium Tekirova", city: "Кемер", stars: 5, operator: "TUI" },
    { hotel: "Selectum Luxury Resort", city: "Белек", stars: 5, operator: "Coral Travel" },
  ],
  "Египет": [
    { hotel: "Hilton Hurghada Plaza", city: "Хургада", stars: 5, operator: "Tez Tour" },
    { hotel: "Stella Di Mare Beach", city: "Шарм-эль-Шейх", stars: 5, operator: "Pegas Touristik" },
    { hotel: "Pickalbatros Palace", city: "Хургада", stars: 5, operator: "Coral Travel" },
    { hotel: "Jaz Mirabel Beach", city: "Шарм-эль-Шейх", stars: 5, operator: "TUI" },
    { hotel: "Titanic Palace", city: "Хургада", stars: 5, operator: "Pegas Touristik" },
  ],
  "Таиланд": [
    { hotel: "Amari Pattaya", city: "Паттайя", stars: 4, operator: "TUI" },
    { hotel: "Centara Grand Beach", city: "Самуи", stars: 5, operator: "Coral Travel" },
    { hotel: "Phuket Graceland Resort", city: "Пхукет", stars: 5, operator: "Tez Tour" },
    { hotel: "Holiday Inn Pattaya", city: "Паттайя", stars: 4, operator: "Pegas Touristik" },
  ],
  "ОАЭ": [
    { hotel: "Jumeirah Beach Hotel", city: "Дубай", stars: 5, operator: "TUI" },
    { hotel: "Atlantis The Palm", city: "Дубай", stars: 5, operator: "Tez Tour" },
    { hotel: "Rixos Premium Dubai", city: "Дубай", stars: 5, operator: "Coral Travel" },
  ],
  "Греция": [
    { hotel: "Ikos Aria", city: "Родос", stars: 5, operator: "TUI" },
    { hotel: "Aldemar Knossos Royal", city: "Крит", stars: 5, operator: "Coral Travel" },
    { hotel: "Mitsis Alila Resort", city: "Родос", stars: 5, operator: "Pegas Touristik" },
  ],
  "Кипр": [
    { hotel: "Amavi Hotel", city: "Пафос", stars: 5, operator: "TUI" },
    { hotel: "Olympic Lagoon Resort", city: "Айя-Напа", stars: 4, operator: "Coral Travel" },
  ],
  "Испания": [
    { hotel: "Iberostar Gran Hotel", city: "Тенерифе", stars: 5, operator: "TUI" },
    { hotel: "Lopesan Costa Meloneras", city: "Гран-Канария", stars: 5, operator: "Coral Travel" },
  ],
  "Черногория": [
    { hotel: "Dukley Hotel & Resort", city: "Будва", stars: 5, operator: "Pegas Touristik" },
    { hotel: "Splendid Spa Resort", city: "Бечичи", stars: 5, operator: "TUI" },
  ],
  "Тунис": [
    { hotel: "Diar Lemdina", city: "Хаммамет", stars: 5, operator: "Coral Travel" },
    { hotel: "Iberostar Averroes", city: "Хаммамет", stars: 4, operator: "TUI" },
  ],
  "Грузия": [
    { hotel: "Sheraton Batumi Hotel", city: "Батуми", stars: 5, operator: "Pegas Touristik" },
    { hotel: "Radisson Blu Hotel Batumi", city: "Батуми", stars: 5, operator: "TUI" },
  ],
  "Индонезия": [
    { hotel: "Ayodya Resort Bali", city: "Бали", stars: 5, operator: "TUI" },
    { hotel: "The Laguna Bali", city: "Бали", stars: 5, operator: "Coral Travel" },
  ],
};

const MEAL_TYPES = ["Всё включено", "Завтрак и ужин", "Только завтрак", "Без питания", "Ультра всё включено"];

function getDateRange(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split("T")[0];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

async function getLevelTravelToken(): Promise<string | null> {
  try {
    const setting = await db.select()
      .from(settingsTable)
      .where(eq(settingsTable.key, "LEVEL_TRAVEL_TOKEN"))
      .limit(1);
    return setting[0]?.value || null;
  } catch {
    return null;
  }
}

async function fetchRealLevelTravelTours(
  token: string,
  departureCityName: string,
  budget: number,
  adults: number
): Promise<RawTour[] | null> {
  try {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 7);

    const fromDate = today.toISOString().split("T")[0];
    const toDate = maxDate.toISOString().split("T")[0];

    const url = `https://api.level.travel/v3/packages?` + new URLSearchParams({
      from: departureCityName,
      date_from: fromDate,
      date_to: toDate,
      adults: adults.toString(),
      price_max: budget.toString(),
      currency: "RUB",
      per_page: "20",
      order: "price",
    });

    const response = await fetch(url, {
      headers: {
        "Authorization": `Token ${token}`,
        "Accept": "application/vnd.level.travel.v3+json",
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return null;

    const data = await response.json() as { packages?: Array<{
      id: string;
      hotel: { name: string; stars: number; country: { name: string }; resort: { name: string } };
      price: number;
      checkin: string;
      checkout: string;
      nights: number;
      meal: string;
      operator: { name: string };
    }> };
    
    if (!data.packages?.length) return null;

    return data.packages.map((pkg) => ({
      id: String(pkg.id),
      destination: `${pkg.hotel.country.name}, ${pkg.hotel.resort.name}`,
      country: pkg.hotel.country.name,
      city: pkg.hotel.resort.name,
      hotel: pkg.hotel.name,
      stars: pkg.hotel.stars,
      departureDate: pkg.checkin,
      returnDate: pkg.checkout,
      nights: pkg.nights,
      price: Math.round(pkg.price / adults),
      totalPrice: pkg.price,
      mealType: pkg.meal,
      imageUrl: DESTINATION_IMAGES[pkg.hotel.country.name] || "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800&q=80",
      operatorName: pkg.operator.name,
    }));
  } catch (err) {
    console.error("Level.Travel API error:", err);
    return null;
  }
}

function generateDemoTours(departureCityName: string, budget: number, adults: number): RawTour[] {
  const allTours: RawTour[] = [];
  const countries = Object.keys(HOTELS_BY_COUNTRY);
  const shuffledCountries = shuffle(countries);

  for (const country of shuffledCountries) {
    const hotels = HOTELS_BY_COUNTRY[country];
    const shuffledHotels = shuffle(hotels);

    for (const hotelInfo of shuffledHotels.slice(0, 2)) {
      const nights = randomInt(5, 10);
      const departureOffset = randomInt(1, 7);
      const departureDate = getDateRange(departureOffset);
      const returnDate = getDateRange(departureOffset + nights);
      const pricePerPerson = randomInt(20000, Math.min(budget * 0.95, 130000));
      const totalPrice = pricePerPerson * adults;

      if (pricePerPerson <= budget) {
        allTours.push({
          id: `${country}-${hotelInfo.hotel}-${departureDate}`.replace(/[\s&]/g, "-"),
          destination: `${country}, ${hotelInfo.city}`,
          country,
          city: hotelInfo.city,
          hotel: hotelInfo.hotel,
          stars: hotelInfo.stars,
          departureDate,
          returnDate,
          nights,
          price: pricePerPerson,
          totalPrice,
          mealType: MEAL_TYPES[randomInt(0, MEAL_TYPES.length - 1)],
          imageUrl: DESTINATION_IMAGES[country] || "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800&q=80",
          operatorName: hotelInfo.operator,
        });
      }
    }
  }

  allTours.sort((a, b) => a.price - b.price);
  return allTours;
}

export async function searchLevelTravelTours(
  departureCityName: string,
  budget: number,
  adults: number = 2
): Promise<{ tours: RawTour[]; source: "api" | "demo" }> {
  const token = await getLevelTravelToken();

  if (token) {
    const apiTours = await fetchRealLevelTravelTours(token, departureCityName, budget, adults);
    if (apiTours && apiTours.length > 0) {
      return { tours: apiTours.slice(0, 10), source: "api" };
    }
  }

  const demoTours = generateDemoTours(departureCityName, budget, adults);
  return { tours: demoTours, source: "demo" };
}

export async function generateTourDescription(
  tour: RawTour,
  departureCityName: string,
  nights: number
): Promise<{ aiDescription: string; aiRecommendation: string; aiProvider: string }> {
  const prompt = `Ты — эксперт по спонтанным путешествиям. Опиши тур кратко и вдохновляюще.

Тур:
- Откуда: ${departureCityName}
- Куда: ${tour.country}, ${tour.city}
- Отель: ${tour.hotel} (${tour.stars}★)
- Питание: ${tour.mealType}
- Ночей: ${nights}
- Цена: ${tour.price.toLocaleString("ru-RU")} ₽/чел

Напиши ответ в формате JSON:
{
  "description": "2-3 предложения: что успеете увидеть и пережить. Конкретные места, атмосфера. Не более 80 слов.",
  "recommendation": "Одна фраза-вердикт: стоит брать прямо сейчас или нет, и почему."
}

Только JSON, без markdown.`;

  const gigaChatConfigured = await isGigaChatConfigured();

  if (gigaChatConfigured) {
    try {
      const content = await gigaChatComplete([{ role: "user", content: prompt }], "GigaChat-Pro");
      if (content) {
        const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.description && parsed.recommendation) {
          return {
            aiDescription: parsed.description,
            aiRecommendation: parsed.recommendation,
            aiProvider: "GigaChat-Pro",
          };
        }
      }
    } catch (err) {
      console.warn("GigaChat failed, falling back to OpenAI:", err);
    }
  }

  if (process.env.AI_INTEGRATIONS_OPENAI_BASE_URL) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-5-mini",
        max_completion_tokens: 300,
        messages: [{ role: "user", content: prompt }],
      });
      const content = response.choices[0]?.message?.content ?? "";
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.description && parsed.recommendation) {
        return {
          aiDescription: parsed.description,
          aiRecommendation: parsed.recommendation,
          aiProvider: "OpenAI",
        };
      }
    } catch {
      // fallback to static
    }
  }

  return {
    aiDescription: `${tour.city} встретит вас солнцем и незабываемыми впечатлениями. За ${nights} ночей успеете погрузиться в местный колорит, насладиться морем и едой.`,
    aiRecommendation: "Отличный вариант для спонтанного отдыха — берите!",
    aiProvider: "static",
  };
}

import OpenAI from "openai";

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
};

const HOTELS_BY_COUNTRY: Record<string, { hotel: string; city: string; stars: number }[]> = {
  "Турция": [
    { hotel: "Delphin Imperial Lara", city: "Анталья", stars: 5 },
    { hotel: "Akka Alinda Hotel", city: "Кемер", stars: 5 },
    { hotel: "Bellis Deluxe Hotel", city: "Белек", stars: 5 },
    { hotel: "Crystal Sunrise Queen", city: "Сиде", stars: 5 },
    { hotel: "Club Hotel Sera", city: "Анталья", stars: 5 },
    { hotel: "Rixos Premium Tekirova", city: "Кемер", stars: 5 },
    { hotel: "Selectum Luxury Resort", city: "Белек", stars: 5 },
    { hotel: "Amara Wing Resort", city: "Кемер", stars: 5 },
  ],
  "Египет": [
    { hotel: "Hilton Hurghada Plaza", city: "Хургада", stars: 5 },
    { hotel: "Stella Di Mare Beach", city: "Шарм-эль-Шейх", stars: 5 },
    { hotel: "Pickalbatros Palace", city: "Хургада", stars: 5 },
    { hotel: "Jaz Mirabel Beach", city: "Шарм-эль-Шейх", stars: 5 },
    { hotel: "Titanic Palace", city: "Хургада", stars: 5 },
  ],
  "Таиланд": [
    { hotel: "Amari Pattaya", city: "Паттайя", stars: 4 },
    { hotel: "Centara Grand Beach", city: "Самуи", stars: 5 },
    { hotel: "Phuket Graceland Resort", city: "Пхукет", stars: 5 },
    { hotel: "Holiday Inn Pattaya", city: "Паттайя", stars: 4 },
    { hotel: "Avani Pattaya Resort", city: "Паттайя", stars: 4 },
  ],
  "ОАЭ": [
    { hotel: "Jumeirah Beach Hotel", city: "Дубай", stars: 5 },
    { hotel: "Atlantis The Palm", city: "Дубай", stars: 5 },
    { hotel: "Park Hyatt Abu Dhabi", city: "Абу-Даби", stars: 5 },
    { hotel: "Rixos Premium Dubai", city: "Дубай", stars: 5 },
  ],
  "Греция": [
    { hotel: "Ikos Aria", city: "Родос", stars: 5 },
    { hotel: "Aldemar Knossos Royal", city: "Крит", stars: 5 },
    { hotel: "Mitsis Alila Resort", city: "Родос", stars: 5 },
    { hotel: "Blue Dome Corfu", city: "Корфу", stars: 4 },
  ],
  "Кипр": [
    { hotel: "Amavi Hotel", city: "Пафос", stars: 5 },
    { hotel: "Atlantica Miramare Beach", city: "Лимассол", stars: 4 },
    { hotel: "Olympic Lagoon Resort", city: "Айя-Напа", stars: 4 },
  ],
  "Испания": [
    { hotel: "Iberostar Gran Hotel", city: "Тенерифе", stars: 5 },
    { hotel: "Hotel Riu Buenavista", city: "Тенерифе", stars: 4 },
    { hotel: "Lopesan Costa Meloneras", city: "Гран-Канария", stars: 5 },
  ],
  "Черногория": [
    { hotel: "Dukley Hotel & Resort", city: "Будва", stars: 5 },
    { hotel: "Splendid Spa Resort", city: "Бечичи", stars: 5 },
    { hotel: "Hotel Plaža", city: "Улцинь", stars: 4 },
  ],
  "Тунис": [
    { hotel: "Diar Lemdina", city: "Хаммамет", stars: 5 },
    { hotel: "Regency Tunis Hotel", city: "Тунис", stars: 5 },
    { hotel: "Iberostar Averroes", city: "Хаммамет", stars: 4 },
  ],
};

const MEAL_TYPES = ["Всё включено", "Завтрак и ужин", "Только завтрак", "Без питания"];

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

export async function searchLevelTravelTours(
  departureCityName: string,
  budget: number,
  adults: number = 2
): Promise<RawTour[]> {
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
      const pricePerPerson = randomInt(15000, Math.min(budget * 0.9, 120000));
      const totalPrice = pricePerPerson * adults;

      if (totalPrice / adults <= budget) {
        allTours.push({
          id: `${country}-${hotelInfo.hotel}-${departureDate}`.replace(/\s+/g, "-"),
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
        });
      }
    }
  }

  allTours.sort((a, b) => a.price - b.price);
  return allTours.slice(0, 10);
}

export async function generateTourDescription(
  tour: RawTour,
  departureCityName: string,
  nights: number
): Promise<{ aiDescription: string; aiRecommendation: string }> {
  try {
    const prompt = `Ты — эксперт по спонтанным путешествиям. Опиши тур кратко и вдохновляюще для человека, который хочет спонтанно уехать на выходные.

Тур:
- Откуда: ${departureCityName}
- Куда: ${tour.country}, ${tour.city}
- Отель: ${tour.hotel} (${tour.stars}★)
- Питание: ${tour.mealType}
- Ночей: ${nights}
- Цена: ${tour.price.toLocaleString("ru-RU")} ₽/чел

Напиши ответ в формате JSON:
{
  "description": "2-3 предложения: что успеете увидеть и пережить за эти дни. Конкретные достопримечательности, атмосфера, чем запомнится. Не более 80 слов.",
  "recommendation": "Одна фраза-вердикт: стоит брать прямо сейчас или нет, и почему."
}

Отвечай только JSON, без markdown-блоков.`;

    const response = await openai.chat.completions.create({
      model: "gpt-5-mini",
      max_completion_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.choices[0]?.message?.content ?? "";
    const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);
    return {
      aiDescription: parsed.description || "Отличное направление для спонтанного отдыха!",
      aiRecommendation: parsed.recommendation || "Стоит брать!",
    };
  } catch {
    return {
      aiDescription: `${tour.city} встретит вас солнцем и незабываемыми впечатлениями. За ${nights} ночей успеете погрузиться в местный колорит, насладиться морем и едой.`,
      aiRecommendation: "Отличный вариант для спонтанного отдыха — берите!",
    };
  }
}

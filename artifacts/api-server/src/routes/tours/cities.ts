import { Router, type IRouter } from "express";

const router: IRouter = Router();

const DEPARTURE_CITIES = [
  { id: "1", name: "Москва", nameEn: "Moscow" },
  { id: "2", name: "Санкт-Петербург", nameEn: "Saint Petersburg" },
  { id: "4", name: "Екатеринбург", nameEn: "Yekaterinburg" },
  { id: "3", name: "Новосибирск", nameEn: "Novosibirsk" },
  { id: "5", name: "Казань", nameEn: "Kazan" },
  { id: "6", name: "Нижний Новгород", nameEn: "Nizhny Novgorod" },
  { id: "7", name: "Челябинск", nameEn: "Chelyabinsk" },
  { id: "8", name: "Самара", nameEn: "Samara" },
  { id: "9", name: "Уфа", nameEn: "Ufa" },
  { id: "10", name: "Ростов-на-Дону", nameEn: "Rostov-on-Don" },
  { id: "11", name: "Краснодар", nameEn: "Krasnodar" },
  { id: "12", name: "Пермь", nameEn: "Perm" },
  { id: "13", name: "Красноярск", nameEn: "Krasnoyarsk" },
  { id: "14", name: "Воронеж", nameEn: "Voronezh" },
  { id: "15", name: "Тюмень", nameEn: "Tyumen" },
];

router.get("/", (_req, res) => {
  res.json({ cities: DEPARTURE_CITIES });
});

export { DEPARTURE_CITIES };
export default router;

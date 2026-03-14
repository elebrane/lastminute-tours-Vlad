import { Router, type IRouter } from "express";
import { searchLevelTravelTours, generateTourDescription } from "./leveltravel.js";

const router: IRouter = Router();

router.post("/", async (req, res) => {
  try {
    const { departureCity, budget, adults = 2 } = req.body;

    if (!departureCity || typeof departureCity !== "string") {
      res.status(400).json({ error: "BAD_REQUEST", message: "departureCity is required" });
      return;
    }

    if (!budget || typeof budget !== "number" || budget <= 0) {
      res.status(400).json({ error: "BAD_REQUEST", message: "budget must be a positive number" });
      return;
    }

    const rawTours = await searchLevelTravelTours(departureCity, budget, adults);

    const topTours = rawTours.slice(0, 3);

    const toursWithDescriptions = await Promise.all(
      topTours.map(async (tour) => {
        const { aiDescription, aiRecommendation } = await generateTourDescription(
          tour,
          departureCity,
          tour.nights
        );
        return {
          ...tour,
          aiDescription,
          aiRecommendation,
        };
      })
    );

    res.json({
      tours: toursWithDescriptions,
      searchId: Date.now().toString(),
      departureCity,
      budget,
      totalFound: rawTours.length,
    });
  } catch (err) {
    console.error("Tour search error:", err);
    res.status(500).json({ error: "INTERNAL_ERROR", message: "Failed to search tours" });
  }
});

export default router;

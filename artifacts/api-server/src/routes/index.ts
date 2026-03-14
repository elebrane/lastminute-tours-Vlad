import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import citiesRouter from "./tours/cities.js";
import searchRouter from "./tours/search.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/tours/cities", citiesRouter);
router.use("/tours/search", searchRouter);

export default router;

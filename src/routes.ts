import { Router } from "express";
import farmersRouter from "./api/farmers/farmers.router";
import landsRouter from "./api/land/land.router";
import seedRouter from "./api/seeds/seed.router";
import adminRouter from "./api/admin/admin.router";

const router = Router();

router.use("/farmers", farmersRouter);
router.use("/land", landsRouter);
router.use("/seeds", seedRouter);
router.use("/admin", adminRouter);

export default router;

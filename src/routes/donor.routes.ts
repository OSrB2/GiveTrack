import { Router } from "express";
import { createDonorController, findAllDonorsController, findDonorByIdController, updateDonorController } from "../controllers/donor.controller.js";

const donorRouter = Router();

donorRouter.post("/", createDonorController);
donorRouter.get("/", findAllDonorsController);
donorRouter.get("/:id", findDonorByIdController);
donorRouter.patch("/:id", updateDonorController);

export default donorRouter;
import express from "express";
import cors from "cors";
import donorRouter from "./routes/donor.routes.js";
import { errorHandler } from "./middlewares/error-handler.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "OK "});
});

app.use("/donors", donorRouter);
app.use(errorHandler);

export default app;
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

import { connectDB } from "./config/db.js";
import { setupSwagger } from "./config/swagger.js";
import { startCron } from "../cron.js";
import injectRouter from "./routes/inject.routes.js";
import productRouter from "./routes/product.routes.js";
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/ingest", injectRouter);

connectDB();
setupSwagger(app);

app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/products", productRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

startCron();

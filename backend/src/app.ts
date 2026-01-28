import express from "express";
import cors from "cors";
import categoryRoutes from "./routes/category.routes";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import settingsRoutes from "./routes/settings.routes";
import orderRoutes from "./routes/order.routes";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// global Middlewares
app.use(cors({ origin: process.env.FRONT_URL, credentials: true}));
app.use(express.json());

app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/orders", orderRoutes);

app.use("/uploads", express.static("uploads"));

/*// Route test
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running (u)"
  });
});*/

export default app;

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import { clerkMiddleware } from "@clerk/express";

// ROUTES
import businessProfileRouter from "./routes/businessProfileRouter.js";
import invoiceRouter from "./routes/invoiceRouter.js";
import aiInvoiceRouter from "./routes/aiInvoiceRouter.js";

// DB
import {connectDB} from "./config/db.js"; // ✅ default import

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

/* ===============================
   ✅ CORS (FIXED & STABLE)
================================ */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ai-invoice-generator-kz53.vercel.app",
    ],
    credentials: true,
  })
);

// (OPTIONAL TEMP DEBUG — uncomment if needed)
// app.use(cors());

/* ===============================
   MIDDLEWARES
================================ */
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Clerk middleware (does NOT protect routes by default)
app.use(clerkMiddleware());

/* ===============================
   DATABASE
================================ */
connectDB();

/* ===============================
   STATIC FILES
================================ */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* ===============================
   ROUTES
================================ */
app.use("/api/businessProfile", businessProfileRouter);
app.use("/api/invoice", invoiceRouter);
app.use("/api/ai", aiInvoiceRouter);

/* ===============================
   HEALTH CHECK
================================ */
app.get("/", (req, res) => {
  res.send("✅ API Working with Clerk Auth");
});

/* ===============================
   SERVER
================================ */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

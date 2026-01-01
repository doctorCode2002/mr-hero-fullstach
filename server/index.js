import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import { PrismaClient } from "@prisma/client"; // Removed for safety
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import { createRequire } from 'module'; // Added for safe require

// __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

dotenv.config();

const app = express();

let prisma;
try {
  // Safe synchronous require to avoid top-level await issues
  const { PrismaClient } = require("@prisma/client");
  prisma = new PrismaClient();
  console.log("Prisma Client initialized successfully");
} catch (error) {
  console.error("Failed to initialize Prisma Client:", error);
}

// Middleware to ensure DB is ready for DB routes
const ensureDb = (req, res, next) => {
  if (!prisma) {
    return res.status(500).json({ message: "Database not initialized. Check server logs." });
  }
  next();
};

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })

const PORT = process.env.PORT || 4000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "local-admin-token";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "*";

const allowedOrigins =
  CLIENT_ORIGIN === "*"
    ? true
    : CLIENT_ORIGIN.split(",").map((o) => o.trim());

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.static(path.join(__dirname, '../dist')));

const toCategoryDto = (category) => ({
  id: category.id,
  image: category.image,
  name: {
    en: category.nameEn,
    ar: category.nameAr,
  },
});

// ... (rest of code)

// Helper to debug Vercel requests
app.get("/api/debug-auth", (req, res) => {
  res.json({
    message: "Debug Endpoint",
    url: req.url,
    headers: req.headers,
    dbStatus: prisma ? "Initialized" : "Failed",
    env: {
       hasAdminPass: !!process.env.ADMIN_PASSWORD,
       hasDbUrl: !!process.env.DATABASE_URL,
       nodeEnv: process.env.NODE_ENV
    }
  });
});

app.post("/api/auth/login", (req, res) => {
  const { password } = req.body;
  console.log("Login Attempt:", {
     received: password, 
     matchesDefault: password === "admin123", 
     envPassSet: !!process.env.ADMIN_PASSWORD 
  });
  
  if (password === ADMIN_PASSWORD) {
    return res.json({ token: ADMIN_TOKEN });
  }
  return res.status(401).json({ message: "Invalid password" });
});
  id: category.id,
  image: category.image,
  name: {
    en: category.nameEn,
    ar: category.nameAr,
  },
});

const toProductDto = (product) => ({
  id: product.id,
  categoryId: product.categoryId,
  images: product.imagesRaw.split("|"),
  name: { en: product.nameEn, ar: product.nameAr },
  description: { en: product.descriptionEn, ar: product.descriptionAr },
  itemsPerPallet: product.itemsPerPallet,
  baseCostEGP: product.baseCostEGP,
  conversionRate: product.conversionRate,
  deliveryCostPerItemILS: product.deliveryCostPerItemILS,
  sellingPricePerItemILS: product.sellingPricePerItemILS,
  isActive: product.isActive,
});

const fromProductPayload = (payload) => ({
  categoryId: payload.categoryId,
  nameEn: payload.name?.en || "",
  nameAr: payload.name?.ar || "",
  descriptionEn: payload.description?.en || "",
  descriptionAr: payload.description?.ar || "",
  imagesRaw: (payload.images && payload.images.length
    ? payload.images
    : ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800"]
  ).join("|"),
  itemsPerPallet: payload.itemsPerPallet,
  baseCostEGP: payload.baseCostEGP,
  conversionRate: payload.conversionRate,
  deliveryCostPerItemILS: payload.deliveryCostPerItemILS,
  sellingPricePerItemILS: payload.sellingPricePerItemILS,
  isActive: payload.isActive ?? true,
});

const requireAdmin = (req, res, next) => {
  const token = req.headers["x-admin-token"];
  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Upload Endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  // Construct URL. In production, use full domain or relative path if proxied correctly.
  // Here we return a relative path that the frontend can prepend with API_URL or base.
  // Actually, simplest is to return full URL if we know the host, or just the path.
  // Let's return the path relative to server root, which client accesses via http://localhost:4000/uploads/...
  const fileUrl = `${process.env.API_URL || 'http://localhost:4000'}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/auth/login", (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    return res.json({ token: ADMIN_TOKEN });
  }
  return res.status(401).json({ message: "Invalid password" });
});

app.get("/api/categories", async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(categories.map(toCategoryDto));
  } catch (error) {
    next(error);
  }
});

app.post("/api/categories", requireAdmin, async (req, res, next) => {
  try {
    const created = await prisma.category.create({
      data: {
        nameEn: req.body.name?.en || "",
        nameAr: req.body.name?.ar || "",
        image: req.body.image,
      },
    });
    res.status(201).json(toCategoryDto(created));
  } catch (error) {
    next(error);
  }
});

app.put("/api/categories/:id", requireAdmin, async (req, res, next) => {
  try {
    const updated = await prisma.category.update({
      where: { id: req.params.id },
      data: {
        nameEn: req.body.name?.en || "",
        nameAr: req.body.name?.ar || "",
        image: req.body.image,
      },
    });
    res.json(toCategoryDto(updated));
  } catch (error) {
    next(error);
  }
});

app.delete("/api/categories/:id", requireAdmin, async (req, res, next) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.get("/api/products", async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(products.map(toProductDto));
  } catch (error) {
    next(error);
  }
});

app.post("/api/products", requireAdmin, async (req, res, next) => {
  try {
    const created = await prisma.product.create({
      data: fromProductPayload(req.body),
    });
    res.status(201).json(toProductDto(created));
  } catch (error) {
    next(error);
  }
});

app.put("/api/products/:id", requireAdmin, async (req, res, next) => {
  try {
    const updated = await prisma.product.update({
      where: { id: req.params.id },
      data: fromProductPayload(req.body),
    });
    res.json(toProductDto(updated));
  } catch (error) {
    next(error);
  }
});

app.delete("/api/products/:id", requireAdmin, async (req, res, next) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.get("/api/settings", async (req, res, next) => {
  try {
    const settings = await prisma.appSettings.upsert({
      where: { id: 1 },
      update: {},
      create: { whatsappNumber: "1234567890", currencyLabel: "ILS", conversionRate: 0.1 },
    });
    res.json({
      whatsappNumber: settings.whatsappNumber,
      currencyLabel: settings.currencyLabel,
      conversionRate: settings.conversionRate,
    });
  } catch (error) {
    next(error);
  }
});

app.put("/api/settings", requireAdmin, async (req, res, next) => {
  try {
    const updated = await prisma.appSettings.update({
      where: { id: 1 },
      data: {
        whatsappNumber: req.body.whatsappNumber,
        currencyLabel: req.body.currencyLabel,
        conversionRate: req.body.conversionRate,
      },
    });
    res.json({
      whatsappNumber: updated.whatsappNumber,
      currencyLabel: updated.currencyLabel,
      conversionRate: updated.conversionRate,
    });
  } catch (error) {
    next(error);
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

export { app };

let server;
if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  server = app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
}

const shutdown = async () => {
  try {
    if (prisma) await prisma.$disconnect();
    if (server) server.close(() => process.exit(0));
  } catch (e) {
    console.error("Error during shutdown:", e);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

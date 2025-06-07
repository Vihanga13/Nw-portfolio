var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// vite.config.ts
var vite_config_exports = {};
__export(vite_config_exports, {
  default: () => vite_config_default
});
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path3 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default;
var init_vite_config = __esm({
  async "vite.config.ts"() {
    "use strict";
    vite_config_default = defineConfig({
      plugins: [
        react(),
        runtimeErrorOverlay(),
        ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
          await import("@replit/vite-plugin-cartographer").then(
            (m) => m.cartographer()
          )
        ] : []
      ],
      resolve: {
        alias: {
          "@": path3.resolve(import.meta.dirname, "client", "src"),
          "@shared": path3.resolve(import.meta.dirname, "shared"),
          "@assets": path3.resolve(import.meta.dirname, "attached_assets")
        }
      },
      root: path3.resolve(import.meta.dirname, "client"),
      build: {
        outDir: path3.resolve(import.meta.dirname, "dist/public"),
        emptyOutDir: true,
        rollupOptions: {
          output: {
            assetFileNames: (assetInfo) => {
              if (assetInfo.name === "logo.png") {
                return "assets/[name][extname]";
              }
              return "assets/[name]-[hash][extname]";
            },
            chunkFileNames: "assets/[name]-[hash].js",
            entryFileNames: "assets/[name]-[hash].js",
            manualChunks: (id) => {
              if (id.includes("node_modules")) {
                return id.split("node_modules/")[1].split("/")[0];
              }
            }
          }
        }
      }
    });
  }
});

// server/vite.ts
var vite_exports = {};
__export(vite_exports, {
  log: () => log2,
  serveStatic: () => serveStatic2,
  setupVite: () => setupVite
});
import express2 from "express";
import fs2 from "fs";
import path4 from "path";
import { nanoid } from "nanoid";
function log2(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const { createServer: createViteServer, createLogger } = await import("vite");
  const viteLogger = createLogger();
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: void 0
  };
  const { default: viteConfig } = await init_vite_config().then(() => vite_config_exports);
  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path4.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic2(app2) {
  const distPath = path4.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use(express2.static(path4.resolve(import.meta.dirname, "../client/dist")));
  app2.use("*", (_req, res) => {
    res.sendFile(path4.resolve(distPath, "index.html"));
  });
}
var init_vite = __esm({
  "server/vite.ts"() {
    "use strict";
  }
});

// server/index.ts
import express3 from "express";

// server/routes.ts
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.contacts = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentContactId = 1;
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async createContact(insertContact) {
    const id = this.currentContactId++;
    const contact = {
      ...insertContact,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.contacts.set(id, contact);
    return contact;
  }
  async getAllContacts() {
    return Array.from(this.contacts.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertContactSchema = createInsertSchema(contacts).pick({
  name: true,
  email: true,
  subject: true,
  message: true
}).extend({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

// server/routes.ts
import { z as z2 } from "zod";
import nodemailer from "nodemailer";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var envPath = path.resolve(__dirname, "../.env");
var result = dotenv.config({ path: envPath });
if (result.error) {
  console.error("Error loading .env file:", result.error);
  process.exit(1);
}
if (!process.env.EMAIL_USER || !process.env.CONTACT_EMAIL_PASS) {
  throw new Error("Missing required email configuration environment variables");
}
var transportOptions = {
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.CONTACT_EMAIL_PASS,
    type: "login"
  },
  tls: {
    rejectUnauthorized: false
  },
  logger: true,
  debug: true
};
var transporter = nodemailer.createTransport(transportOptions);
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Connection Error:", error);
    console.error("Email configuration:", {
      user: process.env.EMAIL_USER,
      passLength: process.env.CONTACT_EMAIL_PASS ? process.env.CONTACT_EMAIL_PASS.length : 0
    });
  } else {
    console.log("SMTP Server is ready to send emails");
  }
});
async function registerRoutes(app2) {
  app2.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      const mailOptions = {
        from: `Portfolio Contact <vihaax23@gmail.com>`,
        to: "vihaax23@gmail.com",
        subject: `New Contact Form Submission: ${validatedData.subject}`,
        text: `Name: ${validatedData.name}
Email: ${validatedData.email}
Subject: ${validatedData.subject}
Message: ${validatedData.message}`,
        html: `<h3>New Contact Form Submission</h3><p><b>Name:</b> ${validatedData.name}</p><p><b>Email:</b> ${validatedData.email}</p><p><b>Subject:</b> ${validatedData.subject}</p><p><b>Message:</b><br/>${validatedData.message}</p>`
      };
      try {
        console.log("Attempting to send email with options:", {
          from: mailOptions.from,
          to: mailOptions.to,
          subject: mailOptions.subject
        });
        const info = await transporter.sendMail({
          ...mailOptions,
          priority: "high",
          headers: {
            "x-priority": "1",
            "x-msmail-priority": "High",
            importance: "high"
          }
        });
        console.log("Email sent successfully:", {
          messageId: info.messageId,
          response: info.response,
          accepted: info.accepted,
          rejected: info.rejected
        });
        res.status(201).json({
          success: true,
          message: "Message sent successfully!",
          contact: {
            id: contact.id,
            name: contact.name,
            email: contact.email,
            subject: contact.subject,
            createdAt: contact.createdAt
          }
        });
      } catch (emailError) {
        console.error("Email sending failed:", {
          error: emailError.message,
          stack: emailError.stack,
          code: emailError.code
        });
        res.status(201).json({
          success: true,
          message: "Message saved but email notification failed. We'll process it manually.",
          contact: {
            id: contact.id,
            name: contact.name,
            email: contact.email,
            subject: contact.subject,
            createdAt: contact.createdAt
          }
        });
      }
    } catch (error) {
      if (error instanceof z2.ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.errors
        });
      } else {
        res.status(500).json({
          success: false,
          message: "Failed to send message"
        });
      }
    }
  });
  app2.get("/api/contacts", async (req, res) => {
    try {
      const contacts2 = await storage.getAllContacts();
      res.json(contacts2);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch contacts"
      });
    }
  });
  app2.get("/api/test-email", async (req, res) => {
    try {
      const testMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "Test Email",
        text: "This is a test email to verify the email configuration.",
        html: "<h3>Test Email</h3><p>This is a test email to verify the email configuration.</p>"
      };
      console.log("Sending test email...");
      const info = await transporter.sendMail(testMailOptions);
      console.log("Test email sent successfully:", info.response);
      res.json({
        success: true,
        message: "Test email sent successfully!",
        info: info.response
      });
    } catch (error) {
      console.error("Test email failed:", {
        error: error.message,
        stack: error.stack,
        code: error.code
      });
      res.status(500).json({
        success: false,
        message: "Failed to send test email",
        error: error.message
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/utils.ts
import express from "express";
import fs from "fs";
import path2 from "path";
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "../dist/public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import dotenv2 from "dotenv";
import path5 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = path5.dirname(__filename2);
var envPath2 = path5.resolve(__dirname2, "../.env");
console.log("Loading .env file from:", envPath2);
var result2 = dotenv2.config({ path: envPath2 });
if (result2.error && process.env.NODE_ENV !== "production") {
  console.error("Error loading .env file:", result2.error);
  console.log("This is expected in production environments where env vars are set directly");
} else if (result2.error) {
  console.log("No .env file found, using environment variables from system");
}
console.log("Current working directory:", process.cwd());
console.log("Loaded environment variables:", {
  EMAIL_USER: process.env.EMAIL_USER,
  CONTACT_EMAIL_PASS_LENGTH: process.env.CONTACT_EMAIL_PASS ? process.env.CONTACT_EMAIL_PASS.length : 0,
  NODE_ENV: process.env.NODE_ENV
});
var requiredEnvVars = ["EMAIL_USER", "CONTACT_EMAIL_PASS"];
var missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error("Missing required environment variables:", missingEnvVars.join(", "));
  process.exit(1);
}
console.log("Environment loaded successfully. Email configured for:", process.env.EMAIL_USER);
var app = express3();
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path6 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path6.startsWith("/api")) {
      let logLine = `${req.method} ${path6} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    const { setupVite: setupVite2 } = await Promise.resolve().then(() => (init_vite(), vite_exports));
    await setupVite2(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5001;
  app.listen(5001, () => {
    const url = `http://localhost:${port}`;
    log(`Server is running at ${url}`);
  });
})();

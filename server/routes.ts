import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, type InsertContact } from "@shared/schema";
import { z } from "zod";
import nodemailer from "nodemailer";

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);

      // Send email notification to site owner
      // Configure your email transport (use your real credentials or environment variables)
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "vihaax23@gmail.com",
          pass: process.env.CONTACT_EMAIL_PASS
        },
        debug: true, // Enable debug output
        logger: true // Log information in console
      });

      const mailOptions = {
        from: `Portfolio Contact <vihaax23@gmail.com>`,
        to: "vihaax23@gmail.com",
        subject: `New Contact Form Submission: ${validatedData.subject}`,
        text: `Name: ${validatedData.name}\nEmail: ${validatedData.email}\nSubject: ${validatedData.subject}\nMessage: ${validatedData.message}`,
        html: `<h3>New Contact Form Submission</h3><p><b>Name:</b> ${validatedData.name}</p><p><b>Email:</b> ${validatedData.email}</p><p><b>Subject:</b> ${validatedData.subject}</p><p><b>Message:</b><br/>${validatedData.message}</p>`
      };

      await transporter.sendMail(mailOptions);

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
    } catch (error) {
      if (error instanceof z.ZodError) {
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

  // Get all contacts (admin endpoint)
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: "Failed to fetch contacts" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

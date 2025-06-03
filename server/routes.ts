import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables before any other imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Error loading .env file:', result.error);
  process.exit(1);
}

import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, type InsertContact } from "@shared/schema";
import { z } from "zod";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

// Validate required environment variables
if (!process.env.EMAIL_USER || !process.env.CONTACT_EMAIL_PASS) {
  throw new Error('Missing required email configuration environment variables');
}

// Configure transport options
const transportOptions: SMTPTransport.Options = {
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.CONTACT_EMAIL_PASS,
    type: 'login'
  },
  tls: {
    rejectUnauthorized: false
  },
  logger: true,
  debug: true
};

// Create a reusable transporter object
const transporter = nodemailer.createTransport(transportOptions);

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Connection Error:', error);
    console.error('Email configuration:', {
      user: process.env.EMAIL_USER,
      passLength: process.env.CONTACT_EMAIL_PASS ? process.env.CONTACT_EMAIL_PASS.length : 0
    });
  } else {
    console.log('SMTP Server is ready to send emails');
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact form submission endpoint
  app.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);

      // Prepare email options
      const mailOptions = {
        from: `Portfolio Contact <vihaax23@gmail.com>`,
        to: "vihaax23@gmail.com",
        subject: `New Contact Form Submission: ${validatedData.subject}`,
        text: `Name: ${validatedData.name}\nEmail: ${validatedData.email}\nSubject: ${validatedData.subject}\nMessage: ${validatedData.message}`,
        html: `<h3>New Contact Form Submission</h3><p><b>Name:</b> ${validatedData.name}</p><p><b>Email:</b> ${validatedData.email}</p><p><b>Subject:</b> ${validatedData.subject}</p><p><b>Message:</b><br/>${validatedData.message}</p>`
      };

      try {
        console.log('Attempting to send email with options:', {
          from: mailOptions.from,
          to: mailOptions.to,
          subject: mailOptions.subject
        });
        
        const info = await transporter.sendMail({
          ...mailOptions,
          priority: 'high',
          headers: {
            'x-priority': '1',
            'x-msmail-priority': 'High',
            importance: 'high'
          }
        });
        
        console.log('Email sent successfully:', {
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
      } catch (emailError: any) {
        console.error("Email sending failed:", {
          error: emailError.message,
          stack: emailError.stack,
          code: emailError.code
        });
        
        // Save the contact but inform about email failure
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

  // Test email route
  app.get("/api/test-email", async (req, res) => {
    try {
      const testMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "Test Email",
        text: "This is a test email to verify the email configuration.",
        html: "<h3>Test Email</h3><p>This is a test email to verify the email configuration.</p>"
      };

      console.log('Sending test email...');
      const info = await transporter.sendMail(testMailOptions);
      console.log('Test email sent successfully:', info.response);

      res.json({ 
        success: true, 
        message: "Test email sent successfully!",
        info: info.response
      });
    } catch (error: any) {
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

  const httpServer = createServer(app);
  return httpServer;
}

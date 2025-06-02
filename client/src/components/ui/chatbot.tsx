"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageSquare, Send, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm Vihanga's AI assistant. I can help you learn more about:\n\n• Education & Experience\n• Technical Skills\n• Projects\n• Contact Information\n\nWhat would you like to know?",
    },
  ]);
  const [input, setInput] = React.useState("");
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  const getBotResponse = (message: string): string => {
    const lowerMsg = message.toLowerCase();
    
    // Education related queries
    if (lowerMsg.includes("education") || lowerMsg.includes("study") || lowerMsg.includes("degree")) {
      return "I'm pursuing a BSc (Hons) in Computer Science at NSBM Green University (2022-2025). I also have completed:\n\n• Web Design certification from University of Moratuwa\n• Diploma in English Language from ICBT Campus\n• A/L in Mathematics Stream from Prince Of Wales' College";
    }
    
    // Skills related queries
    if (lowerMsg.includes("skill") || lowerMsg.includes("technologies") || lowerMsg.includes("programming")) {
      return "I'm skilled in:\n\n• Programming: C, C#, Python, JavaScript, PHP\n• Web Tech: React, MERN Stack, Node.js\n• Mobile Dev: React Native, Flutter\n• Tools: MySQL, Firebase, Figma\n\nI also have strong soft skills in teamwork, adaptability, and problem-solving.";
    }
    
    // Project related queries
    if (lowerMsg.includes("project") || lowerMsg.includes("work") || lowerMsg.includes("portfolio")) {
      return "Here are some of my key projects:\n\n1. MIMS - Medical Information Management System using PyQt5 & Firebase\n2. GREEN STAY - Hostel finding platform with PHP & MySQL\n3. GREEN RIDE - Transportation app using Flutter & Firebase\n\nWould you like to know more about any specific project?";
    }
    
    // Contact related queries
    if (lowerMsg.includes("contact") || lowerMsg.includes("email") || lowerMsg.includes("phone") || lowerMsg.includes("reach")) {
      return "You can reach me through:\n\n• Email: vihaax23@gmail.com\n• Phone: +94 712 547 892\n• LinkedIn: www.linkedin.com/in/vihanga-nilusha\n• GitHub: github.com/Vihanga13";
    }
    
    // Location related queries
    if (lowerMsg.includes("location") || lowerMsg.includes("where") || lowerMsg.includes("based")) {
      return "I'm based in Moratuwa, Sri Lanka. I'm fluent in both Sinhala and English.";
    }
    
    // About me queries
    if (lowerMsg.includes("about") || lowerMsg.includes("who") || lowerMsg.includes("background")) {
      return "I'm Vihanga Nilusha, a Computer Science undergraduate passionate about web and mobile development. I have hands-on experience with various technologies and frameworks. I focus on creating innovative digital solutions and am always eager to learn and grow in the field.";
    }

    // Experience related queries
    if (lowerMsg.includes("experience") || lowerMsg.includes("work experience") || lowerMsg.includes("leadership")) {
      return "My experience includes:\n\n• Senior Prefect at Prince Of Wales' College\n• Vice President of Science Society\n• President of Christian Society\n• Cricket Team Member (U13, U15, U17)\n\nI have leadership experience in student organizations and a track record of successful project delivery.";
    }
    
    // Default response for unmatched queries
    return "I can help you learn about Vihanga's education, skills, projects, or how to contact him. What specific information are you looking for?";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    // Get and add bot response
    const botResponse = getBotResponse(input);
    setTimeout(() => {
      const botMessage: Message = {
        role: "assistant",
        content: botResponse,
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);

    setInput("");
  };

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {/* Floating button */}
      <Button
        className={cn(          "fixed bottom-4 right-4 rounded-full p-7 shadow-lg scale-110",
          !isOpen && "bg-gradient-to-r from-primary to-secondary text-primary-foreground hover:scale-[1.2]",
          isOpen && "bg-muted hover:bg-muted"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-12 w-12" /> : <MessageSquare className="h-12 w-12" />}
      </Button>

      {/* Chat window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-4 w-[400px] h-[500px] shadow-xl border-primary/10">
          <CardHeader className="bg-gradient-to-r from-primary to-secondary text-primary-foreground p-4">
            <div className="font-semibold">Chat with AI Assistant</div>
          </CardHeader>
          <ScrollArea className="h-[380px] p-4" ref={scrollAreaRef}>
            <CardContent className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex w-fit max-w-[80%] rounded-lg px-4 py-2 whitespace-pre-wrap",
                    message.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  {message.content}
                </div>
              ))}
            </CardContent>
          </ScrollArea>
          <CardFooter className="p-4 pt-2 border-t">
            <form onSubmit={handleSubmit} className="flex w-full gap-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" className="bg-primary hover:bg-primary/90 p-6">
                <Send className="h-6 w-6" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
}

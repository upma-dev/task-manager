"use client";

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { askAIChatbotAcademicQuestions } from '@/ai/flows/ai-answer-questions';
import { getStudyTips } from '@/ai/flows/study-coach';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

export function ChatbotDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);
  
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        { id: Date.now().toString(), text: "Hello! I'm StudyZen AI. How can I help you plan your studies, give tips, or answer academic questions?", sender: 'ai' }
      ]);
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
    };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      let aiResponseText = "I'm sorry, I couldn't process that request.";
      // Simple heuristic to determine which AI flow to call
      if (inputValue.toLowerCase().includes('question') || inputValue.toLowerCase().includes('what is') || inputValue.toLowerCase().includes('explain')) {
        const response = await askAIChatbotAcademicQuestions({ question: inputValue });
        aiResponseText = response.answer;
      } else if (inputValue.toLowerCase().includes('tip') || inputValue.toLowerCase().includes('advice') || inputValue.toLowerCase().includes('plan')) {
        const response = await getStudyTips({ query: inputValue });
        aiResponseText = response.tips;
      } else {
         const response = await getStudyTips({ query: `Respond to: ${inputValue}` });
         aiResponseText = response.tips;
      }
      
      const newAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'ai',
      };
      setMessages((prevMessages) => [...prevMessages, newAiMessage]);
    } catch (error) {
      console.error('AI Error:', error);
      const errorAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I encountered an error. Please try again.",
        sender: 'ai',
      };
      setMessages((prevMessages) => [...prevMessages, errorAiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-primary hover:text-primary-foreground hover:bg-primary/90">
          <Bot className="h-6 w-6" />
          <span className="sr-only">Open Chatbot</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] h-[70vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary font-headline">
            <Bot className="h-6 w-6" /> StudyZen AI Assistant
          </DialogTitle>
          <DialogDescription>
            Ask questions, get study tips, or plan your sessions.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow p-4 border rounded-md bg-muted/20" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.sender === 'ai' && (
                  <Bot className="w-6 h-6 text-primary flex-shrink-0" />
                )}
                <div
                  className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-accent/40 dark:bg-accent/20 text-accent-foreground border border-accent/50 dark:border-accent/30'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                </div>
                 {message.sender === 'user' && (
                  <User className="w-6 h-6 text-accent-foreground flex-shrink-0" />
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start items-end gap-2">
                <Bot className="w-6 h-6 text-primary flex-shrink-0" />
                <div className="max-w-[70%] p-3 rounded-lg shadow-sm bg-accent/40 dark:bg-accent/20 text-accent-foreground border border-accent/50 dark:border-accent/30">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <DialogFooter className="pt-4">
          <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" onClick={handleSendMessage} disabled={isLoading} className="bg-primary hover:bg-primary/80">
              <Send className="w-4 h-4 mr-2" /> Send
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

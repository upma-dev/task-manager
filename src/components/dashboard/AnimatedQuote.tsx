"use client";

import { useState, useEffect } from 'react';
import { inspirationalQuotes } from '@/lib/quotes';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Quote } from 'lucide-react';

export function AnimatedQuote() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % inspirationalQuotes.length);
        setIsVisible(true);
      }, 500); // Match transition duration
    }, 7000); // Change quote every 7 seconds

    return () => clearInterval(interval);
  }, []);

  const currentQuote = inspirationalQuotes[currentIndex];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-primary">
          <Quote className="w-6 h-6 mr-2" />
          Inspirational Quote
        </CardTitle>
      </CardHeader>
      <CardContent
        className={`transition-opacity duration-500 ease-in-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p className="text-lg italic">"{currentQuote.quote}"</p>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground font-medium w-full text-right">
          - {currentQuote.author}
        </p>
      </CardFooter>
    </Card>
  );
}

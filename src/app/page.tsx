
"use client"

import { AnimatedQuote } from "@/components/dashboard/AnimatedQuote";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-xl bg-gradient-to-br from-primary/20 to-accent/20">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">Welcome to StudyZen!</CardTitle>
          <CardDescription className="text-lg">
            Your AI-powered assistant for focused and productive study sessions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6">
            Navigate using the sidebar to manage your tasks, jot down notes, or enter a deep focus session.
            Let's make learning effective and enjoyable!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/tasks" passHref>
              <Button variant="outline" className="w-full justify-start text-left h-auto py-3 group hover:bg-accent/50">
                <div className="flex flex-col">
                  <span className="font-semibold">Manage Tasks</span>
                  <span className="text-xs text-muted-foreground">Organize your to-dos</span>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity"/>
              </Button>
            </Link>
             <Link href="/notes" passHref>
              <Button variant="outline" className="w-full justify-start text-left h-auto py-3 group hover:bg-accent/50">
                <div className="flex flex-col">
                  <span className="font-semibold">Jot Notes</span>
                  <span className="text-xs text-muted-foreground">Capture your thoughts</span>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity"/>
              </Button>
            </Link>
             <Link href="/focus" passHref>
              <Button variant="outline" className="w-full justify-start text-left h-auto py-3 group hover:bg-accent/50">
                 <div className="flex flex-col">
                  <span className="font-semibold">Focus Mode</span>
                  <span className="text-xs text-muted-foreground">Boost your concentration</span>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity"/>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <AnimatedQuote />

      <Card data-ai-hint="study books">
        <CardHeader>
          <CardTitle className="font-headline text-primary">Quick Start</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Explore Your Tools:</h3>
            <ul className="list-disc list-inside text-muted-foreground ml-4">
              <li><strong className="text-foreground">Tasks:</strong> Plan your assignments and deadlines.</li>
              <li><strong className="text-foreground">Notes:</strong> Keep your study material organized.</li>
              <li><strong className="text-foreground">Focus Mode:</strong> Minimize distractions with AI assistance.</li>
              <li><strong className="text-foreground">AI Chat:</strong> Click the bot icon in the header for instant help!</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

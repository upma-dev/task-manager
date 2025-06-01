
"use client";

import { FocusModeManager } from '@/components/focus/FocusModeManager';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

export default function FocusPage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center gap-3">
        <Brain className="w-10 h-10 text-primary" />
        <h2 className="text-3xl font-headline font-semibold text-primary">AI Focus Mode</h2>
      </div>
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-headline">Boost Your Concentration</CardTitle>
          <CardDescription>
            Set your study topic, focus duration, and break time. The AI assistant will guide you through Pomodoro sessions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FocusModeManager />
        </CardContent>
      </Card>
       <Card data-ai-hint="zen meditation">
        <CardHeader>
          <CardTitle className="font-headline text-primary">Why Focus Mode?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>The Pomodoro Technique helps you break down work into manageable intervals, separated by short breaks. This method can improve attention span and concentration while preventing burnout.</p>
          <ul className="list-disc list-inside text-muted-foreground ml-4">
            <li>Enhanced focus and concentration</li>
            <li>Increased productivity</li>
            <li>Reduced mental fatigue</li>
            <li>Better time management</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { focusModeAssistant, type FocusModeAssistantInput, type FocusModeAssistantOutput } from '@/ai/flows/focus-mode-assistant';
import { Play, Pause, RotateCcw, Info, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const focusSchema = z.object({
  studyTopic: z.string().min(1, 'Study topic is required'),
  focusDuration: z.number().min(1, 'Focus duration must be at least 1 minute').max(120),
  breakDuration: z.number().min(1, 'Break duration must be at least 1 minute').max(60),
});

type FocusFormData = z.infer<typeof focusSchema>;

type SessionPhase = 'idle' | 'focus' | 'break' | 'ended';

export function FocusModeManager() {
  const { toast } = useToast();
  const [phase, setPhase] = useState<SessionPhase>('idle');
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [totalDuration, setTotalDuration] = useState(0); // in seconds for progress bar
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [currentConfig, setCurrentConfig] = useState<FocusFormData | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext on user interaction (e.g., component mount for simplicity here)
    // A better approach would be to initialize it on the first "Start" click.
    if (typeof window !== 'undefined' && !audioContext) {
       try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(ctx);
      } catch (e) {
        console.warn("Web Audio API is not supported in this browser or failed to initialize.");
      }
    }
    return () => {
      audioContext?.close();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const playSound = useCallback((type: 'focusEnd' | 'breakEnd') => {
    if (isMuted || !audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.05); // Quick fade in
    
    if (type === 'focusEnd') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
    } else { // breakEnd
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(660, audioContext.currentTime); // E5
    }

    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.8); // Fade out
    oscillator.stop(audioContext.currentTime + 0.8);

  }, [isMuted, audioContext]);


  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset: resetForm,
  } = useForm<FocusFormData>({
    resolver: zodResolver(focusSchema),
    defaultValues: { studyTopic: '', focusDuration: 25, breakDuration: 5 },
  });

  const fetchAiUpdate = useCallback(async (input: FocusModeAssistantInput, currentPhase: SessionPhase) => {
    try {
      const output = await focusModeAssistant(input);
      setAiMessage(output.message);
      // The AI's nextAction might not directly map to our phase if we are in the middle of a timer.
      // We use AI messages for guidance. Phase transition is handled by the timer.
    } catch (error) {
      console.error('AI Error:', error);
      setAiMessage('Error fetching guidance from AI.');
    }
  }, []);


  useEffect(() => {
    if (phase === 'idle' || phase === 'ended' || isPaused) return;

    if (timeLeft <= 0) {
      if (phase === 'focus') {
        playSound('focusEnd');
        toast({ title: "Focus Complete!", description: "Time for a break." });
        setPhase('break');
        setTimeLeft(currentConfig!.breakDuration * 60);
        setTotalDuration(currentConfig!.breakDuration * 60);
        if (currentConfig) fetchAiUpdate({ ...currentConfig, focusDuration: currentConfig.focusDuration, breakDuration: currentConfig.breakDuration }, 'break');
      } else if (phase === 'break') {
        playSound('breakEnd');
        toast({ title: "Break Over!", description: "Ready for another focus session?" });
        // For simplicity, one cycle. Could extend to multiple Pomodoros.
        setPhase('ended');
        setAiMessage("Session ended! Great work. Reset to start a new session.");
         if (currentConfig) fetchAiUpdate({ ...currentConfig, focusDuration: currentConfig.focusDuration, breakDuration: currentConfig.breakDuration }, 'ended');
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, timeLeft, isPaused, currentConfig, playSound, toast, fetchAiUpdate]);

  const onSubmit = (data: FocusFormData) => {
    setCurrentConfig(data);
    setPhase('focus');
    setTimeLeft(data.focusDuration * 60);
    setTotalDuration(data.focusDuration * 60);
    setIsPaused(false);
    fetchAiUpdate({ ...data, focusDuration: data.focusDuration, breakDuration: data.breakDuration }, 'focus');
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
     if (currentConfig) fetchAiUpdate({ ...currentConfig, focusDuration: currentConfig.focusDuration, breakDuration: currentConfig.breakDuration }, phase);
  };

  const handleReset = () => {
    setPhase('idle');
    setTimeLeft(0);
    setTotalDuration(0);
    setAiMessage(null);
    setCurrentConfig(null);
    setIsPaused(false);
    resetForm();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressValue = totalDuration > 0 ? ((totalDuration - timeLeft) / totalDuration) * 100 : 0;

  if (phase === 'idle' || phase === 'ended') {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="studyTopic">What are you studying?</Label>
          <Input id="studyTopic" {...register('studyTopic')} placeholder="e.g., Quantum Physics Chapter 3" />
          {errors.studyTopic && <p className="text-sm text-destructive">{errors.studyTopic.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="focusDuration">Focus Duration (minutes)</Label>
            <Controller
              name="focusDuration"
              control={control}
              render={({ field }) => <Input id="focusDuration" type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />}
            />
            {errors.focusDuration && <p className="text-sm text-destructive">{errors.focusDuration.message}</p>}
          </div>
          <div>
            <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
             <Controller
              name="breakDuration"
              control={control}
              render={({ field }) => <Input id="breakDuration" type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />}
            />
            {errors.breakDuration && <p className="text-sm text-destructive">{errors.breakDuration.message}</p>}
          </div>
        </div>
        {phase === 'ended' && aiMessage && (
          <Alert variant="default" className="bg-green-100 dark:bg-green-900 border-green-500">
            <Info className="h-4 w-4 !text-green-700 dark:!text-green-300" />
            <AlertTitle className="text-green-800 dark:text-green-200">Session Complete!</AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300">{aiMessage}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" className="w-full bg-primary hover:bg-primary/80 text-primary-foreground">
          <Play className="mr-2 h-5 w-5" /> Start Focus Session
        </Button>
        {phase === 'ended' && (
          <Button type="button" variant="outline" onClick={handleReset} className="w-full mt-2">
            <RotateCcw className="mr-2 h-5 w-5" /> Reset
          </Button>
        )}
      </form>
    );
  }

  return (
    <div className="space-y-6 text-center">
      <CardTitle className="text-3xl font-bold text-primary font-headline">
        {phase === 'focus' ? `Focus: ${currentConfig?.studyTopic}` : 'Break Time!'}
      </CardTitle>
      <div className="text-7xl font-mono font-bold text-foreground my-8">
        {formatTime(timeLeft)}
      </div>
      <Progress value={progressValue} className="w-full h-4" />
      {aiMessage && (
        <Alert className="text-left">
          <Info className="h-4 w-4" />
          <AlertTitle>AI Assistant</AlertTitle>
          <AlertDescription>{aiMessage}</AlertDescription>
        </Alert>
      )}
      <div className="flex justify-center space-x-4 mt-8">
        <Button onClick={handlePauseResume} variant="secondary" size="lg">
          {isPaused ? <Play className="mr-2 h-5 w-5" /> : <Pause className="mr-2 h-5 w-5" />}
          {isPaused ? 'Resume' : 'Pause'}
        </Button>
        <Button onClick={handleReset} variant="outline" size="lg">
          <RotateCcw className="mr-2 h-5 w-5" /> Reset
        </Button>
         <Button onClick={() => setIsMuted(!isMuted)} variant="ghost" size="icon" title={isMuted ? "Unmute sounds" : "Mute sounds"}>
          {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
}

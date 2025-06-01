'use server';

/**
 * @fileOverview This file defines the focus mode assistant flow, which helps students 
 * block distractions, track focus time, and set break reminders.
 *
 * - focusModeAssistant - A function that initiates and manages the focus mode session.
 * - FocusModeAssistantInput - The input type for the focusModeAssistant function.
 * - FocusModeAssistantOutput - The return type for the focusModeAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FocusModeAssistantInputSchema = z.object({
  studyTopic: z.string().describe('The topic the student is studying.'),
  focusDuration: z.number().describe('The duration of the focus session in minutes.'),
  breakDuration: z.number().describe('The duration of the break in minutes.'),
});
export type FocusModeAssistantInput = z.infer<typeof FocusModeAssistantInputSchema>;

const FocusModeAssistantOutputSchema = z.object({
  message: z.string().describe('A message providing encouragement or a reminder.'),
  nextAction: z
    .enum(['FOCUS', 'BREAK', 'SESSION_END'])
    .describe('The next action the user should take.'),
  timeRemaining: z.number().describe('The time remaining in the current phase (focus or break) in minutes.'),
});
export type FocusModeAssistantOutput = z.infer<typeof FocusModeAssistantOutputSchema>;

export async function focusModeAssistant(input: FocusModeAssistantInput): Promise<FocusModeAssistantOutput> {
  return focusModeAssistantFlow(input);
}

const focusModeAssistantPrompt = ai.definePrompt({
  name: 'focusModeAssistantPrompt',
  input: {schema: FocusModeAssistantInputSchema},
  output: {schema: FocusModeAssistantOutputSchema},
  prompt: `You are a study assistant helping a student stay focused using the Pomodoro technique.

The student is currently studying {{studyTopic}}.

The focus session lasts {{focusDuration}} minutes, and the break lasts {{breakDuration}} minutes.

Based on the current phase (focus or break), provide encouragement, reminders, or instructions.

If the focus session has just started, encourage the student to focus on the material and block distractions.

If the focus session is ongoing, remind the student to stay focused and avoid multitasking.

If the break has just started, encourage the student to relax and take a break from studying.

If the break is ongoing, remind the student to avoid studying during the break.

If the session has ended, congratulate the student on completing the session.

Output a JSON object with the following keys:

- message: A message providing encouragement or a reminder.
- nextAction: The next action the user should take (FOCUS, BREAK, or SESSION_END).
- timeRemaining: The time remaining in the current phase (focus or break) in minutes.`,
});

const focusModeAssistantFlow = ai.defineFlow(
  {
    name: 'focusModeAssistantFlow',
    inputSchema: FocusModeAssistantInputSchema,
    outputSchema: FocusModeAssistantOutputSchema,
  },
  async input => {
    const {output} = await focusModeAssistantPrompt(input);
    return output!;
  }
);

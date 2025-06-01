'use server';

/**
 * @fileOverview Provides study planning tips and productivity advice.
 *
 * - getStudyTips - A function that returns study tips based on user query.
 * - StudyTipsInput - The input type for the getStudyTips function.
 * - StudyTipsOutput - The return type for the getStudyTips function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudyTipsInputSchema = z.object({
  query: z
    .string()
    .describe('The query from the user asking for study tips or productivity advice.'),
});
export type StudyTipsInput = z.infer<typeof StudyTipsInputSchema>;

const StudyTipsOutputSchema = z.object({
  tips: z.string().describe('Study tips and productivity advice based on the user query.'),
});
export type StudyTipsOutput = z.infer<typeof StudyTipsOutputSchema>;

export async function getStudyTips(input: StudyTipsInput): Promise<StudyTipsOutput> {
  return studyTipsFlow(input);
}

const studyTipsPrompt = ai.definePrompt({
  name: 'studyTipsPrompt',
  input: {schema: StudyTipsInputSchema},
  output: {schema: StudyTipsOutputSchema},
  prompt: `You are a study coach providing study tips and productivity advice to students.
  Based on the user's query, provide relevant and helpful advice.

  Query: {{{query}}}
  `,
});

const studyTipsFlow = ai.defineFlow(
  {
    name: 'studyTipsFlow',
    inputSchema: StudyTipsInputSchema,
    outputSchema: StudyTipsOutputSchema,
  },
  async input => {
    const {output} = await studyTipsPrompt(input);
    return output!;
  }
);

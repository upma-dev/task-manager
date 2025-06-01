'use server';

/**
 * @fileOverview AI chatbot flow that answers basic questions about academic topics.
 *
 * - askAIChatbotAcademicQuestions - A function that handles the question answering process.
 * - AskAIChatbotAcademicQuestionsInput - The input type for the askAIChatbotAcademicQuestions function.
 * - AskAIChatbotAcademicQuestionsOutput - The return type for the askAIChatbotAcademicQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AskAIChatbotAcademicQuestionsInputSchema = z.object({
  question: z.string().describe('The academic question to be answered.'),
});
export type AskAIChatbotAcademicQuestionsInput = z.infer<typeof AskAIChatbotAcademicQuestionsInputSchema>;

const AskAIChatbotAcademicQuestionsOutputSchema = z.object({
  answer: z.string().describe('The answer to the academic question.'),
});
export type AskAIChatbotAcademicQuestionsOutput = z.infer<typeof AskAIChatbotAcademicQuestionsOutputSchema>;

export async function askAIChatbotAcademicQuestions(input: AskAIChatbotAcademicQuestionsInput): Promise<AskAIChatbotAcademicQuestionsOutput> {
  return askAIChatbotAcademicQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'askAIChatbotAcademicQuestionsPrompt',
  input: {schema: AskAIChatbotAcademicQuestionsInputSchema},
  output: {schema: AskAIChatbotAcademicQuestionsOutputSchema},
  prompt: `You are a helpful AI assistant that answers questions about academic topics.

  Question: {{{question}}}
  Answer: `,
});

const askAIChatbotAcademicQuestionsFlow = ai.defineFlow(
  {
    name: 'askAIChatbotAcademicQuestionsFlow',
    inputSchema: AskAIChatbotAcademicQuestionsInputSchema,
    outputSchema: AskAIChatbotAcademicQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

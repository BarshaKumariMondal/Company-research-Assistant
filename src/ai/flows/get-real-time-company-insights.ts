'use server';
/**
 * @fileOverview An AI agent that provides real-time company insights based on user questions.
 *
 * - getRealTimeCompanyInsights - A function that handles the retrieval of real-time company insights.
 * - GetRealTimeCompanyInsightsInput - The input type for the getRealTimeCompanyInsights function.
 * - GetRealTimeCompanyInsightsOutput - The return type for the getRealTimeCompanyInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetRealTimeCompanyInsightsInputSchema = z.object({
  companyName: z.string().describe('The name of the company to research.'),
  question: z.string().describe('The question about the company.'),
});
export type GetRealTimeCompanyInsightsInput = z.infer<typeof GetRealTimeCompanyInsightsInputSchema>;

const GetRealTimeCompanyInsightsOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about the company.'),
});
export type GetRealTimeCompanyInsightsOutput = z.infer<typeof GetRealTimeCompanyInsightsOutputSchema>;

export async function getRealTimeCompanyInsights(
  input: GetRealTimeCompanyInsightsInput
): Promise<GetRealTimeCompanyInsightsOutput> {
  return getRealTimeCompanyInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getRealTimeCompanyInsightsPrompt',
  input: {schema: GetRealTimeCompanyInsightsInputSchema},
  output: {schema: GetRealTimeCompanyInsightsOutputSchema},
  prompt: `You are an AI assistant that provides real-time data and insights about companies.

  You will be given a company name and a question about the company.
  You will use your knowledge and any available tools to answer the question as accurately and completely as possible.

  Company Name: {{{companyName}}}
  Question: {{{question}}}

  Answer:`, // Removed unnecessary triple curly braces
});

const getRealTimeCompanyInsightsFlow = ai.defineFlow(
  {
    name: 'getRealTimeCompanyInsightsFlow',
    inputSchema: GetRealTimeCompanyInsightsInputSchema,
    outputSchema: GetRealTimeCompanyInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

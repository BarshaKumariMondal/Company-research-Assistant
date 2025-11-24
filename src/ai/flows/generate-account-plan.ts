'use server';

/**
 * @fileOverview A flow to generate a structured account plan based on user research and conversation.
 *
 * - generateAccountPlan - A function that generates the account plan.
 * - GenerateAccountPlanInput - The input type for the generateAccountPlan function.
 * - GenerateAccountPlanOutput - The return type for the generateAccountPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAccountPlanInputSchema = z.object({
  companyName: z.string().describe('The name of the company to generate an account plan for.'),
  researchSummary: z.string().describe('A summary of research and conversation about the company.'),
});
export type GenerateAccountPlanInput = z.infer<typeof GenerateAccountPlanInputSchema>;

const GenerateAccountPlanOutputSchema = z.object({
  accountPlan: z.string().describe('The generated account plan for the company.'),
});
export type GenerateAccountPlanOutput = z.infer<typeof GenerateAccountPlanOutputSchema>;

export async function generateAccountPlan(input: GenerateAccountPlanInput): Promise<GenerateAccountPlanOutput> {
  return generateAccountPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAccountPlanPrompt',
  input: {schema: GenerateAccountPlanInputSchema},
  output: {schema: GenerateAccountPlanOutputSchema},
  prompt: `You are an AI assistant that helps generate account plans for companies.

  Based on the following company name and research summary, generate a structured account plan.

  Company Name: {{{companyName}}}
  Research Summary: {{{researchSummary}}}

  The account plan should include the following sections:
  1. Executive Summary
  2. Company Overview
  3. Key Challenges and Opportunities
  4. Strategic Recommendations
  5. Action Plan
  6. Financial Projections

  Please provide a detailed and well-structured account plan.
  `,
});

const generateAccountPlanFlow = ai.defineFlow(
  {
    name: 'generateAccountPlanFlow',
    inputSchema: GenerateAccountPlanInputSchema,
    outputSchema: GenerateAccountPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

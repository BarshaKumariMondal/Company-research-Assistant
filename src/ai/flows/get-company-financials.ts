'use server';

/**
 * @fileOverview An AI agent that provides real-time company financial data.
 *
 * - getCompanyFinancials - A function that handles the retrieval of real-time company financial data.
 * - GetCompanyFinancialsInput - The input type for the getCompanyFinancials function.
 * - GetCompanyFinancialsOutput - The return type for the getCompanyFinancials function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetCompanyFinancialsInputSchema = z.object({
  companyName: z.string().describe('The name of the company to research.'),
});
export type GetCompanyFinancialsInput = z.infer<typeof GetCompanyFinancialsInputSchema>;

const FinancialDataPointSchema = z.object({
    month: z.string().describe('The month for the data point (e.g., "Jan", "Feb").'),
    revenue: z.number().describe('The revenue in millions for that month.'),
    profit: z.number().describe('The profit in millions for that month.'),
});

const GetCompanyFinancialsOutputSchema = z.object({
  financials: z.array(FinancialDataPointSchema).describe('An array of financial data for the last 6 months.'),
});
export type GetCompanyFinancialsOutput = z.infer<typeof GetCompanyFinancialsOutputSchema>;

export async function getCompanyFinancials(
  input: GetCompanyFinancialsInput
): Promise<GetCompanyFinancialsOutput> {
  return getCompanyFinancialsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getCompanyFinancialsPrompt',
  input: {schema: GetCompanyFinancialsInputSchema},
  output: {schema: GetCompanyFinancialsOutputSchema},
  prompt: `You are an AI assistant that provides real-time financial data about companies.

  You will be given a company name. You need to provide the revenue and profit for the last 6 months.

  Company Name: {{{companyName}}}

  Provide the data in millions.
  `,
});

const getCompanyFinancialsFlow = ai.defineFlow(
  {
    name: 'getCompanyFinancialsFlow',
    inputSchema: GetCompanyFinancialsInputSchema,
    outputSchema: GetCompanyFinancialsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

'use server';

/**
 * @fileOverview An AI agent that provides real-time company metrics.
 *
 * - getCompanyMetrics - A function that handles the retrieval of real-time company metrics.
 * - GetCompanyMetricsInput - The input type for the getCompanyMetrics function.
 * - GetCompanyMetricsOutput - The return type for the getCompanyMetrics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetCompanyMetricsInputSchema = z.object({
  companyName: z.string().describe('The name of the company to research.'),
});
export type GetCompanyMetricsInput = z.infer<typeof GetCompanyMetricsInputSchema>;


const MarketShareDataPointSchema = z.object({
    name: z.string().describe('The name of the company or "Others".'),
    value: z.number().describe('The market share percentage.'),
});

const EmployeeDataPointSchema = z.object({
    year: z.string().describe('The year for the data point.'),
    count: z.number().describe('The number of employees.'),
});

const GetCompanyMetricsOutputSchema = z.object({
  marketShare: z.array(MarketShareDataPointSchema).describe('An array of market share data.'),
  employeeGrowth: z.array(EmployeeDataPointSchema).describe('An array of employee headcount for the last 5 years.'),
});
export type GetCompanyMetricsOutput = z.infer<typeof GetCompanyMetricsOutputSchema>;

export async function getCompanyMetrics(
  input: GetCompanyMetricsInput
): Promise<GetCompanyMetricsOutput> {
  return getCompanyMetricsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getCompanyMetricsPrompt',
  input: {schema: GetCompanyMetricsInputSchema},
  output: {schema: GetCompanyMetricsOutputSchema},
  prompt: `You are an AI assistant that provides real-time metrics about companies.

  You will be given a company name. You need to provide:
  1. The current market share distribution, including the company, its top 2 competitors, and "Others".
  2. The employee headcount for the past 5 years.

  Company Name: {{{companyName}}}
  `,
});

const getCompanyMetricsFlow = ai.defineFlow(
  {
    name: 'getCompanyMetricsFlow',
    inputSchema: GetCompanyMetricsInputSchema,
    outputSchema: GetCompanyMetricsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

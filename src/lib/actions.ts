'use server';

import { generateAccountPlan } from '@/ai/flows/generate-account-plan';
import { getRealTimeCompanyInsights } from '@/ai/flows/get-real-time-company-insights';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const insightSchema = z.object({
  companyName: z.string().min(1, 'Company name is required.'),
  question: z.string().min(1, 'Question is required.'),
});

// This state is designed to be used with useFormState
// It allows returning data and errors from server actions
type FormState = {
  answer?: string | null;
  error?: string | null;
  accountPlan?: string | null;
  planError?: string | null;
}

export async function handleCompanyQuery(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    const validatedFields = insightSchema.safeParse({
      companyName: formData.get('companyName'),
      question: formData.get('question'),
    });

    if (!validatedFields.success) {
      return {
        error: 'Invalid input. Please provide both company name and a question.',
      };
    }

    const { companyName, question } = validatedFields.data;
    const { answer } = await getRealTimeCompanyInsights({ companyName, question });

    revalidatePath('/dashboard');
    return { answer };
  } catch (error) {
    console.error(error);
    return {
      error: 'Failed to get insights. Please try again.',
    };
  }
}

const planSchema = z.object({
    companyName: z.string().min(1, 'Company name is required.'),
    researchSummary: z.string().min(1, 'Research summary is required.'),
});

export async function handleGeneratePlan(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const validatedFields = planSchema.safeParse({
            companyName: formData.get('companyName'),
            researchSummary: formData.get('researchSummary'),
        });

        if (!validatedFields.success) {
            return {
                planError: 'Invalid input for generating plan.',
            };
        }

        const { companyName, researchSummary } = validatedFields.data;
        const { accountPlan } = await generateAccountPlan({ companyName, researchSummary });
        
        revalidatePath('/dashboard');
        return { accountPlan };
    } catch (error) {
        console.error(error);
        return {
            planError: 'Failed to generate account plan. Please try again.',
        };
    }
}

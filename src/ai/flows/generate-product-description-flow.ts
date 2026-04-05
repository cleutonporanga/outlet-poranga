'use server';
/**
 * @fileOverview A Genkit flow for generating attractive and detailed product descriptions using AI.
 *
 * - generateProductDescription - A function that handles the product description generation process.
 * - GenerateProductDescriptionInput - The input type for the generateProductDescription function.
 * - GenerateProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductDescriptionInputSchema = z.object({
  name: z.string().describe('The name of the product.'),
  category: z.string().describe('The category of the product (e.g., T-shirt, Dress, Jeans).'),
  size: z.string().optional().describe('The size of the product (e.g., S, M, L, XL).'),
  color: z.string().optional().describe('The color of the product (e.g., Blue, Red, Green).'),
});
export type GenerateProductDescriptionInput = z.infer<typeof GenerateProductDescriptionInputSchema>;

const GenerateProductDescriptionOutputSchema = z.object({
  description: z.string().describe('An attractive and detailed product description.'),
});
export type GenerateProductDescriptionOutput = z.infer<typeof GenerateProductDescriptionOutputSchema>;

export async function generateProductDescription(
  input: GenerateProductDescriptionInput
): Promise<GenerateProductDescriptionOutput> {
  return generateProductDescriptionFlow(input);
}

const productDescriptionPrompt = ai.definePrompt({
  name: 'productDescriptionPrompt',
  input: {schema: GenerateProductDescriptionInputSchema},
  output: {schema: GenerateProductDescriptionOutputSchema},
  prompt: `You are an AI assistant specialized in writing attractive and detailed product descriptions for a clothing store. Your goal is to create compelling copy that highlights the product's features and appeals to customers.

Generate a description for the following product, focusing on its name, category, and optionally its size and color. Make it engaging, descriptive, and concise. Highlight its unique qualities and potential use cases.

Product Details:
Name: {{{name}}}
Category: {{{category}}}
{{#if size}}Size: {{{size}}}{{/if}}
{{#if color}}Color: {{{color}}}{{/if}}

Generate the description in a professional and modern tone.`,
});

const generateProductDescriptionFlow = ai.defineFlow(
  {
    name: 'generateProductDescriptionFlow',
    inputSchema: GenerateProductDescriptionInputSchema,
    outputSchema: GenerateProductDescriptionOutputSchema,
  },
  async input => {
    const {output} = await productDescriptionPrompt(input);
    return output!;
  }
);

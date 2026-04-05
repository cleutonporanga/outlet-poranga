'use server';
/**
 * @fileOverview A Genkit flow for generating attractive and detailed product descriptions using AI, now supporting visual analysis.
 *
 * - generateProductDescription - A function that handles the product description generation process.
 * - GenerateProductDescriptionInput - The input type for the generateProductDescription function.
 * - GenerateProductDescriptionOutput - The return type for the generateProductDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateProductDescriptionInputSchema = z.object({
  name: z.string().optional().describe('The name of the product if known.'),
  category: z.string().optional().describe('The category of the product if known.'),
  size: z.string().optional().describe('The size of the product.'),
  color: z.string().optional().describe('The color of the product.'),
  photoDataUri: z.string().optional().describe("A photo of the product, as a data URI. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateProductDescriptionInput = z.infer<typeof GenerateProductDescriptionInputSchema>;

const GenerateProductDescriptionOutputSchema = z.object({
  description: z.string().describe('An attractive and detailed product description.'),
  suggestedName: z.string().optional().describe('A suggested creative name for the product based on the photo.'),
  suggestedCategory: z.string().optional().describe('A suggested category based on the photo.'),
  suggestedColor: z.string().optional().describe('A suggested color based on the photo.'),
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
  prompt: `You are an AI assistant specialized in writing attractive and detailed product descriptions for a clothing store.

If a photo is provided, analyze it carefully to identify the item's style, material, pattern, and unique details.

Generate a compelling description. If a photo is provided but name/category are missing, suggest appropriate values for them in the output.

Product Details:
{{#if name}}Name: {{{name}}}{{/if}}
{{#if category}}Category: {{{category}}}{{/if}}
{{#if size}}Size: {{{size}}}{{/if}}
{{#if color}}Color: {{{color}}}{{/if}}
{{#if photoDataUri}}Photo: {{media url=photoDataUri}}{{/if}}

Tone: Professional, modern, and fashion-forward. Language: Portuguese (pt-BR).`,
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

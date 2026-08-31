/**
 * AI Model and System Configuration Module (FE-06)
 * Centralizes prompt engineering, model parameters, and runtime constraints.
 */

export const AI_CONFIG = {
  // Model selection
  model: "claude-3-5-sonnet-latest",
  
  // Runtime sampling parameters
  temperature: 0.7,
  maxTokens: 1500,

  // Base System Prompt
  systemPrompt: `You are an expert AI Frontend Engineering Assistant. 
You provide concise, deterministic, and accessible code solutions using Next.js, React, TypeScript, and Tailwind CSS.
Focus on W3C accessibility, performance, clean typing without 'any', and production engineering best practices.`,
};
export const EngineContext = {
  JOB: "job",
  MARKETPLACE: "marketplace",
  COMPARISON: "comparison",
} as const;

export type EngineContext =
  (typeof EngineContext)[keyof typeof EngineContext];

export const EngineModeId = {
  JOB_APPLICATION: "jobApplication",
  MARKETPLACE: "marketplace",
  JOB_COMPARISON: "jobComparison",
} as const;

export type EngineModeId =
  (typeof EngineModeId)[keyof typeof EngineModeId];

export const Tone = {
  PROFESSIONAL: "professional",
  FRIENDLY: "friendly",
  FORMAL: "formal",
  BOLD: "bold",
} as const;

export type Tone = (typeof Tone)[keyof typeof Tone];

export const Audience = {
  RECRUITERS: "recruiters",
  BUYERS: "buyers",
  GENERAL: "general",
} as const;

export type Audience = (typeof Audience)[keyof typeof Audience];

export const Provider = {
  GEMINI: "gemini",
  OPENAI: "openai",
  GROQ: "groq"
} as const;

export type Provider = (typeof Provider)[keyof typeof Provider];

export interface EngineConstraints {
  language?: string
  maxLength?: number
  platform?: string
}

export interface EngineInput<TContent> {
  context: EngineContext
  tone: Tone
  audience: Audience
  constraints?: EngineConstraints
  content: TContent
}


export interface EngineOutput {
  body: string;
  sections: Record<string, string>;
  analysis?: {
      score: number;
      critique: string;
      suggestions: string[];
  };
  meta?: {
    mode: EngineContext;
    tone?: Tone;
  };
}

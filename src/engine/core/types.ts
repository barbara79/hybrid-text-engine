export const EngineContext = {
  JOB: "job",
  MARKETPLACE: "marketplace",
} as const;

export type EngineContext =
  (typeof EngineContext)[keyof typeof EngineContext];

export const Tone = {
  PROFESSIONAL: "professional",
  FRIENDLY: "friendly",
  FORMAL: "formal",
  BOLD: "bold",
} as const;

export type Tone = (typeof Tone)[keyof typeof Tone];

export interface EngineConstraints {
  language?: string
  maxLength?: number
  platform?: string
}

export interface EngineInput<TContent> {
  context: EngineContext
  tone: Tone
  audience: string
  constraints?: EngineConstraints
  content: TContent
}


export interface EngineOutput {
  body: string;
  sections: Record<string, string>
  meta?: {
    mode: EngineContext
    tone?: Tone
  }
}




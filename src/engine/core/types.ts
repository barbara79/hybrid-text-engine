export type EngineContext = "job" | "marketplace"

export type Tone =
  | "professional"
  | "friendly"
  | "formal"
  | "bold"

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
  title?: string
  body: string
  meta?: Record<string, string>
}

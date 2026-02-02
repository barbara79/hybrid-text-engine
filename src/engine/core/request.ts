import { JobApplicationContent, MarketplaceContent } from "./content";
import { EngineInput, Tone } from "./types";

export type JobApplicationRequest = {
  mode: "jobApplication"
  context: "job"
  tone: Tone
  audience: string
  content: JobApplicationContent
}

export type MarketplaceRequest = {
  mode: "marketplace"
  context: "marketplace"
  tone: Tone
  audience: string
  content: MarketplaceContent
}

export type EngineRequest =
  | (EngineInput<JobApplicationContent> & { mode: "jobApplication" })
  | (EngineInput<MarketplaceContent> & { mode: "marketplace" });


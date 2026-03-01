import { JobApplicationContent, ComparisonContent, MarketplaceContent } from "./content";
import { Audience,  EngineContext,  EngineModeId, Provider, Tone } from "./types";

type BaseRequest = {
  provider: Provider;
  tone: Tone;
  audience: Audience;
};

export type JobApplicationRequest = BaseRequest & {
  mode: typeof EngineModeId.JOB_APPLICATION;
  context: typeof EngineContext.JOB;
  tone: Tone
  audience: Audience
  content: JobApplicationContent
}

export type MarketplaceRequest = BaseRequest & {
  mode: typeof EngineModeId.MARKETPLACE;
  context: typeof EngineContext.MARKETPLACE;
  tone: Tone;
  audience: Audience;
  content: MarketplaceContent
}

export type JobComparisonRequest = BaseRequest & {
  mode: typeof EngineModeId.JOB_COMPARISON;
  context: typeof EngineContext.COMPARISON;
  tone: Tone;
  audience: Audience;
  content: ComparisonContent;
};

export type EngineRequest = 
  | JobApplicationRequest 
  | MarketplaceRequest 
  | JobComparisonRequest;


import { JobApplicationContent, MarketplaceContent } from "./content";
import { Tone } from "./types";

export type EngineRequest =
  | {
      mode: "jobApplication";
      context: "job";
      tone: Tone;
      audience: string;
      content: JobApplicationContent;
    }
  | {
      mode: "marketplace";
      context: "marketplace";
      tone: Tone;
      audience: string;
      content: MarketplaceContent;
    };


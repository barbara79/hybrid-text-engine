import { EngineModeId } from "./types";
import { jobApplicationMode } from "../modes/jobApplication";
import { marketplaceMode } from "../modes/marketplace";
import { EngineMode } from "./mode";
import { jobComparisonMode } from "../modes/jobComparison";
import { JobApplicationContent, ComparisonContent, MarketplaceContent } from "./content";

interface ModeContentMap {
  jobApplication: JobApplicationContent;
  marketplace: MarketplaceContent;
  jobComparison: ComparisonContent;
}

export const MODE_REGISTRY: { [K in EngineModeId]: EngineMode<ModeContentMap[K]> } = {
  jobApplication: jobApplicationMode,
  marketplace: marketplaceMode,
  jobComparison: jobComparisonMode,
};
import { EngineModeId } from "./types";
import { jobApplicationMode } from "../modes/jobApplication";
import { marketplaceMode } from "../modes/marketplace";
import { EngineMode } from "./mode";
import { jobComparisonMode } from "../modes/jobComparison";

export const MODE_REGISTRY: Record<EngineModeId, EngineMode<any>> = {
  jobApplication: jobApplicationMode,
  marketplace: marketplaceMode,
  jobComparison: jobComparisonMode,
};
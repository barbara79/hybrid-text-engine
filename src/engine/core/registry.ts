import { EngineModeId } from "./types";
import { jobApplicationMode } from "../modes/jobApplication";
import { marketplaceMode } from "../modes/marketplace";
import { comparisonMode } from "../modes/comparison";
import { EngineMode } from "./mode";

export const MODE_REGISTRY: Record<EngineModeId, EngineMode<any>> = {
  jobApplication: jobApplicationMode,
  marketplace: marketplaceMode,
  comparison: comparisonMode,
};
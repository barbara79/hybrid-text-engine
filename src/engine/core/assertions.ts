// engine/core/assertions.ts
import { EngineContext } from "./types";

export function assertContextMatch(
  modeId: EngineContext,
  inputContext: EngineContext
) {
  if (modeId !== inputContext) {
    throw new Error(
      `Engine context mismatch: mode '${modeId}' cannot handle context '${inputContext}'`
    );
  }
}

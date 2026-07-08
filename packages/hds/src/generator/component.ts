import { componentRoot } from "./paths.js";
import type {
  ComponentOptions,
  GeneratorResult
} from "./types.js";

export function generateComponent(
  options: ComponentOptions
): GeneratorResult {

  const target = componentRoot(options.name);

  return {
    success: true,
    component: options.name,
    target
  };
}
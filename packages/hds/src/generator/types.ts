export interface GeneratorContext {
  cwd: string;
  workspaceRoot: string;
}

export interface ComponentOptions {
  name: string;
}

export interface GeneratorResult {
  success: boolean;
  component: string;
  target: string;
}
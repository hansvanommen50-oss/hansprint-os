export interface HeroModel {
  title: string;
  subtitle?: string;
}

export function createHero(model: HeroModel): HeroModel {
  return model;
}

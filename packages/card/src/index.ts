export interface CardModel {
  title: string;
  content?: string;
}

export function createCard(model: CardModel): CardModel {
  return model;
}

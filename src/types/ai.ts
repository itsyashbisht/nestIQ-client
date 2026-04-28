export interface IBudgetPlan {
  hotelBudget: number;
  foodBudget: number;
  travelBudget: number;
  totalEstimate: number;
  nights: number;
  tips: string[];
}

export interface IReviewSummary {
  pros: string[];
  cons: string[];
  topHighlight: string;
  overallSentiment: 'positive' | 'mixed' | 'negative';
}

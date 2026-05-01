import REQUEST from "@/lib/axios";
import ROUTES from "../constants/routes.json";

export const aiService = {
  // Natural language search parser
  searchHotels(query: string) {
    return REQUEST.post(ROUTES.HOTEL.SEARCH, { query });
  },

  // Budget planner
  getBudgetPlan(payload: {
    city: string;
    nights: number;
    guests: number;
    pricePerNight: number;
    roomType: string;
  }) {
    return REQUEST.post(ROUTES.AI.BUDGET, payload);
  },

  // Review summarizer
  getReviewSummary(hotelId: string) {
    return REQUEST.post(ROUTES.AI.REVIEW_SUMMARY, { hotelId });
  },

  // AI listing creator for owners
  generateListing(description: string) {
    return REQUEST.post(ROUTES.AI.LISTING, { description });
  },
};

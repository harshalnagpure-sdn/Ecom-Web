import { apiClient } from "../client";
import { ENDPOINTS } from "../endpoints";

export const aiStylistService = {
  async getQuiz() {
    const response = await apiClient.get(ENDPOINTS.AI_STYLIST.QUIZ);
    return response.data;
  },

  async submitQuiz(payload) {
    const response = await apiClient.post(ENDPOINTS.AI_STYLIST.QUIZ, payload);
    return response.data;
  },

  async getRecommendations(payload) {
    const response = await apiClient.post(ENDPOINTS.AI_STYLIST.RECOMMENDATIONS, payload);
    return response.data;
  },
};



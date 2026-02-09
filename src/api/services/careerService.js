import { apiClient } from "../client";
import { ENDPOINTS } from "../endpoints";

export const careerService = {
  submitApplication: async (formData) => {
    const response = await apiClient.post(
      ENDPOINTS.CAREERS.APPLY,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};

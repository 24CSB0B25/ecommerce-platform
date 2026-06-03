import axios from "axios";

const API_URL =
  "https://ecommerce-platform-backend-eksr.onrender.com/api/admin";

export const getDashboardStats =
  async (token) => {
    const { data } =
      await axios.get(
        `${API_URL}/stats`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return data;
  };
import axios from "axios";

const API_URL =
  `${import.meta.env.VITE_API_URL}/admin`;

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
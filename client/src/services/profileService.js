import axios from "axios";

const API_URL =
  `${import.meta.env.VITE_API_URL}/auth/profile`;

export const getProfile =
  async (token) => {
    const { data } =
      await axios.get(
        API_URL,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return data;
  };

export const updateProfile =
  async (
    profileData,
    token
  ) => {
    const { data } =
      await axios.put(
        API_URL,
        profileData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return data;
  };

export const changePassword =
    async (
        passwordData,
        token
    ) => {
        const { data } =
        await axios.put(
            `${import.meta.env.VITE_API_URL}/auth/change-password`,
            passwordData,
            {
            headers: {
                Authorization:
                `Bearer ${token}`,
            },
            }
        );

    return data;
};
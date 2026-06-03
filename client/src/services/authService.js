import axios from "axios";

const API_URL =
  "https://ecommerce-platform-backend-eksr.onrender.com/api/auth";

export const loginUser = async (
  email,
  password
) => {
  const { data } =
    await axios.post(
      `${API_URL}/login`,
      {
        email,
        password,
      }
    );

  return data;
};

export const registerUser = async (
  name,
  email,
  password
) => {
  const { data } = await axios.post(
    "https://ecommerce-platform-backend-eksr.onrender.com/api/auth/register",
    {
      name,
      email,
      password,
    }
  );

  return data;
};
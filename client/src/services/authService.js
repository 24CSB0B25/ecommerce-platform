import axios from "axios";

const API_URL =
  "http://localhost:5000/api/auth";

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
    "http://localhost:5000/api/auth/register",
    {
      name,
      email,
      password,
    }
  );

  return data;
};
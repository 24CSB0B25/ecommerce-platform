import axios from "axios";

export const getProductById = async (id) => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_API_URL}/products/${id}`
  );

  return data;
};
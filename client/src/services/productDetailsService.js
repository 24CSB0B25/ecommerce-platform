import axios from "axios";

export const getProductById = async (id) => {
  const { data } = await axios.get(
    `https://ecommerce-platform-backend-eksr.onrender.com/api/products/${id}`
  );

  return data;
};
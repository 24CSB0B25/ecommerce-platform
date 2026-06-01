import axios from "axios";

export const getProductById = async (id) => {
  const { data } = await axios.get(
    `http://localhost:5000/api/products/${id}`
  );

  return data;
};
import axios from "axios";

const API_URL =
  `${import.meta.env.VITE_API_URL}/cart`;

  
export const addToCart = async (
  productId,
  quantity,
  token
) => {
  const { data } = await axios.post(
    API_URL,
    {
      productId,
      quantity,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

export const getCart = async (
  token
) => {
  const { data } = await axios.get(
    `${API_URL}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

export const removeCartItem = async (
  cartId,
  token
) => {
  const { data } = await axios.delete(
    `${API_URL}/${cartId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

export const updateCartItem = async (
  cartId,
  quantity,
  token
) => {
  const { data } = await axios.put(
    `${API_URL}/${cartId}`,
    { quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};
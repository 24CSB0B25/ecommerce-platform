import axios from "axios";

const API_URL =
  "http://localhost:5000/api/cart";

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
    "http://localhost:5000/api/cart",
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
    `http://localhost:5000/api/cart/${cartId}`,
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
    `http://localhost:5000/api/cart/${cartId}`,
    { quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};
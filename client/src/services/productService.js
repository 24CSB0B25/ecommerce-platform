import axios from "axios";

const API_URL =
  "https://ecommerce-platform-backend-eksr.onrender.com/api/products";

export const getProducts = async (
  keyword = "",
  category = "",
  sort = "",
  page = 1
) => {
  const { data } = await axios.get(
    `${API_URL}?keyword=${keyword}&category=${category}&sort=${sort}&page=${page}`
  );

  return data;
};

export const deleteProduct = async (
  id,
  token
) => {
  const { data } = await axios.delete(
    `${API_URL}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

export const createProduct = async (
  product,
  token
) => {
  const { data } = await axios.post(
    API_URL,
    product,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

export const getProductById = async (
  id
) => {
  const { data } =
    await axios.get(
      `${API_URL}/${id}`
    );

  return data;
};

export const updateProduct = async (
  id,
  product,
  token
) => {
  const { data } =
    await axios.put(
      `${API_URL}/${id}`,
      product,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return data;
};

export const getAllProducts =
  async (token) => {
    const { data } =
      await axios.get(
        "https://ecommerce-platform-backend-eksr.onrender.com/api/products/admin/all",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return data;
};
export const createReview = async (
  productId,
  reviewData,
  token
) => {
  const { data } = await axios.post(
    `https://ecommerce-platform-backend-eksr.onrender.com/api/products/${productId}/reviews`,
    reviewData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

export const getSuggestions =
  async (keyword) => {
    const { data } =
      await axios.get(
        `https://ecommerce-platform-backend-eksr.onrender.com/api/products/suggestions?keyword=${keyword}`
      );

    return data;
};
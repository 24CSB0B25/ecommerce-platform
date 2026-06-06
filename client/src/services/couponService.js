import axios from "axios";

const API_URL =
  `${import.meta.env.VITE_API_URL}/coupons`;

export const getCoupons =
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

export const createCoupon =
  async (
    couponData,
    token
  ) => {
    const { data } =
      await axios.post(
        API_URL,
        couponData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return data;
};

export const deleteCoupon =
  async (id, token) => {
    const { data } =
      await axios.delete(
        `${API_URL}/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return data;
};

export const toggleCoupon =
  async (id, token) => {
    const { data } =
      await axios.put(
        `${API_URL}/${id}/toggle`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return data;
};

export const applyCoupon =
  async (
    code,
    cartTotal
  ) => {
    const { data } =
      await axios.post(        `${import.meta.env.VITE_API_URL}/coupons/apply`,
        {
          code,
          cartTotal,
        }
      );

    return data;
};
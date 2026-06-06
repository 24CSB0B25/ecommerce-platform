import axios from "axios";

const API_URL =
  `${import.meta.env.VITE_API_URL}/orders`;

export const createOrder = async (
  orderData,
  token
) => {
  const { data } = await axios.post(
    API_URL,
    orderData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

export const createBuyNowOrder =
  async (
    productId,
    quantity,
    couponCode,
    shippingAddress,
    token
  ) => {
    const { data } =
      await axios.post(
        `${API_URL}/buynow`,
        {
          productId,
          quantity,
          couponCode,
          shippingAddress,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return data;
};

export const getMyOrders = async (
  token
) => {
  const { data } = await axios.get(
    `${API_URL}/myorders`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

export const getAllOrders = async (
  token
) => {
  const { data } =
    await axios.get(
      `${API_URL}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return data;
};

export const markDelivered =
  async (id, token) => {
    const { data } =
      await axios.put(
        `${API_URL}/${id}/deliver`,
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

export const createRazorpayOrder =
  async (orderId, token) => {
    const { data } =
      await axios.post(
        `${API_URL}/${orderId}/razorpay-order`,
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

export const verifyPayment =
  async (
    orderId,
    paymentData,
    token
  ) => {
    const { data } =
      await axios.post(
        `${API_URL}/${orderId}/verify-payment`,
        paymentData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return data;
  };

  export const downloadInvoice =
  async (id, token) => {
    const response =
      await axios.get(
        `${API_URL}/${id}/invoice`,
        {
          responseType:
            "blob",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return response.data;
};

export const updateOrderStatus =
  async (
    id,
    status,
    token
  ) => {
    const { data } =
      await axios.put(
        `${API_URL}/${id}/status`,
        { status },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return data;
};
import axios from "axios";

const API_URL =
  "https://ecommerce-platform-backend-eksr.onrender.com/api/orders";


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

export const getMyOrders = async (
  token
) => {
  const { data } = await axios.get(
    "https://ecommerce-platform-backend-eksr.onrender.com/api/orders/myorders",
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
      "https://ecommerce-platform-backend-eksr.onrender.com/api/orders",
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
        `https://ecommerce-platform-backend-eksr.onrender.com/api/orders/${id}/deliver`,
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
        `https://ecommerce-platform-backend-eksr.onrender.com/api/orders/${id}/invoice`,
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
import axios from "axios";

export const getWishlist = async (
    token
    ) => {
    const { data } = await axios.get(
        "https://ecommerce-platform-backend-eksr.onrender.com/api/wishlist",
        {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        }
    );

    return data;
};

export const addToWishlist = async (
    productId,
    token
    ) => {
    const { data } = await axios.post(
        `https://ecommerce-platform-backend-eksr.onrender.com/api/wishlist/${productId}`,
        {},
        {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        }
    );

    return data;
};

export const removeFromWishlist =
    async (
        productId,
        token
    ) => {
        const { data } =
        await axios.delete(
            `https://ecommerce-platform-backend-eksr.onrender.com/api/wishlist/${productId}`,
            {
            headers: {
                Authorization:
                `Bearer ${token}`,
            },
            }
        );

        return data;
};
import axios from "axios";

export const getWishlist = async (
    token
    ) => {
    const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/wishlist`,
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
        `${import.meta.env.VITE_API_URL}/wishlist/${productId}`,
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
            `${import.meta.env.VITE_API_URL}/wishlist/${productId}`,
            {
            headers: {
                Authorization:
                `Bearer ${token}`,
            },
            }
        );

        return data;
};
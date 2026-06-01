import axios from "axios";

export const getWishlist = async (
    token
    ) => {
    const { data } = await axios.get(
        "http://localhost:5000/api/wishlist",
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
        `http://localhost:5000/api/wishlist/${productId}`,
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
            `http://localhost:5000/api/wishlist/${productId}`,
            {
            headers: {
                Authorization:
                `Bearer ${token}`,
            },
            }
        );

        return data;
};
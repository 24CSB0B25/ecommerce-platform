import { useEffect, useState } from "react";

import {
  getCart,
  removeCartItem,
  updateCartItem,
} from "../services/cartService";

import {
  createOrder,
  createRazorpayOrder,
  verifyPayment,
} from "../services/orderService";

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  applyCoupon,
} from "../services/couponService";

function CartPage() {
    const { user } = useContext(AuthContext);

    const token = user?.token;

    const [cartItems, setCartItems] =
    useState([]);

    const [couponCode, setCouponCode] =
    useState("");

    const [discount, setDiscount] =
    useState(0);

    const [finalTotal, setFinalTotal] =
    useState(0);

    const totalPrice = cartItems.reduce(
        (acc, item) =>
            acc +
            item.product.price * item.quantity,
        0
    );

    useEffect(() => {
    setFinalTotal(
        totalPrice - discount
    );
    }, [totalPrice, discount]);

    const handleRemove = async (id) => {
        try {
            if (!token) return;

            await removeCartItem(id, token);

            setCartItems(
                cartItems.filter(
                    (item) => item._id !== id
                )
            );
            toast.success("Item removed from cart");
        } catch (error) {
            toast.error("Failed to remove item from cart");
        }
    };

    const handleQuantityChange = async (
        cartId,
        newQuantity
        ) => {
        try {
            if (newQuantity < 1) return;

            await updateCartItem(
            cartId,
            newQuantity,
            token
            );

            setCartItems((prev) =>
                prev.map((item) =>
                    item._id === cartId
                    ? {
                        ...item,
                        quantity: newQuantity,
                        }
                    : item
                )
            );
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Checkout failed"
            );
        }
    };

    const handleApplyCoupon =
        async () => {
            try {
            const data =
                await applyCoupon(
                couponCode,
                totalPrice
                );

            setDiscount(
                data.discount
            );

            setFinalTotal(
                data.finalTotal
            );

            toast.success(
                "Coupon Applied"
            );
            } catch (error) {
            toast.error(
                error.response?.data
                ?.message ||
                "Invalid Coupon"
            );
            }
    };

    const handleCheckout = async () => {
    try {
        if (!token) {
        toast.error(
            "Please login first"
        );
        return;
        }

        const order =
            await createOrder(
                {
                couponCode,
                },
                token
            );
        const razorpayOrder =
        await createRazorpayOrder(
            order._id,
            token
        );

        const options = {
            key:
                "rzp_test_Sw3EdNeSHMhbEs",

            amount:
                razorpayOrder.amount,

            currency:
                razorpayOrder.currency,

            name:
                "NexusStore",

            description:
                "Order Payment",

            order_id:
                razorpayOrder.id,

            prefill: {
                name: user.name,
                email: user.email,
            },

            handler: async (
                response
            ) => {
                try {
                await verifyPayment(
                    order._id,
                    response,
                    token
                );

                toast.success(
                    "Payment Successful"
                );

                setCartItems([]);
                } catch (error) {
                toast.error(
                    "Verification Failed"
                );
                }
            },

            theme: {
                color: "#f59e0b",
            },
        };

        const razorpay =
        new window.Razorpay(
            options
        );

        razorpay.open();
    } catch (error) {
        toast.error(
        error.response?.data
            ?.message ||
            "Checkout failed"
        );
    }
    };

useEffect(() => {
    const fetchCart = async () => {
        try {
            if (!token) return;

            const data = await getCart(token);

            setCartItems(data);
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Failed to fetch cart"
            );
        }
    };

    fetchCart();
}, [token]);

    return (
    <div
        className="
        max-w-7xl
        mx-auto
        px-8
        py-12
        "
    >
        <h1
        className="
            text-5xl
            font-bold
            mb-10
        "
        >
        Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
        <div
            className="
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            p-10
            text-center
            "
        >
            <h2 className="text-2xl">
            Your cart is empty
            </h2>
        </div>
        ) : (
        <div
            className="
            grid
            lg:grid-cols-[2fr_1fr]
            gap-8
            "
        >
            {/* Cart Items */}

            <div>
            {cartItems.map((item) => (
                <div
                key={item._id}
                className="
                    bg-slate-900
                    border
                    border-slate-800
                    rounded-2xl
                    p-6
                    mb-6
                    flex
                    gap-6
                    items-center
                "
                >
                <img
                    src={
                    item.product.image ||
                    "https://via.placeholder.com/150"
                    }
                    alt={item.product.name}
                    className="
                    w-32
                    h-32
                    object-contain
                    rounded-xl
                    bg-white
                    p-2
                    "
                />

                <div className="flex-1">
                    <h3
                    className="
                        text-2xl
                        font-bold
                        mb-2
                    "
                    >
                    {item.product.name}
                    </h3>

                    <p
                    className="
                        text-slate-400
                        mb-2
                    "
                    >
                    {item.product.category}
                    </p>

                    <p
                    className="
                        text-green-400
                        mb-4
                    "
                    >
                    ✓ In Stock
                    </p>

                    <div
                    className="
                        flex
                        items-center
                        gap-3
                        mt-4
                    "
                    >
                    <button
                        onClick={() =>
                        handleQuantityChange(
                            item._id,
                            item.quantity - 1
                        )
                        }
                        className="
                        w-8
                        h-8
                        bg-slate-800
                        hover:bg-slate-700
                        rounded-lg
                        "
                    >
                        -
                    </button>

                    <span
                        className="
                        w-8
                        text-center
                        font-bold
                        text-lg
                        "
                    >
                        {item.quantity}
                    </span>

                    <button
                        onClick={() =>
                        handleQuantityChange(
                            item._id,
                            item.quantity + 1
                        )
                        }
                        className="
                        w-8
                        h-8
                        bg-slate-800
                        hover:bg-slate-700
                        rounded-lg
                        "
                    >
                        +
                    </button>
                    </div>
                </div>

                <div
                    className="
                    text-right
                    "
                >
                    <p
                    className="
                        text-3xl
                        font-bold
                        text-amber-400
                        mb-4
                    "
                    >
                    ₹
                    {item.product.price *
                        item.quantity}
                    </p>

                    <button
                    onClick={() =>
                        handleRemove(
                        item._id
                        )
                    }
                    className="
                        text-red-400
                        hover:text-red-300
                        font-semibold
                    "
                    >
                    Remove
                    </button>
                </div>
                </div>
            ))}
            </div>

            {/* Summary */}

            <div
            className="
                bg-slate-900
                border
                border-slate-800
                rounded-2xl
                p-6
                h-fit
                sticky
                top-28
            "
            >
            <h2
                className="
                text-3xl
                font-bold
                mb-6
                "
            >
                Order Summary
            </h2>

            <div
                className="
                flex
                justify-between
                mb-4
                "
            >
                <span>
                Subtotal
                </span>

                <span>
                ₹{totalPrice}
                </span>
            </div>

            <div
                className="
                flex
                justify-between
                mb-4
                "
            >
                <span>
                Delivery
                </span>

                <span className="text-green-400">
                FREE
                </span>
            </div>

            <div
                className="
                border-t
                border-slate-700
                my-6
                "
            />
            <div
            className="
                flex
                justify-between
                mb-4
            "
            >
            <span>
                Discount
            </span>

            <span className="text-green-400">
                - ₹{discount}
            </span>
            </div>

            <div className="mb-6">
            <input
                type="text"
                placeholder="Coupon Code"
                value={couponCode}
                onChange={(e) =>
                setCouponCode(
                    e.target.value
                )
                }
                className="
                w-full
                p-3
                rounded-lg
                bg-slate-800
                mb-3
                "
            />

            <button
                onClick={
                handleApplyCoupon
                }
                className="
                w-full
                bg-green-600
                hover:bg-green-500
                py-3
                rounded-lg
                font-semibold
                "
            >
                Apply Coupon
            </button>
            </div>
            <div
            className="
                flex
                justify-between
                text-2xl
                font-bold
                mb-8
            "
            >
            <span>
                Total
            </span>

            <span className="text-amber-400">
                ₹{finalTotal}
            </span>
            </div>
            <button
                onClick={handleCheckout}
                className="
                w-full
                bg-amber-500
                hover:bg-amber-400
                text-black
                font-bold
                py-4
                rounded-xl
                "
            >
                Proceed To Checkout
            </button>
            </div>
        </div>
        )}
    </div>
    );
}

export default CartPage;
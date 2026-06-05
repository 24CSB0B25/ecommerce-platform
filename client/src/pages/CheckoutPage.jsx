import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

import {
    getProductById,
} from "../services/productDetailsService";

import {
    applyCoupon,
} from "../services/couponService";

import Spinner from "../components/Spinner";

import {
    createBuyNowOrder,
    createRazorpayOrder,
    verifyPayment,
} from "../services/orderService";

import toast from "react-hot-toast";

import { useNavigate } from "react-router-dom";

function CheckoutPage() {
    const { id } = useParams();

    const { user } =
        useContext(AuthContext);

    const token = user?.token;

    const [product, setProduct] =
        useState(null);

    console.log("CheckoutPage loaded");
    console.log("id =", id);
    console.log("product =", product);
    
    const navigate = useNavigate();

    const [quantity, setQuantity] =
        useState(1);

    const [couponCode,
        setCouponCode] =
        useState("");

    const [discount,
        setDiscount] =
        useState(0);

    const [finalTotal,
        setFinalTotal] =
        useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
            console.log("Fetching product", id);

            const data =
                await getProductById(id);

            console.log(
                "API Response:",
                data
            );

            setProduct(data);
            } catch (error) {
            console.log(
                "Fetch Error:",
                error
            );
            }
        };

        fetchProduct();
    }, [id]);

    useEffect(() => {
        if (!product) return;

        const total =
        product.price * quantity;

        setFinalTotal(
        total - discount
        );
    }, [
        product,
        quantity,
        discount,
    ]);

    const handleApplyCoupon =
        async () => {
        try {
            const total =
            product.price *
            quantity;

            const data =
            await applyCoupon(
                couponCode,
                total
            );

            setDiscount(
            data.discount
            );

            setFinalTotal(
            data.finalTotal
            );
        } catch (error) {
            console.log(error);
        }
        };

    const handleProceedToCheckout =
  async () => {
    try {
      if (!token) {
        toast.error(
          "Please login first"
        );
        return;
      }

      const order =
        await createBuyNowOrder(
          product._id,
          quantity,
          couponCode,
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
            "Buy Now Payment",

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

                navigate(
                "/orders"
                );
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

    if (!product) {
        return (
            <div className="text-white text-4xl p-10">
            Product not loaded yet
            </div>
        );
    }

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
            Buy Now
        </h1>

        <div
            className="
            grid
            lg:grid-cols-[2fr_1fr]
            gap-8
            "
        >
            <div
            className="
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            p-6
            flex
            gap-6
            items-center
            h-50
            "
            >
            <img
                src={product.image}
                alt={product.name}
                className="
                w-32
                h-32
                object-contain
                bg-white
                rounded-xl
                p-2
                "
            />

            <div className="flex-1">
                <h2
                className="
                text-2xl
                font-bold
                "
                >
                {product.name}
                </h2>

                <p
                className="
                text-slate-400
                "
                >
                {product.category}
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
                    setQuantity(
                        Math.max(
                        1,
                        quantity - 1
                        )
                    )
                    }
                    className="
                    w-8
                    h-8
                    bg-slate-800
                    rounded-lg
                    "
                >
                    -
                </button>

                <span>
                    {quantity}
                </span>

                <button
                    onClick={() =>
                    setQuantity(
                        quantity + 1
                    )
                    }
                    className="
                    w-8
                    h-8
                    bg-slate-800
                    rounded-lg
                    "
                >
                    +
                </button>
                </div>
            </div>
            </div>

            <div
            className="
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            p-6
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
                    ₹{product.price * quantity}
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

                <span
                    className="
                    text-green-400
                    "
                >
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

                <span
                    className="
                    text-green-400
                    "
                >
                    - ₹{discount}
                </span>
            </div>

            <input
                type="text"
                value={couponCode}
                onChange={(e) =>
                setCouponCode(
                    e.target.value
                )
                }
                placeholder="Coupon Code"
                className="
                w-full
                p-3
                rounded-lg
                bg-slate-800
                my-4
                "
            />

            <button
                onClick={
                handleApplyCoupon
                }
                className="
                w-full
                bg-green-600
                py-3
                rounded-lg
                mb-6
                "
            >
                Apply Coupon
            </button>

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

                <span
                className="
                text-amber-400
                "
                >
                ₹{finalTotal}
                </span>
            </div>

            <button
                onClick={handleProceedToCheckout}
                className="
                w-full
                bg-amber-500
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
        </div>
    );
}

export default CheckoutPage;
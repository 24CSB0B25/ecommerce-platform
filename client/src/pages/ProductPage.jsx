import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getProductById } from "../services/productDetailsService";
import { addToCart } from "../services/cartService";
import {
  useContext,
} from "react";

import {
  AuthContext,
} from "../context/AuthContext";

import toast from "react-hot-toast";
// TEMPORARY
import Spinner from "../components/Spinner";
import { createReview } from "../services/productService";
import {
  addToWishlist,
} from "../services/wishlistService";

function ProductPage() {
  const { id } = useParams();

  const { user } = useContext(AuthContext);

  const token = user?.token;

  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleAddToCart = async () => {
    try {
      if (!token) {
        toast.error("Please login first");
        return;
      }

      await addToCart(
        product._id,
        1,
        token
      );

      toast.success("Product added to cart");
    } catch (error) {
      console.log(error);
    }
  };
  const handleWishlist =
  async () => {
    if (!token) {
      toast.error(
        "Please login first"
      );
      return;
    }

    try {
      await addToWishlist(
        product._id,
        token
      );

      toast.success(
        "Added to Wishlist"
      );
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Wishlist failed"
      );
    }
  };
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      await createReview(
        product._id,
        {
          rating,
          comment,
        },
        token
      );

      toast.success("Review Added");

      const updatedProduct =
        await getProductById(id);

      setProduct(updatedProduct);

      setComment("");
      setRating(5);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Review failed"
      );
    }
  };
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <Spinner />;
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
    <div
      className="
        text-slate-400
        mb-8
      "
    >
      Home / {product.category} / {product.name}
    </div>
    <div
      className="
        grid
        lg:grid-cols-[1fr_1.2fr_350px]
        gap-8
      "
    >
      {/* Product Image */}

      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-6
          shadow-lg
          flex
          items-center
          justify-center
        "
      >
        <img
          src={
            product.image ||
            "https://via.placeholder.com/600x500"
          }
          alt={product.name}
          className="
            w-full
            h-[450px]
            object-contain
            hover:scale-105
            transition-all
            duration-300
          "
        />
      </div>

      {/* Product Details */}

      <div>
        <p
          className="
            text-amber-400
            uppercase
            tracking-wider
            mb-3
          "
        >
          {product.category}
        </p>

        <h1
          className="
            text-5xl
            font-bold
            mb-4
          "
        >
          {product.name}
        </h1>

        <p
          className="
            text-yellow-400
            text-lg
            mb-4
          "
        >
          ⭐ {product.rating}
          {" "}
          ({product.numReviews} Reviews)
        </p>

        <div
          className="
            border-b
            border-slate-700
            mb-6
          "
        />

        <h2
          className="
            text-4xl
            font-bold
            text-amber-400
            mb-6
          "
        >
          ₹{product.price}
        </h2>

        <p
          className="
            text-slate-300
            leading-8
            mb-8
          "
        >
          {product.description}
        </p>

        <div
          className="
            grid
            md:grid-cols-3
            gap-4
          "
        >
          <div
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-xl
              p-4
              text-center
              hover:border-amber-500
              hover:-translate-y-1
              transition-all
              duration-300
            "
          >
            🚚
            <p className="mt-2">
              Free Delivery
            </p>
          </div>

          <div
          className="
            bg-slate-900
            border
            border-slate-800
            rounded-xl
            p-4
            text-center
            hover:border-amber-500
            hover:-translate-y-1
            transition-all
            duration-300
            "
          >
            🔄
            <p className="mt-2">
              Easy Returns
            </p>
          </div>

          <div
            className="
              bg-slate-900
              border
              border-slate-800
              rounded-xl
              p-4
              text-center
              hover:border-amber-500
              hover:-translate-y-1
              transition-all
              duration-300
            "
          >
            🔒
            <p className="mt-2">
              Secure Payment
            </p>
          </div>
        </div>
      </div>

      {/* Buy Box */}

      <div
        className="
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-6
          h-fit
          shadow-lg
          sticky
          top-28
        "
      >
        <h2
          className="
            text-4xl
            font-bold
            text-amber-400
            mb-4
          "
        >
          ₹{product.price}
        </h2>

        <div className="mb-6">
          <p
            className={`
              font-semibold
              ${
                product.stock > 0
                  ? "text-green-400"
                  : "text-red-400"
              }
            `}
          >
            {product.stock > 0 ? (
              <p className="text-green-400">
                ✓ In Stock ({product.stock})
              </p>
            ) : (
              <p className="text-red-400">
                ✗ Out of Stock
              </p>
            )}
          </p>

          {product.stock > 0 && (
            <p
              className="
                text-slate-400
                text-sm
                mt-2
              "
            >
              {product.stock} units available
            </p>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`
            w-full
            py-4
            rounded-xl
            font-bold
            ${
              product.stock === 0
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-400 text-black"
            }
          `}
        >
          {product.stock === 0
            ? "Out Of Stock"
            : "Add To Cart"}
        </button>

        <button
          onClick={handleWishlist}
          className="
            w-full
            border
            border-pink-500
            text-pink-500
            hover:bg-pink-500
            hover:text-white
            font-bold
            py-4
            rounded-xl
            mb-4
            transition-all
          "
        >
          ❤️ Add To Wishlist
        </button>
        <button
          className="
            w-full
            bg-orange-500
            hover:bg-orange-400
            text-black
            font-bold
            py-4
            rounded-xl
          "
        >
          Buy Now
        </button>

        <div
          className="
            border-t
            border-slate-700
            mt-6
            pt-6
            text-slate-400
            text-sm
          "
        >
          <p>
            🚚 Free delivery on
            eligible orders
          </p>

          <p className="mt-2">
            🔄 Easy returns
          </p>

          <p className="mt-2">
            🔒 Secure checkout
          </p>
        </div>
      </div>
    </div>
{/* Review Form */}

<div
  className="
    mt-20
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
    Write a Review
  </h2>

{!user ? ( <p className="text-slate-400">
Please login to write a review. </p>
) : ( <form
  onSubmit={handleReviewSubmit}
  className="space-y-4"
>
  <select
    value={rating}
    onChange={(e) =>
      setRating(
        Number(e.target.value)
      )
    }
    className="
      w-full
      p-3
      rounded-lg
      bg-slate-800
      border
      border-slate-700
    "
  >
    <option value={5}>5 Stars</option>
    <option value={4}>4 Stars</option>
    <option value={3}>3 Stars</option>
    <option value={2}>2 Stars</option>
    <option value={1}>1 Star</option>
  </select>

  <textarea
    rows="4"
    value={comment}
    placeholder="Write your review..."
    onChange={(e) =>
      setComment(e.target.value)
    }
    className="
      w-full
      p-4
      rounded-lg
      bg-slate-800
      border
      border-slate-700
    "
  />

  <button
    type="submit"
    className="
      bg-amber-500
      hover:bg-amber-400
      text-black
      px-6
      py-3
      rounded-xl
      font-bold
    "
  >
    Submit Review
  </button>
</form>
)}

</div>

{/* Reviews */}

<div className="mt-20">
  <h2
    className="
      text-3xl
      font-bold
      mb-8
    "
  >
    Customer Reviews
  </h2>

{product.reviews?.length === 0 ? (
  <p className="text-slate-400">
    No reviews yet.
  </p>
) : (
  product.reviews.map((review) => (
    <div
      key={review._id}
      className="
        bg-slate-900
        border
        border-slate-800
        rounded-xl
        p-6
        mb-4
        hover:border-amber-500
        transition-all
      "
    >
      <h3
        className="
          font-bold
          mb-2
        "
      >
        {review.name}
      </h3>

      <p
        className="
          text-yellow-400
          mb-2
        "
      >
        ⭐ {review.rating}/5
      </p>

      <p
        className="
          text-slate-400
        "
      >
        {review.comment}
      </p>
    </div>
  ))
)}

</div>

</div>
);
}

export default ProductPage;

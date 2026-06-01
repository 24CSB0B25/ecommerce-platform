import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getWishlist,
  removeFromWishlist,
} from "../services/wishlistService";

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import toast from "react-hot-toast";
import Spinner from "../components/Spinner";

function WishlistPage() {
  const { user } =
    useContext(AuthContext);

  const token = user?.token;

  const [wishlist, setWishlist] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchWishlist =
      async () => {
        try {
          const data =
            await getWishlist(token);

          setWishlist(data);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

    if (token) {
      fetchWishlist();
    }
  }, [token]);

  const handleRemove =
    async (productId) => {
      try {
        await removeFromWishlist(
          productId,
          token
        );

        setWishlist(
          wishlist.filter(
            (item) =>
              item._id !== productId
          )
        );

        toast.success(
          "Removed from Wishlist"
        );
      } catch (error) {
        toast.error(
          "Failed to remove"
        );
      }
    };

  if (loading) {
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
      <h1
        className="
          text-4xl
          font-bold
          mb-8
        "
      >
        ❤️ My Wishlist
      </h1>

      {wishlist.length === 0 ? (
        <p>
          No products in wishlist.
        </p>
      ) : (
        <div
          className="
            grid
            md:grid-cols-2
            lg:grid-cols-4
            gap-6
          "
        >
          {wishlist.map(
            (product) => (
              <div
                key={product._id}
                className="
                  bg-slate-900
                  border
                  border-slate-800
                  rounded-xl
                  overflow-hidden
                "
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="
                    h-56
                    w-full
                    object-cover
                  "
                />

                <div className="p-4">
                  <h2
                    className="
                      font-bold
                      mb-2
                    "
                  >
                    {product.name}
                  </h2>

                  <p
                    className="
                      text-amber-400
                      font-bold
                    "
                  >
                    ₹{product.price}
                  </p>

                  <div
                    className="
                      flex
                      gap-2
                      mt-4
                    "
                  >
                    <Link
                      to={`/product/${product._id}`}
                      className="
                        bg-amber-500
                        text-black
                        px-4
                        py-2
                        rounded
                      "
                    >
                      View
                    </Link>

                    <button
                      onClick={() =>
                        handleRemove(
                          product._id
                        )
                      }
                      className="
                        bg-red-500
                        px-4
                        py-2
                        rounded
                      "
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
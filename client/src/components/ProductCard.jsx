import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <div
      className="
        bg-slate-900
        border
        border-slate-800
        rounded-2xl
        overflow-hidden
        shadow-lg
        hover:shadow-amber-500/20
        hover:-translate-y-2
        transition-all
        duration-300
      "
    >
      <img
        src={
          product.image ||
          "https://via.placeholder.com/400x300"
        }
        alt={product.name}
        className="
          w-full
          h-56
          object-cover
        "
      />

      <div className="p-5">
        <p
          className="
            text-amber-400
            text-sm
            mb-2
          "
        >
          {product.category}
        </p>

        <h3
          className="
            text-xl
            font-bold
            mb-2
          "
        >
          {product.name}
        </h3>

        <p
          className="
            text-2xl
            font-bold
            text-white
            mb-3
          "
        >
          ₹{product.price}
        </p>

        <p
          className="
            text-slate-400
            mb-4
          "
        >
          ⭐ {product.rating}
        </p>

        <Link
          to={`/product/${product._id}`}
          className="
            block
            text-center
            bg-amber-500
            hover:bg-amber-400
            text-black
            font-semibold
            py-3
            rounded-xl
          "
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
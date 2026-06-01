import { useEffect, useState } from "react";
import {
  getProducts,
  getSuggestions,
} from "../services/productService";
import ProductCard from "../components/ProductCard";
import Hero from "../components/Hero";
import Spinner from "../components/Spinner";

function HomePage() {
  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [keyword, setKeyword] =
    useState("");

  const [suggestions, setSuggestions] =
    useState([]);

  const [category, setCategory] =
    useState("");

  const [sort, setSort] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [pages, setPages] =
    useState(1);

  const [searchTerm, setSearchTerm] =
    useState("");

  useEffect(() => {
    const fetchProducts =
      async () => {
        try {
          setLoading(true);

          const data =
            await getProducts(
              keyword,
              category,
              sort,
              page
            );

          setPages(data.pages);
          setProducts(data.products);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

    fetchProducts();
  }, [keyword, category, sort, page]);

  useEffect(() => {
    const fetchSuggestions =
      async () => {
        if (
          searchTerm.length < 2
        ) {
          setSuggestions([]);
          return;
        }

        try {
          const data =
            await getSuggestions(
              searchTerm
            );

          setSuggestions(data);
        } catch (error) {
          console.log(error);
        }
      };

    fetchSuggestions();
  }, [searchTerm]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <Hero />

      <h1
        className="
          text-4xl
          font-bold
          text-center
          mt-20
          mb-10
        "
      >
        Featured Products
      </h1>

      <div
        className="
          flex
          flex-wrap
          justify-center
          items-center
          gap-4
          mb-12
          px-4
        "
      >
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(
              e.target.value
            )
          }
          onBlur={() =>
            setTimeout(
              () =>
                setSuggestions([]),
              200
            )
          }
          className="
            bg-slate-900
            border
            border-slate-700
            rounded-xl
            px-4
            py-3
            w-72
            text-white
          "
        />

        {suggestions.length > 0 && (
          <div
            className="
              absolute
              bg-slate-900
              border
              border-slate-700
              rounded-lg
              mt-1
              w-72
              z-50
            "
          >
            {suggestions.map(
              (item) => (
                <div
                  key={item._id}
                  className="
                    p-3
                    hover:bg-slate-800
                    cursor-pointer
                  "
                  onClick={() => {
                    setSearchTerm(item.name);
                    setKeyword(item.name);
                    setSuggestions([]);
                    setPage(1);
                  }}
                >
                  {item.name}
                </div>
              )
            )}
          </div>
        )}

        <button
          onClick={() => {
            setKeyword(searchTerm);
            setPage(1);
          }}
          className="
            bg-amber-500
            hover:bg-amber-400
            text-black
            font-semibold
            px-6
            py-3
            rounded-xl
          "
        >
          Search
        </button>

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="
            bg-slate-900
            border
            border-slate-700
            rounded-xl
            px-4
            py-3
          "
        >
          <option value="">
            All Categories
          </option>

          <option value="Mobiles">
            Mobiles
          </option>

          <option value="Laptops">
            Laptops
          </option>

          <option value="Audio">
            Audio
          </option>

          <option value="Accessories">
            Accessories
          </option>
        </select>

        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(1);
          }}
          className="
            bg-slate-900
            border
            border-slate-700
            rounded-xl
            px-4
            py-3
          "
        >
          <option value="">
            Default Sorting
          </option>

          <option value="price_asc">
            Price Low → High
          </option>

          <option value="price_desc">
            Price High → Low
          </option>

          <option value="newest">
            Newest
          </option>
        </select>
      </div>

      <div
        id="products"
        className="
          grid
          md:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-4
          gap-8
          px-8
        "
      >
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}
      </div>

      <div
        className="
          mt-12
          mb-12
          flex
          justify-center
          items-center
          gap-4
        "
      >
        <button
          disabled={page === 1}
          onClick={() =>
            setPage(page - 1)
          }
          className="
            bg-slate-800
            hover:bg-slate-700
            disabled:opacity-50
            px-5
            py-2
            rounded-lg
          "
        >
          Prev
        </button>

        <span
          className="
            text-lg
            font-semibold
          "
        >
          Page {page} of {pages}
        </span>

        <button
          disabled={page === pages}
          onClick={() =>
            setPage(page + 1)
          }
          className="
            bg-amber-500
            hover:bg-amber-400
            text-black
            font-semibold
            disabled:opacity-50
            px-5
            py-2
            rounded-lg
          "
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default HomePage;
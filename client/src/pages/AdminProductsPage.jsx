import { useEffect, useState } from "react";
import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";
import {
    getAllProducts,
    deleteProduct,
} from "../services/productService";

    import { useNavigate } from "react-router-dom";
    import toast from "react-hot-toast";

    function AdminProductsPage() {
    const { user } =
        useContext(AuthContext);

    const [products, setProducts] =
        useState([]);

    const navigate =
        useNavigate();

    useEffect(() => {
        const fetchProducts =
        async () => {
            try {
            const data =
                await getAllProducts(
                    user.token
                );

            setProducts(data);
            } catch (error) {
            console.log(error);
            }
        };
        fetchProducts();
    }, []);

    const handleDeleteProduct = async (id) => {
    try {
        await deleteProduct(id, user.token);

        setProducts(
        products.filter(
            (product) => product._id !== id
        )
        );

        toast.success(
        "Product deleted successfully"
        );
    } catch (error) {
        console.log(error);

        toast.error(
        "Failed to delete product"
        );
    }
    };

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
            flex
            justify-between
            items-center
            mb-10
        "
        >
        <div>
            <h1
            className="
                text-5xl
                font-bold
            "
            >
            Admin Products
            </h1>

            <p
            className="
                text-slate-400
                mt-2
            "
            >
            Manage your product catalog
            </p>
        </div>

        <button
            onClick={() =>
            navigate(
                "/admin/products/create"
            )
            }
            className="
            bg-green-600
            hover:bg-green-500
            px-6
            py-3
            rounded-xl
            font-semibold
            "
        >
            + Create Product
        </button>
        </div>

        <div
        className="
            overflow-hidden
            rounded-2xl
            border
            border-slate-800
            bg-slate-900
        "
        >
        <table className="w-full">
            <thead>
            <tr
                className="
                bg-slate-800
                text-left
                "
            >
                <th className="p-4">
                Image
                </th>

                <th className="p-4">
                Product
                </th>

                <th className="p-4">
                Category
                </th>

                <th className="p-4">
                Price
                </th>

                <th className="p-4">
                Rating
                </th>

                <th className="p-4">
                Actions
                </th>
            </tr>
            </thead>

            <tbody>
            {products.map(
                (product) => (
                <tr
                    key={product._id}
                    className="
                    border-t
                    border-slate-800
                    hover:bg-slate-800
                    transition-all
                    "
                >
                    <td className="p-4">
                    <img
                        src={
                        product.image ||
                        "https://via.placeholder.com/80"
                        }
                        alt={product.name}
                        className="
                        w-16
                        h-16
                        object-cover
                        rounded-lg
                        "
                    />
                    </td>

                    <td className="p-4">
                    <div>
                        <p
                        className="
                            font-semibold
                        "
                        >
                        {product.name}
                        </p>

                        <p
                        className="
                            text-xs
                            text-slate-500
                        "
                        >
                        ID:
                        {product._id.slice(
                            -6
                        )}
                        </p>
                    </div>
                    </td>

                    <td className="p-4">
                    <span
                        className="
                        bg-slate-800
                        px-3
                        py-1
                        rounded-lg
                        text-sm
                        "
                    >
                        {product.category}
                    </span>
                    </td>

                    <td
                    className="
                        p-4
                        text-amber-400
                        font-bold
                    "
                    >
                    ₹{product.price}
                    </td>

                    <td className="p-4">
                    ⭐ {product.rating}
                    </td>

                    <td className="p-4">
                    <div
                        className="
                        flex
                        gap-3
                        "
                    >
                        <button
                        onClick={() =>
                            navigate(
                            `/admin/products/${product._id}/edit`
                            )
                        }
                        className="
                            bg-blue-600
                            hover:bg-blue-500
                            px-4
                            py-2
                            rounded-lg
                        "
                        >
                        Edit
                        </button>

                        <button
                        onClick={() =>
                            handleDeleteProduct(
                            product._id
                            )
                        }
                        className="
                            bg-red-600
                            hover:bg-red-500
                            px-4
                            py-2
                            rounded-lg
                        "
                        >
                        Delete
                        </button>
                    </div>
                    </td>
                </tr>
                )
            )}
            </tbody>
        </table>
        </div>
    </div>
    );
}

export default AdminProductsPage;
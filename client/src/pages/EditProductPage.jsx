import { useEffect, useState } from "react";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import {
    getProductById,
    updateProduct,
} from "../services/productService";

import toast from "react-hot-toast";
import { uploadImage } from "../services/uploadService";

function EditProductPage() {
    const { id } = useParams();

    const navigate = useNavigate();

    const { user } =
        useContext(AuthContext);

    const [uploading, setUploading] =
        useState(false);
    const [formData, setFormData] =
        useState({
        name: "",
        description: "",
        price: "",
        image: "",
        category: "",
        stock: "",
        });

    useEffect(() => {
        const fetchProduct =
        async () => {
            try {
            const data =
                await getProductById(id);

            setFormData({
                name: data.name,
                description:
                data.description,
                price: data.price,
                image: data.image,
                category:
                data.category,
                stock: data.stock,
            });
            } catch (error) {
            console.log(error);
            }
        };

        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
        ...formData,
        [e.target.name]:
            e.target.value,
        });
    };

    const handleImageUpload =
        async (e) => {
            const file =
            e.target.files[0];

            if (!file) return;

            try {
            setUploading(true);

            const imageUrl =
                await uploadImage(file);

            setFormData((prev) => ({
                ...prev,
                image: imageUrl,
            }));

            toast.success(
                "Image uploaded"
            );
            } catch (error) {
            toast.error(
                "Upload failed"
            );
            } finally {
            setUploading(false);
            }
        };
        const handleSubmit = async (
            e
        ) => {
            e.preventDefault();

            try {
            await updateProduct(
                id,
                formData,
                user.token
            );

            toast.success("Product Updated Successfully");

            navigate(
                "/admin/products"
            );
            } catch (error) {
            toast.error("Failed to update product");
            }
        };

        return (
            <div
                className="
                max-w-3xl
                mx-auto
                py-12
                px-6
                "
            >
                <div
                className="
                    bg-slate-900
                    border
                    border-slate-800
                    rounded-2xl
                    p-8
                "
                >
                <h1
                    className="
                    text-4xl
                    font-bold
                    mb-8
                    "
                >
                    Edit Product
                </h1>
                <p
                    className="
                        text-slate-400
                        mb-8
                    "
                    >
                    Update product details and inventory
                </p>
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Product Name"
                    className="
                        w-full
                        p-4
                        rounded-lg
                        bg-slate-800
                        border
                        border-slate-700
                        focus:border-amber-500
                        focus:outline-none
                    "
                    />

                    <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Description"
                    className="
                        w-full
                        p-4
                        rounded-lg
                        bg-slate-800
                        border
                        border-slate-700
                        focus:border-amber-500
                        focus:outline-none
                    "
                    />

                    <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Price"
                    className="
                        w-full
                        p-4
                        rounded-lg
                        bg-slate-800
                        border
                        border-slate-700
                        focus:border-amber-500
                        focus:outline-none
                    "
                    />

                    <div>
                    <label
                        className="
                        block
                        mb-2
                        text-slate-300
                        "
                    >
                        Product Image
                    </label>

                    <input
                        type="file"
                        accept="image/*"
                        onChange={
                        handleImageUpload
                        }
                        className="
                        w-full
                        p-3
                        rounded-lg
                        bg-slate-800
                        border
                        border-slate-700
                        focus:border-amber-500
                        focus:outline-none
                        "
                    />

                    {uploading && (
                        <p className="mt-3">
                        Uploading...
                        </p>
                    )}

                    {formData.image && (
                        <img
                        src={formData.image}
                        alt="Preview"
                        className="
                            mt-4
                            w-full
                            max-w-xs
                            h-64
                            object-cover
                            rounded-xl
                            border
                            border-slate-700
                            focus:border-amber-500
                            focus:outline-none
                        "
                        />
                    )}
                    </div>

                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="
                            w-full
                            p-4
                            rounded-lg
                            bg-slate-800
                            border
                            border-slate-700
                            focus:border-amber-500
                            focus:outline-none
                        "
                        >
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

                    <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Stock Quantity"
                    className="
                        w-full
                        p-4
                        rounded-lg
                        bg-slate-800
                        border
                        border-slate-700
                        focus:border-amber-500
                        focus:outline-none
                    "
                    />
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/admin/products")
                        }
                        className="
                            w-full
                            bg-slate-700
                            hover:bg-slate-600
                            py-4
                            rounded-xl
                            font-bold
                            mb-3
                        "
                        >
                        Cancel
                    </button>
                    <button
                    type="submit"
                    className="
                        w-full
                        bg-amber-500
                        hover:bg-amber-400
                        text-black
                        font-bold
                        py-4
                        rounded-xl
                        transition
                    "
                    >
                    Update Product
                    </button>
                </form>
                </div>
            </div>
        );
}

export default EditProductPage;
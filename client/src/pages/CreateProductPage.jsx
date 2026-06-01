import { useState } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

import {
  createProduct,
} from "../services/productService";

import toast from "react-hot-toast";
import {
  uploadImage,
} from "../services/uploadService";

function CreateProductPage() {
    const { user } =
        useContext(AuthContext);

    const navigate =
        useNavigate();

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
            console.log(error);

            toast.error(
                "Image upload failed"
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
        await createProduct(
            formData,
            user.token
        );

        toast.success("Product Created Successfully");

        navigate(
            "/admin/products"
        );
        } catch (error) {
        toast.error("Failed to create product");
        }
    };

return (
    <div
        className="
        min-h-screen
        bg-slate-950
        flex
        justify-center
        items-center
        px-4
        py-10
        "
    >
        <form
        onSubmit={handleSubmit}
        className="
            w-full
            max-w-2xl
            bg-slate-900
            border
            border-slate-800
            rounded-3xl
            p-10
            space-y-6
        "
        >
        <h1
            className="
            text-4xl
            font-bold
            text-center
            "
        >
            Create Product
        </h1>

        <p
            className="
            text-center
            text-slate-400
            mb-4
            "
        >
            Add a new product to NexusStore
        </p>

        <input
            name="name"
            placeholder="Product Name"
            onChange={handleChange}
            className="
            w-full
            p-4
            rounded-lg
            bg-slate-800
            border
            border-slate-700
            "
        />

        <textarea
            name="description"
            placeholder="Description"
            rows="4"
            onChange={handleChange}
            className="
            w-full
            p-4
            rounded-lg
            bg-slate-800
            border
            border-slate-700
            "
        />

        <input
            name="price"
            type="number"
            placeholder="Price"
            onChange={handleChange}
            className="
            w-full
            p-4
            rounded-lg
            bg-slate-800
            border
            border-slate-700
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
            onChange={handleImageUpload}
            className="
                w-full
                p-3
                rounded-lg
                bg-slate-800
                border
                border-slate-700
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
                w-48
                h-48
                object-cover
                rounded-xl
                border
                border-slate-700
                "
            />
            )}
        </div>

        <select
            name="category"
            onChange={handleChange}
            className="
            w-full
            p-4
            rounded-lg
            bg-slate-800
            border
            border-slate-700
            "
        >
            <option value="">
            Select Category
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

        <input
            name="stock"
            type="number"
            placeholder="Stock Quantity"
            onChange={handleChange}
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
            w-full
            bg-green-600
            hover:bg-green-500
            text-white
            font-bold
            py-4
            rounded-xl
            transition
            "
        >
            Create Product
        </button>
        </form>
    </div>
);
}

export default CreateProductPage;
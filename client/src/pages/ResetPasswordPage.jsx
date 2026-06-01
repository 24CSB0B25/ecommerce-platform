import {
    useParams,
    useNavigate,
} from "react-router-dom";

import {
    useState,
} from "react";

import axios from "axios";
import toast from "react-hot-toast";

function ResetPasswordPage() {
    const { token } =
        useParams();

    const navigate =
        useNavigate();

    const [password,
        setPassword] =
        useState("");

    const handleSubmit =
        async (e) => {
        e.preventDefault();

        try {
        const { data } =
            await axios.put(
                `http://localhost:5000/api/auth/reset-password/${token}`,
                {
                    password,
                }
            );

        toast.success(
            data.message
            );

            navigate(
            "/login"
            );
        } catch (error) {
            toast.error(
            error.response?.data
                ?.message ||
                "Failed"
            );
        }
    };

    return (
        <div className="max-w-md mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">
            Reset Password
        </h1>

        <form
            onSubmit={
            handleSubmit
            }
            className="space-y-4"
        >
            <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) =>
                setPassword(
                e.target.value
                )
            }
            className="
                w-full
                bg-slate-900
                border
                border-slate-700
                rounded-xl
                px-4
                py-3
            "
            />

            <button
            type="submit"
            className="
                w-full
                bg-amber-500
                text-black
                font-bold
                py-3
                rounded-xl
            "
            >
            Reset Password
            </button>
        </form>
        </div>
    );
}

export default ResetPasswordPage;
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function ForgotPasswordPage() {
  const [email, setEmail] =
    useState("");

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        const { data } =
          await axios.post(
            "http://localhost:5000/api/auth/forgot-password",
            { email }
          );

        toast.success(
          data.message
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
        Forgot Password
      </h1>

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-4"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(
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
          Send Reset Link
        </button>
      </form>
    </div>
  );
}

export default
  ForgotPasswordPage;
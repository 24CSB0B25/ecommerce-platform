import {
  useState,
  useContext,
} from "react";

import {
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";

import {
  AuthContext,
} from "../context/AuthContext";

import {
  registerUser,
} from "../services/authService";

import toast from "react-hot-toast";

function RegisterPage() {
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const {
    user,
    login,
  } = useContext(AuthContext);

  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      const data =
        await registerUser(
          name,
          email,
          password
        );

      login(data);

      toast.success(
        "Registration Successful"
      );
      navigate("/");

    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Registration Failed"
      );
    }
  };

  return (
    <div
      className="
        min-h-[70vh]
        flex
        items-center
        justify-center
        px-4
      "
    >
      <div
        className="
          w-full
          max-w-md
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
            text-center
            mb-8
          "
        >
          Register
        </h1>
        <p
          className="
            text-center
            text-slate-400
            mb-8
          "
        >
          Create your NexusStore account
        </p>
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            className="
              w-full
              p-4
              rounded-xl
              bg-slate-800
              border
              border-slate-700
              focus:border-amber-500
              focus:outline-none
            "
          />

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
              p-4
              rounded-xl
              bg-slate-800
              border
              border-slate-700
              focus:border-amber-500
              focus:outline-none
            "
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="
              w-full
              p-4
              rounded-xl
              bg-slate-800
              border
              border-slate-700
              focus:border-amber-500
              focus:outline-none
            "
          />

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
            "
          >
            Create Account
          </button>
        </form>

        <p
          className="
            text-center
            mt-6
            text-slate-400
          "
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="
              text-amber-400
            "
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
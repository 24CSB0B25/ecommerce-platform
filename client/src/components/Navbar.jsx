import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } =
    useContext(AuthContext);

  console.log(user); 

    return (
    <div
        className="
        bg-slate-950
        border-b
        border-slate-800
        px-8
        py-4
        flex
        justify-between
        items-center
        sticky
        top-0
        z-50
        "
    >
        <div className="flex items-center gap-8">
        <Link
            to="/"
            className="
            text-2xl
            font-bold
            text-amber-400
            "
        >
            NexusStore
        </Link>

        <Link
            to="/"
            className="
            text-slate-300
            hover:text-amber-400
            "
        >
            Home
        </Link>

        {user && (
            <>
                <Link
                to="/wishlist"
                className="
                    text-slate-300
                    hover:text-amber-400
                "
                >
                Wishlist
                </Link>

                <Link
                to="/cart"
                className="
                    text-slate-300
                    hover:text-amber-400
                "
                >
                Cart
                </Link>

                <Link
                to="/orders"
                className="
                    text-slate-300
                    hover:text-amber-400
                "
                >
                Orders
                </Link>

                <Link
                to="/profile"
                className="
                    text-slate-300
                    hover:text-amber-400
                "
                >
                Profile
                </Link>
            </>
        )}

        {user?.isAdmin && (
            <>
            <Link
                to="/admin"
                className="
                text-slate-300
                hover:text-amber-400
                "
            >
                Dashboard
            </Link>

            <Link
                to="/admin/products"
                className="
                text-slate-300
                hover:text-amber-400
                "
            >
                Products
            </Link>

            <Link
            to="/admin/coupons"
            >
            Coupons
            </Link>
            
            <Link
                to="/admin/orders"
                className="
                text-slate-300
                hover:text-amber-400
                "
            >
                Manage Orders
            </Link>
            

            </>
        )}
        </div>

        <div>
        {!user ? (
            <div className="flex gap-4">
            <Link
                to="/login"
                className="
                text-slate-300
                hover:text-amber-400
                "
            >
                Login
            </Link>

            <Link
                to="/register"
                className="
                bg-amber-500
                text-black
                px-4
                py-2
                rounded-lg
                font-semibold
                "
            >
                Register
            </Link>
            </div>
        ) : (
            <button
            onClick={logout}
            className="
                bg-amber-500
                hover:bg-amber-400
                text-black
                px-4
                py-2
                rounded-lg
                font-semibold
            "
            >
            Logout
            </button>
        )}
        </div>
    </div>
    );
}
export default Navbar;
import {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCoupons,
  createCoupon,
  deleteCoupon,
  toggleCoupon,
} from "../services/couponService";

import { AuthContext }
  from "../context/AuthContext";

import toast from "react-hot-toast";

function AdminCouponsPage() {
  const { user } =
    useContext(AuthContext);

  const [coupons,
    setCoupons] =
    useState([]);

  const [form,
    setForm] =
    useState({
      code: "",
      discountType:
        "percentage",
      discountValue: "",
      minimumOrderAmount:
        "",
      expiryDate: "",
    });

  const fetchCoupons =
    async () => {
      const data =
        await getCoupons(
          user.token
        );

      setCoupons(data);
    };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate =
    async (e) => {
      e.preventDefault();

      try {
        await createCoupon(
          form,
          user.token
        );

        toast.success(
          "Coupon Created"
        );

        fetchCoupons();

        setForm({
          code: "",
          discountType:
            "percentage",
          discountValue: "",
          minimumOrderAmount:
            "",
          expiryDate: "",
        });
      } catch {
        toast.error(
          "Failed"
        );
      }
    };

  return (
    <div
      className="
      max-w-6xl
      mx-auto
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
        Coupons
      </h1>

      <form
        onSubmit={handleCreate}
        className="
            bg-slate-900
            p-8
            rounded-2xl
            border
            border-slate-800
            mb-10
            grid
            md:grid-cols-2
            gap-6
        "
        >
        <input
            type="text"
            placeholder="Coupon Code"
            value={form.code}
            onChange={(e) =>
            setForm({
                ...form,
                code: e.target.value,
            })
            }
            className="
            bg-slate-800
            border
            border-slate-700
            rounded-xl
            px-4
            py-3
            "
        />

        <select
            value={form.discountType}
            onChange={(e) =>
            setForm({
                ...form,
                discountType:
                e.target.value,
            })
            }
            className="
            bg-slate-800
            border
            border-slate-700
            rounded-xl
            px-4
            py-3
            "
        >
            <option value="percentage">
            Percentage
            </option>

            <option value="fixed">
            Fixed Amount
            </option>
        </select>

        <input
            type="number"
            placeholder="Discount Value"
            value={form.discountValue}
            onChange={(e) =>
            setForm({
                ...form,
                discountValue:
                e.target.value,
            })
            }
            className="
            bg-slate-800
            border
            border-slate-700
            rounded-xl
            px-4
            py-3
            "
        />

        <input
            type="number"
            placeholder="Minimum Order Amount"
            value={form.minimumOrderAmount}
            onChange={(e) =>
            setForm({
                ...form,
                minimumOrderAmount:
                e.target.value,
            })
            }
            className="
            bg-slate-800
            border
            border-slate-700
            rounded-xl
            px-4
            py-3
            "
        />

        <input
            type="date"
            value={form.expiryDate}
            onChange={(e) =>
            setForm({
                ...form,
                expiryDate:
                e.target.value,
            })
            }
            className="
            bg-slate-800
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
            bg-amber-500
            hover:bg-amber-400
            text-black
            font-bold
            rounded-xl
            py-3
            "
        >
            Create Coupon
        </button>
        </form>

      <div className="space-y-4">
        {coupons.map((coupon) => (
            <div
            key={coupon._id}
            className="
                bg-slate-900
                border
                border-slate-800
                rounded-xl
                p-5
                flex
                justify-between
                items-center
            "
            >
            <div>
                <h3
                className="
                    text-xl
                    font-bold
                "
                >
                {coupon.code}
                </h3>

                <p
                className="
                    text-slate-400
                    mt-1
                "
                >
                {coupon.discountType ===
                "percentage"
                    ? `${coupon.discountValue}% OFF`
                    : `₹${coupon.discountValue} OFF`}
                </p>

                <p
                className="
                    text-slate-500
                    text-sm
                "
                >
                Min Order:
                ₹
                {
                    coupon.minimumOrderAmount
                }
                </p>
            </div>

            <div
                className="
                flex
                gap-3
                "
            >
                <button
                onClick={() =>
                    toggleCoupon(
                    coupon._id,
                    user.token
                    )
                }
                className={`
                    px-4
                    py-2
                    rounded-lg
                    font-semibold
                    ${
                    coupon.isActive
                        ? "bg-yellow-600"
                        : "bg-green-600"
                    }
                `}
                >
                {coupon.isActive
                    ? "Deactivate"
                    : "Activate"}
                </button>

                <button
                onClick={() =>
                    deleteCoupon(
                    coupon._id,
                    user.token
                    )
                }
                className="
                    bg-red-600
                    hover:bg-red-500
                    px-4
                    py-2
                    rounded-lg
                    font-semibold
                "
                >
                Delete
                </button>
            </div>
            </div>
        ))}
        </div>
    </div>
  );
}

export default
  AdminCouponsPage;
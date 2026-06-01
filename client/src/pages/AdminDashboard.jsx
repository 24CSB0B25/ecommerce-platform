import {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  AuthContext,
} from "../context/AuthContext";

import {
  getDashboardStats,
} from "../services/adminService";

import Spinner from "../components/Spinner";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function AdminDashboard() {
  const { user } =
    useContext(AuthContext);

  const [stats, setStats] =
    useState(null);
  
  const COLORS = [
    "#f59e0b",
    "#10b981",
    "#3b82f6",
    "#ef4444",
    "#8b5cf6",
  ];
  useEffect(() => {
    const fetchStats =
      async () => {
        try {
          const data =
            await getDashboardStats(
              user.token
            );

          setStats(data);
        } catch (error) {
          console.log(error);
        }
      };

    if (user) {
      fetchStats();
    }
  }, [user]);

  if (!stats) {
    return <Spinner />;
  }

  return (
    <div
      className="
        max-w-7xl
        mx-auto
        px-8
        py-12
      "
    >
      <div className="mb-10">
        <h1
          className="
            text-5xl
            font-bold
            mb-3
          "
        >
          Admin Dashboard
        </h1>

        <p
          className="
            text-slate-400
          "
        >
          Monitor your store performance
        </p>
      </div>

      <div
        className="
          grid
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
        "
      >
        {/* Users */}

        <div
          className="
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            p-6
            hover:border-amber-500
            transition-all
          "
        >
          <div className="text-4xl mb-4">
            👤
          </div>

          <h3
            className="
              text-slate-400
              mb-2
            "
          >
            Users
          </h3>

          <p
            className="
              text-4xl
              font-bold
              text-amber-400
            "
          >
            {stats.users}
          </p>
        </div>

        {/* Products */}

        <div
          className="
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            p-6
            hover:border-amber-500
            transition-all
          "
        >
          <div className="text-4xl mb-4">
            📦
          </div>

          <h3
            className="
              text-slate-400
              mb-2
            "
          >
            Products
          </h3>

          <p
            className="
              text-4xl
              font-bold
              text-amber-400
            "
          >
            {stats.products}
          </p>
        </div>

        {/* Orders */}

        <div
          className="
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            p-6
            hover:border-amber-500
            transition-all
          "
        >
          <div className="text-4xl mb-4">
            🛒
          </div>

          <h3
            className="
              text-slate-400
              mb-2
            "
          >
            Orders
          </h3>

          <p
            className="
              text-4xl
              font-bold
              text-amber-400
            "
          >
            {stats.orders}
          </p>
        </div>

        {/* Revenue */}

        <div
          className="
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            p-6
            hover:border-amber-500
            transition-all
          "
        >
          <div className="text-4xl mb-4">
            💰
          </div>

          <h3
            className="
              text-slate-400
              mb-2
            "
          >
            Revenue
          </h3>

          <p
            className="
              text-4xl
              font-bold
              text-green-400
            "
          >
            ₹{stats.revenue}
          </p>
        </div>
      </div>

      {/* Quick Overview */}

      <div
        className="
          mt-10
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-8
        "
      >
        <h2
          className="
            text-2xl
            font-bold
            mb-6
          "
        >
          Store Overview
        </h2>

        <div
          className="
            grid
            md:grid-cols-3
            gap-6
          "
        >
          <div>
            <p className="text-slate-400">
              Average Revenue Per Order
            </p>

            <p
              className="
                text-2xl
                font-bold
                mt-2
              "
            >
              ₹
              {stats.orders > 0
                ? Math.round(
                    stats.revenue /
                      stats.orders
                  )
                : 0}
            </p>
          </div>

          <div>
            <p className="text-slate-400">
              Products Per User
            </p>

            <p
              className="
                text-2xl
                font-bold
                mt-2
              "
            >
              {stats.users > 0
                ? (
                    stats.products /
                    stats.users
                  ).toFixed(1)
                : 0}
            </p>
          </div>

          <div>
            <p className="text-slate-400">
              Order Volume
            </p>

            <p
              className="
                text-2xl
                font-bold
                mt-2
              "
            >
              {stats.orders}
            </p>
          </div>
        </div>
      </div>
      <div
        className="
          mt-10
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-8
        "
      >
        <h2
          className="
            text-2xl
            font-bold
            mb-6
          "
        >
          Revenue Trend
        </h2>

        <div
          style={{
            width: "100%",
            height: 350,
          }}
        >
          <ResponsiveContainer>
            <LineChart
              data={stats.monthlyRevenue}
            >
              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="month"
              />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#f59e0b"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        className="
          mt-10
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-8
        "
      >
        <h2
          className="
            text-2xl
            font-bold
            mb-6
          "
        >
          Recent Orders
        </h2>

        <div className="overflow-x-auto">
          <table
            className="
              w-full
              text-left
            "
          >
            <thead>
              <tr
                className="
                  border-b
                  border-slate-700
                "
              >
                <th className="pb-3">
                  Customer
                </th>

                <th className="pb-3">
                  Amount
                </th>

                <th className="pb-3">
                  Status
                </th>

                <th className="pb-3">
                  Paid
                </th>
              </tr>
            </thead>

            <tbody>
              {stats.recentOrders?.map(
                (order) => (
                  <tr
                    key={order._id}
                    className="
                      border-b
                      border-slate-800
                    "
                  >
                    <td className="py-4">
                      {
                        order.user?.name
                      }
                    </td>

                    <td className="py-4">
                      ₹
                      {
                        order.totalPrice
                      }
                    </td>

                    <td className="py-4">
                      {
                        order.status
                      }
                    </td>

                    <td className="py-4">
                      {order.isPaid
                        ? "✅"
                        : "❌"}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className="
          mt-10
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-8
        "
      >
        <h2
          className="
            text-2xl
            font-bold
            mb-6
          "
        >
          🏆 Top Selling Products
        </h2>

        <div className="space-y-4">
          {stats.topProducts?.map(
            (product, index) => (
              <div
                key={index}
                className="
                  flex
                  justify-between
                  items-center
                  bg-slate-800
                  rounded-lg
                  px-4
                  py-3
                "
              >
                <span>
                  #{index + 1}{" "}
                  {product.name}
                </span>

                <span
                  className="
                    text-amber-400
                    font-bold
                  "
                >
                  {product.sales} sold
                </span>
              </div>
            )
          )}
        </div>
      </div>

      <div
        className="
          mt-10
          bg-slate-900
          border
          border-slate-800
          rounded-2xl
          p-8
        "
      >
        <h2
          className="
            text-2xl
            font-bold
            mb-6
          "
        >
          Category Distribution
        </h2>

        <div
          style={{
            width: "100%",
            height: 350,
          }}
        >
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={
                  stats.categoryDistribution
                }
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {stats.categoryDistribution?.map(
                  (entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[
                          index %
                            COLORS.length
                        ]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip />

              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
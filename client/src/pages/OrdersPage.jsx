import { useEffect, useState } from "react";
import { useContext } from "react";

import {
  getMyOrders,
  downloadInvoice,
} from "../services/orderService";

import { AuthContext } from "../context/AuthContext";

function OrdersPage() {
  const { user } = useContext(AuthContext);

  const token = user?.token;

  const [orders, setOrders] =
    useState([]);

  const [selectedAddress, setSelectedAddress] =
  useState(null);
  
  const steps = [
    "Pending",
    "Paid",
    "Packed",
    "Shipped",
    "Out For Delivery",
    "Delivered",
  ];

  const handleInvoice =
    async (id) => {
      try {
        const blob =
          await downloadInvoice(
            id,
            token
          );

        const url =
          window.URL.createObjectURL(
            blob
          );

        const link =
          document.createElement(
            "a"
          );

        link.href = url;

        link.download =
          `invoice-${id}.pdf`;

        link.click();
      } catch (error) {
        console.log(error);

        alert(
          "Invoice download failed"
        );
      }
  };

  useEffect(() => {
    const fetchOrders =
      async () => {
        try {
          if (!token) return;

          const data =
            await getMyOrders(
              token
            );

          setOrders(data);
        } catch (error) {
          console.log(error);
        }
      };

    fetchOrders();
  }, [token]);

  return (
    <div
      className="
        max-w-7xl
        mx-auto
        px-8
        py-12
      "
    >
      <h1
        className="
          text-5xl
          font-bold
          mb-3
        "
      >
        My Orders
      </h1>

      <p
        className="
          text-slate-400
          mb-10
        "
      >
        Track and manage your orders
      </p>

      {orders.length === 0 ? (
        <div
          className="
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            p-12
            text-center
          "
        >
          <h2
            className="
              text-2xl
              font-semibold
            "
          >
            No Orders Found
          </h2>

          <p
            className="
              text-slate-400
              mt-3
            "
          >
            Start shopping to place
            your first order.
          </p>
        </div>
      ) : (
        <div
          className="
            grid
            md:grid-cols-2
            xl:grid-cols-3
            gap-6
          "
        >
          {orders.map((order) => (
            <div
              key={order._id}
              className="
                bg-slate-900
                border
                border-slate-800
                rounded-2xl
                p-6
                hover:border-amber-500
                hover:-translate-y-1
                transition-all
                duration-300
              "
            >
              <div
                className="
                  flex
                  justify-between
                  items-center
                  mb-4
                "
              >
                <h3
                  className="
                    text-xl
                    font-bold
                  "
                >
                  Order
                </h3>

                <span
                  className="
                    text-xs
                    text-slate-500
                  "
                >
                  #{order._id.slice(-6)}
                </span>
              </div>

              <p
                className="
                  text-3xl
                  font-bold
                  text-amber-400
                  mb-2
                "
              >
                ₹{order.totalPrice}
              </p>

              <p
                className="
                  text-slate-400
                  text-sm
                  mb-5
                "
              >
                {new Date(
                  order.createdAt
                ).toLocaleDateString()}
              </p>

              <div className="space-y-3">
                <p>
                  Status:{" "}
                  <span
                    className="
                      text-blue-400
                      font-semibold
                    "
                  >
                    {order.status}
                  </span>
                </p>

                <div className="mt-4">
                  <p className="mb-2 font-semibold">
                    Tracking
                  </p>

                  {steps.map((step) => (
                    <div
                      key={step}
                      className={
                        steps.indexOf(step) <=
                        steps.indexOf(
                          order.status
                        )
                          ? "text-green-400"
                          : "text-slate-500"
                      }
                    >
                      {steps.indexOf(step) <=
                      steps.indexOf(
                        order.status
                      )
                        ? "✓ "
                        : "○ "}
                      {step}
                    </div>
                  ))}
                </div>
                <p>
                  Payment:{" "}
                  <span
                    className={
                      order.isPaid
                        ? "text-green-400 font-semibold"
                        : "text-red-400 font-semibold"
                    }
                  >
                    {order.isPaid
                      ? "Paid"
                      : "Pending"}
                  </span>
                </p>

                <p>
                  Delivery:{" "}
                  <span
                    className={
                      order.isDelivered
                        ? "text-green-400 font-semibold"
                        : "text-yellow-400 font-semibold"
                    }
                  >
                    {order.isDelivered
                      ? "Delivered"
                      : "Processing"}
                  </span>
                </p>

                <p>
                  Items:{" "}
                  <span className="font-semibold">
                    {
                      order.orderItems
                        ?.length
                    }
                  </span>
                </p>

              </div>

              <button
                onClick={() =>
                  setSelectedAddress(
                    order.shippingAddress
                  )
                }
                className="
                  mt-4
                  w-full
                  bg-slate-700
                  hover:bg-slate-600
                  py-3
                  rounded-xl
                  font-semibold
                  transition
                "
              >
                View Address
              </button>

              <button
                onClick={() =>
                  handleInvoice(
                    order._id
                  )
                }
                className="
                  mt-6
                  w-full
                  bg-blue-600
                  hover:bg-blue-500
                  py-3
                  rounded-xl
                  font-semibold
                  transition
                "
              >
                Download Invoice
              </button>

              <div
                className="
                  border-t
                  border-slate-700
                  mt-6
                  pt-4
                "
              >
                <p
                  className="
                    text-slate-400
                    text-sm
                  "
                >
                  Order ID
                </p>

                <p
                  className="
                    text-xs
                    break-all
                    text-slate-500
                  "
                >
                  {order._id}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedAddress && (
        <div
          className="
            fixed
            inset-0
            bg-black/60
            flex
            items-center
            justify-center
            z-50
          "
        >
          <div
            className="
              bg-slate-900
              p-6
              rounded-2xl
              w-[90%]
              max-w-md
              border
              border-slate-700
            "
          >
            <h2
              className="
                text-2xl
                font-bold
                mb-4
                text-amber-400
              "
            >
              Delivery Address
            </h2>

            <p>
              {selectedAddress.fullName}
            </p>

            <p>
              +91 {selectedAddress.phone}
            </p>

            <p className="mt-2">
              {selectedAddress.address}
            </p>

            <p>
              {selectedAddress.city},
              {" "}
              {selectedAddress.state}
              {" - "}
              {selectedAddress.pincode}
            </p>

            <button
              onClick={() =>
                setSelectedAddress(
                  null
                )
              }
              className="
                mt-6
                w-full
                bg-red-600
                hover:bg-red-500
                py-3
                rounded-xl
                font-semibold
              "
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default OrdersPage;
import { useContext } from "react";
import { useEffect, useState } from "react";

import { AuthContext } from "../context/AuthContext";

import {
    getAllOrders,
    updateOrderStatus,
} from "../services/orderService";

import toast from "react-hot-toast";

function AdminOrdersPage() {
    const { user } =
        useContext(AuthContext);

    const [orders, setOrders] =
        useState([]);

    useEffect(() => {
        const fetchOrders =
        async () => {
            try {
            const data =
                await getAllOrders(
                user.token
                );

            setOrders(data);
            } catch (error) {
            console.log(error);
            }
        };

        fetchOrders();
    }, [user]);

    const handleStatusChange =
    async (
        id,
        status
    ) => {
        try {
        await updateOrderStatus(
            id,
            status,
            user.token
        );

        setOrders((prev) =>
            prev.map((order) =>
                order._id === id
                ? {
                    ...order,
                    status,
                    isPaid:
                        status === "Paid"
                        ? true
                        : order.isPaid,
                    isDelivered:
                        status === "Delivered"
                        ? true
                        : order.isDelivered,
                    }
                : order
            )
        );

        toast.success(
            "Status Updated"
        );
        } catch (error) {
        toast.error(
            "Failed to update status"
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
        <div className="mb-10">
        <h1
            className="
            text-5xl
            font-bold
            mb-3
            "
        >
            Manage Orders
        </h1>

        <p
            className="
            text-slate-400
            "
        >
            Track and manage customer orders
        </p>
        </div>

        {orders.length === 0 ? (
        <div
            className="
            bg-slate-900
            border
            border-slate-800
            rounded-2xl
            p-10
            text-center
            "
        >
            <h2 className="text-2xl">
            No Orders Found
            </h2>
        </div>
        ) : (
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
                    Order
                    </th>

                    <th className="p-4">
                    Customer
                    </th>

                    <th className="p-4">
                    Total
                    </th>

                    <th className="p-4">
                    Items
                    </th>

                    <th className="p-4">
                    Payment
                    </th>

                    <th className="p-4">
                    Delivery
                    </th>

                    <th className="p-4">
                    Actions
                    </th>
                </tr>
            </thead>

            <tbody>
                {orders.map((order) => (
                <tr
                    key={order._id}
                    className="
                        border-t
                        border-slate-800
                        hover:bg-slate-800
                        transition-all
                    "
                    >
                    <td className="p-4">
                        <div>
                        <p className="font-semibold">
                            #{order._id.slice(-6)}
                        </p>

                        <p
                            className="
                            text-xs
                            text-slate-500
                            "
                        >
                            {new Date(
                            order.createdAt
                            ).toLocaleDateString()}
                        </p>
                        </div>
                    </td>

                    <td className="p-4">
                        {order.user?.name}
                    </td>

                    <td
                        className="
                        p-4
                        text-amber-400
                        font-bold
                        "
                    >
                        ₹{order.totalPrice}
                    </td>

                    <td className="p-4">
                        {order.orderItems?.length || 0}
                    </td>

                    <td className="p-4">
                        {order.isPaid ? (
                        <span
                            className="
                            bg-green-900
                            text-green-400
                            px-3
                            py-1
                            rounded-full
                            text-sm
                            "
                        >
                            Paid
                        </span>
                        ) : (
                        <span
                            className="
                            bg-red-900
                            text-red-400
                            px-3
                            py-1
                            rounded-full
                            text-sm
                            "
                        >
                            Pending
                        </span>
                        )}
                    </td>

                    <td className="p-4">
                        {order.isDelivered ? (
                        <span
                        className="
                            bg-blue-900
                            text-blue-400
                            px-3
                            py-1
                            rounded-full
                            text-sm
                        "
                        >
                        {order.status}
                        </span>
                        ) : (
                        <span
                            className="
                            bg-yellow-900
                            text-yellow-400
                            px-3
                            py-1
                            rounded-full
                            text-sm
                            "
                        >
                            Processing
                        </span>
                        )}
                    </td>

                    <td className="p-4">
                        <select
                            value={order.status}
                            onChange={(e) =>
                            handleStatusChange(
                                order._id,
                                e.target.value
                            )
                            }
                            className="
                            bg-slate-800
                            px-3
                            py-2
                            rounded-lg
                            border
                            border-slate-700
                            "
                        >
                            <option value="Pending">
                            Pending
                            </option>

                            <option value="Paid">
                            Paid
                            </option>

                            <option value="Packed">
                            Packed
                            </option>

                            <option value="Shipped">
                            Shipped
                            </option>

                            <option value="Out For Delivery">
                            Out For Delivery
                            </option>

                            <option value="Delivered">
                            Delivered
                            </option>
                       </select>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        )}
    </div>
    );
}

export default AdminOrdersPage;
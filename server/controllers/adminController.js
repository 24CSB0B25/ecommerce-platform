const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

const getDashboardStats = async (
  req,
  res
) => {
  try {
    const users =
      await User.countDocuments();

    const products =
      await Product.countDocuments();

    const orders =
      await Order.countDocuments();

    const allOrders =
      await Order.find({});

    const revenue =
      allOrders.reduce(
        (acc, order) =>
          acc + order.totalPrice,
        0
      );

    const monthlyRevenueMap =
      {};

    allOrders.forEach(
      (order) => {
        const month =
          new Date(
            order.createdAt
          ).toLocaleString(
            "default",
            {
              month: "short",
            }
          );

        monthlyRevenueMap[
          month
        ] =
          (monthlyRevenueMap[
            month
          ] || 0) +
          order.totalPrice;
      }
    );

    const monthlyRevenue =
      Object.entries(
        monthlyRevenueMap
      ).map(
        ([month, revenue]) => ({
          month,
          revenue,
        })
      );

    const recentOrders =
      await Order.find({})
        .populate(
          "user",
          "name email"
        )
        .sort({
          createdAt: -1,
        })
        .limit(5);

    const salesMap = {};

      allOrders.forEach((order) => {
        order.orderItems.forEach((item) => {
          const productId =
            item.product.toString();

          salesMap[productId] =
            (salesMap[productId] || 0) +
            item.quantity;
        });
      });

      const allProducts =
        await Product.find({});

      const topProducts =
        allProducts
          .map((product) => ({
            name: product.name,
            sales:
              salesMap[
                product._id.toString()
              ] || 0,
          }))
          .sort(
            (a, b) =>
              b.sales - a.sales
          )
          .slice(0, 5);

    const categoryMap = {};

      allProducts.forEach((product) => {
        categoryMap[product.category] =
          (categoryMap[product.category] || 0) + 1;
      });

      const categoryDistribution =
        Object.entries(categoryMap).map(
          ([name, value]) => ({
            name,
            value,
          })
        );
    res.json({
      users,
      products,
      orders,
      revenue,
      monthlyRevenue,
      recentOrders,
      topProducts,
      categoryDistribution,
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};
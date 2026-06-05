import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OrdersPage from "./pages/OrdersPage";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminProductsPage from "./pages/AdminProductsPage";
import CreateProductPage from "./pages/CreateProductPage";
import EditProductPage from "./pages/EditProductPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import Footer from "./components/Footer";
import WishlistPage from "./pages/WishlistPage";
import ProfilePage from "./pages/ProfilePage";
import AdminCouponsPage from "./pages/AdminCouponsPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import CheckoutPage from "./pages/CheckoutPage";

function App() {
    return (
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={<HomePage />}
          />

          <Route
            path="/product/:id"
            element={
                <ProductPage />
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={
                <LoginPage />
            }
          />

          <Route
            path="/register"
            element={
                <RegisterPage />
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                  <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <AdminRoute> 
                  <AdminProductsPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/products/create"
            element={
              <AdminRoute>
                  <CreateProductPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/products/:id/edit"
            element={
              <AdminRoute>
                  <EditProductPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                  <AdminOrdersPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/coupons"
            element={
              <AdminRoute>
                  <AdminCouponsPage />
              </AdminRoute>
            }
          />

          <Route
            path="/forgot-password"
            element={
                <ForgotPasswordPage />
            }
          />

          <Route
            path="/reset-password/:token"
            element={
                <ResetPasswordPage />
            }
          />

          <Route
            path="/checkout-now/:id"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />

        </Routes>
        <Footer />
      </BrowserRouter>
    );
}

export default App;
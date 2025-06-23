import { Route } from "react-router-dom";
import HomePage from "../layout/HomePage";
import ProductDetails from "../products/ProductDetails";
import Login from "../auth/Login";
import Register from "../auth/Register";
import Profile from "../user/Profile";
import UpdateProfile from "../user/UpdateProfile";
import ProtectedRoute from "../auth/ProtectedRoute";
import Upload_Avatar from "../user/Upload_Avatar";
import UpdatePassword from "../user/UpdatePassword";
import ForgotPassword from "../auth/ForgotPassword";
import ResetPassword from "../auth/ResetPassword";
import Cart from "../Cart/Cart";
import Shipping from "../Cart/Shipping";
import Confirm_Order from "../Cart/Confirm_Order";
import Payment_Method from "../Cart/Payment_Method";
import MyOrders from "../order/MyOrders";
import OrderDetails from "../order/OrderDetails";
import Invoice from "../Invoice/Invoice"

const UserRoutes = () => {
  return (
    <>
      <Route path="/" element={<HomePage />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot_password" element={<ForgotPassword />} />
      <Route path="/password/reset/:token" element={<ResetPassword />} />

      <Route
        path="/user/Profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/update_profile"
        element={
          <ProtectedRoute>
            <UpdateProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/upload_Avatar"
        element={
          <ProtectedRoute>
            <Upload_Avatar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/update_password"
        element={
          <ProtectedRoute>
            <UpdatePassword />
          </ProtectedRoute>
        }
      />

      <Route path="/cart" element={<Cart />} />

      <Route
        path="/shipping"
        element={
          <ProtectedRoute>
            <Shipping />
          </ProtectedRoute>
        }
      />

      <Route
        path="/confirm_order"
        element={
          <ProtectedRoute>
            <Confirm_Order />
          </ProtectedRoute>
        }
      />

      <Route
        path="/payment_method"
        element={
          <ProtectedRoute>
            <Payment_Method />
          </ProtectedRoute>
        }
      />

      <Route
        path="/me/order"
        element={
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/me/order/:id"
        element={
          <ProtectedRoute>
            <OrderDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/invoice/order/:id"
        element={
          <ProtectedRoute>
            <Invoice />
          </ProtectedRoute>
        }
      />
    </>
  );
};

export default UserRoutes;

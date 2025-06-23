import { Route } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";
import Dashboard from "../admin/Dashboard";
import AdminProducts from "../admin/AdminProducts";
import CreateProduct from "../admin/CreateProduct";
import UpdateProduct from "../admin/UpdateProduct";
import Upload_Image from "../admin/Upload_Image";
import Orders from "../admin/Orders";
import Update_Order from "../admin/Update_Order";
import AllUser from "../admin/AllUser";
import Update_User from "../admin/Update_User";
import Reviews from "../admin/Reviews";

const AdminRoutes = () => {
  return (
    <>
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute admin={true}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute admin={true}>
            <AdminProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/new/product"
        element={
          <ProtectedRoute admin={true}>
            <CreateProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/product/:id"
        element={
          <ProtectedRoute admin={true}>
            <UpdateProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/product/:id/upload_images"
        element={
          <ProtectedRoute admin={true}>
            <Upload_Image />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute admin={true}>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders/:id"
        element={
          <ProtectedRoute admin={true}>
            <Update_Order />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute admin={true}>
            <AllUser />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/:id"
        element={
          <ProtectedRoute admin={true}>
            <Update_User />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reviews"
        element={
          <ProtectedRoute admin={true}>
            <Reviews />
          </ProtectedRoute>
        }
      />
    </>
  );
};

export default AdminRoutes;

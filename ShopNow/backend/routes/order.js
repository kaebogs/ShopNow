import express from "express";
import {
  authorizedRoles,
  isAuthenticatedUser,
} from "../middleware/authMiddleWare.js";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderDetails,
  getSales,
  myOrder,
  updateOrder,
} from "../controller/orderController.js";

const router = express.Router();

router.route("/orders/new").post(isAuthenticatedUser, createOrder);
router.route("/order/:id").get(isAuthenticatedUser, getOrderDetails);
router.route("/me/order").get(isAuthenticatedUser, myOrder);

router
  .route("/admin/get_sales")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getSales);

router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getAllOrders);

router
  .route("/admin/orders/:id")
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteOrder);

export default router;

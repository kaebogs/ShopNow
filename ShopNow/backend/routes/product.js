import express from "express";
import {
  canUserReview,
  createProductReview,
  deleteProduct,
  deleteProductImages,
  deleteReview,
  getAdminProducts,
  getProductDetails,
  getProductReviews,
  getProducts,
  newProduct,
  updateProduct,
  uploadProductImages,
} from "../controller/productController.js";

import {
  authorizedRoles,
  isAuthenticatedUser,
} from "../middleware/authMiddleWare.js";

const router = express.Router();

router.route("/products").get(getProducts);

router
  .route("/admin/products")
  .post(isAuthenticatedUser, authorizedRoles("admin"), newProduct)
  .get(isAuthenticatedUser, authorizedRoles("admin"), getAdminProducts);

router
  .route("/admin/products/:id/product_images")
  .put(isAuthenticatedUser, authorizedRoles("admin"), uploadProductImages);

router
  .route("/admin/products/:id/delete_image")
  .put(isAuthenticatedUser, authorizedRoles("admin"), deleteProductImages);

router.route("/products/:id").get(getProductDetails);

router
  .route("/products/:id")
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateProduct);

router
  .route("/admin/products/:id")
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteProduct);

router
  .route("/reviews")
  .put(isAuthenticatedUser, createProductReview)
  .get(isAuthenticatedUser, getProductReviews);

router
  .route("/admin/reviews")
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteReview);

router.route("/can_review").get(isAuthenticatedUser, canUserReview);

export default router;

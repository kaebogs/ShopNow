import express from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  forgotPassword,
  resetPassword,
  getCurrentUserProfile,
  updatePassword,
  updateProfile,
  getAllUsers,
  getUserDetails,
  updateUser,
  deleteUser,
  upload_Avatar,
} from "../controller/authController.js";
import {
  authorizedRoles,
  isAuthenticatedUser,
} from "../middleware/authMiddleWare.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

router.route("/user").get(isAuthenticatedUser, getCurrentUserProfile);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/user/updateProfile").put(isAuthenticatedUser, updateProfile);
router.route("/user/upload_Avatar").put(isAuthenticatedUser, upload_Avatar);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getAllUsers);

router
  .route("/admin/users/:id")
  .get(isAuthenticatedUser, authorizedRoles("admin"), getUserDetails)
  .put(isAuthenticatedUser, authorizedRoles("admin"), updateUser)
  .delete(isAuthenticatedUser, authorizedRoles("admin"), deleteUser);


export default router;

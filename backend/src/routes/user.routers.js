import { Router } from "express";
import { 
  registerUser,loginUser,
  logoutUser, refreshAccessToken, 
  changeCurrentPassword, getCurrentUser,
  updateAccountDetails
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middlewares.js";
import {verifyJWT} from "../middleware/auth.middlewares.js"

const router = Router()

router.route("/register").post( upload.none(),registerUser)

router.route("/login").post(loginUser)

// //secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken )
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)


export default router
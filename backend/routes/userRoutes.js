import express from "express"
import { changePassword, createNotes, deleteNote, editNote, forgotPassword, getNotes, loginUser, logoutUser, registerUser, rememberSession, verification, verifyOtp } from "../controllers/userController.js"
import { isAuthenticated } from "../middleware/isAuthenticated.js"
import { userSchema, validateUser } from "../validators/userValidate.js"
import multer from "multer"

const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: { filesize: 5 * 1024 * 1024 }
});

router.post("/register", validateUser(userSchema), registerUser)
router.post("/verify", verification)
router.post("/login", loginUser)
router.get("/profile",isAuthenticated, rememberSession)
router.post("/logout", isAuthenticated, logoutUser)
router.post("/forgot-password", forgotPassword)
router.post("/verify-otp/:email", verifyOtp)
router.post("/change-password/:email", changePassword)

// Notes Routes
router.post("/notes", upload.single('image'), createNotes)
router.post("/getnotes", getNotes)
router.delete("/notes/:id", deleteNote)
router.post("/notes/:id", upload.single('image'), editNote)

export default router
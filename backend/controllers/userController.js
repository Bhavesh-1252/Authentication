import { verifyMail } from "../emailVerify/verifyMail.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";
import { Session } from "../models/sessionModel.js";
import { sentOtpMail } from "../emailVerify/sendOtpMail.js";
import { Notes } from "../models/notesModel.js"

export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        });
        const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, { expiresIn: "10m" })
        newUser.token = token
        await newUser.save()

        const mailVerify = verifyMail(token, email) // sending mail to the user to verify
        console.log(mailVerify);
        
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: newUser
        })

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const verification = async (req, res) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authorization token is missing or invalid"
            })
        }

        const token = authHeader.split(" ")[1];

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.SECRET_KEY)
        }
        catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(400).json({
                    success: false,
                    message: "The registration token has expired"
                })
            }

            return res.status(400).json({
                success: false,
                message: "Token verification failed"
            })
        }

        const user = await User.findById(decoded.id)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        user.token = null;
        user.isVerified = true;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized access"
            })
        }

        const passwordCheck = await bcrypt.compare(password, user.password);
        if (!passwordCheck) {
            res.status(402).json({
                success: false,
                message: "Incorrect password"
            })
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Verify your account"
            })
        }

        // Check for existing session and delete it
        const existingSession = await Session.findOne({ userId: user._id });
        if (existingSession) {
            await Session.deleteOne({ userId: user._id });
        }

        // Create a new session
        await Session.create({ userId: user._id })

        // Generate Tokens
        const accessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "10d" });
        const referenceToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "30d" });

        user.isLoggedIn = true;
        await user.save();

        return res.status(201).json({
            success: true,
            message: `Welcome Back ${user.username}`,
            accessToken,
            referenceToken,
            user
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const rememberSession = async (req, res) => {
    const user = await User.findById(req.userId);
    return res.status(201).json({
        success: true,
        message: `Welcome Back ${user.username}`,
        user
    })
}

export const logoutUser = async (req, res) => {
    try {
        const userId = req.userId
        await Session.deleteMany({ userId });
        await User.findByIdAndUpdate(userId, { isLoggedIn: false });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 10 * 60 * 1000);

        user.otp = otp;
        user.otpExpiry = expiry;
        await user.save();
        await sentOtpMail(email, otp);
        return res.status(200).json({
            success: true,
            message: "OTP sent successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const verifyOtp = async (req, res) => {
    const { otp } = req.body;
    const email = req.params.email

    if (!otp) {
        return res.status(400).json({
            success: false,
            message: "OTP is required"
        })
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }

        if (!user.otp || !user.otpExpiry) {
            return res.status(400).json({
                success: false,
                message: "OTP not generated or already verified"
            })
        }

        if (user.otpExpiry < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new one"
            })
        }

        if (otp !== user.otp) {
            return res.status(400).json({
                success: false,
                message: "Incorrect OTP"
            })
        }

        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Sever Erro"
        })
    }
}

export const changePassword = async (req, res) => {
    const { newPassword, confirmPassword } = req.body;
    const email = req.params.email;

    if (!newPassword || !confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Password do not match"
        })
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            success: false,
            message: "Password changed successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}


// Controllers for Notes
export const createNotes = async (req, res) => {

    try {
        const { title, description, userId } = req.body;
        const image = req.file;
        if (!title && !description && !image) {
            return res.status(400).json({
                success: false,
                message: "Provide a title, description or an image"
            })
        }

        const noteData = { title, description, userId };
        if (image) {
            noteData.image = {
                name: image.originalname,
                data: image.buffer,
                contentType: image.mimetype
            }
        }

        const newNote = await Notes.create(noteData);

        return res.status(201).json({
            success: true,
            message: "Note created successfully",
            noteId: newNote._id
        })


    } catch (error) {
        console.log("Error creating note:", error)
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

export const getNotes = async (req, res) => {
    try {
        const { user } = req.body;
        const documents = await Notes.find({ userId: user._id })
        if (documents.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Nothing to show!"
            })
        }

        return res.status(200).json({
            success: true,
            data: documents,
            counts: documents.length
        });

    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

export const deleteNote = async (req, res) => {
    const { id } = req.params

    try {
        const note = await Notes.findOneAndDelete({ _id: id })
        if (!note) {
            return res.status(400).json({
                success: false,
                message: "Unable to find the note"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Note Deleted Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.response?.data?.message
        })
    }
}

export const editNote = async (req, res) => {

    try {
        const { id } = req.params;
        const { title, description, userId } = req.body;
        const image = req.file
        if (!title && !description && !image) {
            return res.status(400).json({
                success: false,
                message: "Provide a title, description or an image"
            })
        }

        const noteData = { title, description, userId };
        if (image) {
            noteData.image = {
                name: image.originalname,
                contentType: image.mimetype,
                data: image.buffer
            }
        }

        const note = await Notes.findByIdAndUpdate(id, noteData)
        if (!note) {
            return res.status(401).json({
                success: false,
                message: "Server error!"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Note Updated Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.response?.data?.message
        })
    }
}
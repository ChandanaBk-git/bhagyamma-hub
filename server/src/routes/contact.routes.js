
const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body || {};

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof subject !== "string" ||
            typeof message !== "string" ||
            !name.trim() ||
            !email.trim() ||
            !subject.trim() ||
            !message.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields.",
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address.",
            });
        }

        if (
            name.length > 100 ||
            email.length > 254 ||
            subject.length > 200 ||
            message.length > 5000
        ) {
            return res.status(400).json({
                success: false,
                message: "One or more fields are too long.",
            });
        }

        if (
            !process.env.GMAIL_USER ||
            !process.env.GMAIL_APP_PASSWORD
        ) {
            return res.status(500).json({
                success: false,
                message: "Email service is not configured.",
            });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD.replace(/\s/g, ""),
            },
        });

        await transporter.sendMail({
            from: `"Bhagyamma Hub Website" <${process.env.GMAIL_USER}>`,
            to: process.env.CONTACT_RECEIVER || process.env.GMAIL_USER,
            replyTo: email.trim(),
            subject: `Contact Form: ${subject.trim()}`,
            text: [
                `Name: ${name.trim()}`,
                `Email: ${email.trim()}`,
                `Subject: ${subject.trim()}`,
                "",
                "Message:",
                message.trim(),
            ].join("\n"),
        });

        return res.status(200).json({
            success: true,
            message: "Your message has been sent successfully.",
        });
    } catch (error) {
        console.error("Contact email error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to send your message right now. Please try again.",
        });
    }
});

module.exports = router;

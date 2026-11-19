const User = require('../models/User');

const addUser = async (req, res) => {
    const { email, name } = req.body;

    if (!email?.trim() || !name?.trim()) {
        return res.status(400).json({ error: "Email or name is not specified" });
    }

    try {
        const existingUser = await User.getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: "A user with this email already exists" });
        }
        const userCreated = await User.create(email, name);
        if (userCreated) {
            res.json({ message: "New user created successfully" });
        } else {
            res.status(500).json({ error: "Error creating user" });
        }
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ error: "Server error" });
    }
};

const getUserByEmail = async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: "Email is not specified" });
    }

    try {
        const user = await User.getUserByEmail(email);
        if (user) {
            res.json({ id: user.id, isAdmin: user.isAdmin });
        } else {
            res.status(404).json({ error: "User not found" });
        }
    } catch (error) {
        console.error("Error fetching user ID:", error);
        res.status(500).json({ error: "Server error" });
    }
};


module.exports = { addUser, getUserByEmail };

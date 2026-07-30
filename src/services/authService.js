const User = require("../models/User");
const bcrypt = require("bcrypt");

const register = async (userData) => {
    const { name, email, password } = userData;

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new Error("Email already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    // Return user without password
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
};

module.exports = {
    register,
};
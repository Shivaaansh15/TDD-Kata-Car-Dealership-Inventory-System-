const User = require("../models/User");
const bcrypt = require("bcrypt");

const register = async (userData) => {
    const { name, email, password } = userData;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    };
};

module.exports = {
    register
};
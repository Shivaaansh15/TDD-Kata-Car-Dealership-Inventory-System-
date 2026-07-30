const authService = require("../services/authService");

const register = async (req, res) => {
    try {

        const user = await authService.register(req.body);

        return res.status(201).json({
            success: true,
            user,
        });

    } catch (error) {
        console.error("❌ Registration Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const login = async (req, res) => {
    try {
        return res.status(501).json({
            success: false,
            message: "Login not implemented yet",
        });
    } catch (error) {
        console.error("❌ Login Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    register,
    login,
};
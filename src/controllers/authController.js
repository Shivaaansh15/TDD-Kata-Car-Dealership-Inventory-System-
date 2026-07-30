const authService = require("../services/authService");

const register = async (req, res) => {
    try {
        const user = await authService.register(req.body);

        return res.status(201).json({
            success: true,
            user,
        });

    } catch (error) {

        if (error.message === "Email already exists") {
            return res.status(409).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const login = async (req, res) => {
    return res.status(501).json({
        success: false,
        message: "Login not implemented yet",
    });
};

module.exports = {
    register,
    login,
};
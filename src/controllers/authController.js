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
    try {
        const data = await authService.login(req.body);

        return res.status(200).json({
            success: true,
            token: data.token,
            user: data.user,
        });

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    register,
    login,
};
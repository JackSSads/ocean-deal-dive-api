const router = require("express").Router();
const logger = require("../../../logger");
const AuthService = require("../../services/authService");

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    logger.info(`Login attempt for email: ${email}`);

    try {
        const { token, user } = await AuthService.login(email, password);

        logger.info(`Login successful for user: ${user.user_id}`);

        return res.status(200).send({
            message: "Login realizado com sucesso.",
            token: token,
            user_id: user.user_id,
            status: true
        });
    } catch (error) {
        logger.error(`Login failed for email: ${email}`, error);
        return res.status(500).send({ message: "Erro ao realizar login.", status: false });
    };
});

router.post("/logout", async (req, res) => {
    const { user_id } = req.body;

    logger.info(`Logout attempt for user_id: ${user_id}`);

    try {
        await AuthService.logout(user_id);
        
        logger.info(`Logout successful for user_id: ${user_id}`);
        
        res.status(201).send({ message: "Até a próxima!", status: true });
    } catch (error) {
        logger.error(`Logout failed for user_id: ${user_id}`, error);
        return res.status(500).send({ message: "Erro ao realizar logout.", status: false });
    };
});

module.exports = router;
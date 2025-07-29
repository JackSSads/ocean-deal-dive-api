const router = require("express").Router();
const logger = require("../../../logger");
const UserService = require("../../services/userService");

router.get("/", async (req, res) => {
    logger.info("GET /user - Fetching all users");
    
    try {
        const result = await UserService.service_query_select_all();
        logger.info(`GET /user - Successfully fetched ${result.length || 0} users`);
        res.status(200).send(result);
    } catch (error) {
        logger.error("GET /user - Error fetching users:", error);
        res.status(500).send({ message: "Erro ao buscar os usuário", status: false });
    };
});

router.get("/:user_id", async (req, res) => {
    const { user_id } = req.params;
    
    logger.info(`GET /user/${user_id} - Fetching user by ID`);

    try {
        const result = await UserService.service_query_select_by_id(user_id);
        logger.info(`GET /user/${user_id} - Successfully fetched user`);
        res.status(200).send(result);
    } catch (error) {
        logger.error(`GET /user/${user_id} - Error fetching user:`, error);
        res.status(500).send({ message: "Erro ao buscar os usuários", status: false });
    };
});

router.post("/", async (req, res) => {
    const { username, email, password } = req.body;
    
    logger.info("POST /user - Creating new user", { username, email });

    try {
        const data = { username, email, password };

        await UserService.service_query_insert_user(data);
        logger.info(`POST /user - User "${username}" created successfully`);
        res.status(201).send({ message: "Usuário criado com sucesso", status: true });
    } catch (error) {
        logger.error("POST /user - Error creating user:", error);
        res.status(500).send({ message: "Erro ao criar o usuário", status: false });
    };
});

router.put("/:user_id", async (req, res) => {
    const { user_id } = req.params;
    const { username, email, password } = req.body;
    
    logger.info(`PUT /user/${user_id} - Updating user`, { username, email});

    try {
        let data = { username, email, password };

        await UserService.service_query_update_user_by_id(user_id, data);
        logger.info(`PUT /user/${user_id} - User updated successfully`);
        res.status(200).send({ message: "Usuário atualizado com sucesso", status: true });
    } catch (error) {
        logger.error(`PUT /user/${user_id} - Error updating user:`, error);
        res.status(500).send({ message: "Erro ao atualizar o usuário", status: false });
    };
});

router.delete("/:user_id", async (req, res) => {
    const { user_id } = req.params;
    
    logger.info(`DELETE /user/${user_id} - Deleting user`);

    try {
        await UserService.service_query_delete_user_by_id(user_id);
        logger.info(`DELETE /user/${user_id} - User deleted successfully`);
        res.status(200).send({ message: "Usuário deletado com sucesso", status: true });
    } catch (error) {
        logger.error(`DELETE /user/${user_id} - Error deleting user:`, error);
        res.status(500).send({ message: "Erro ao deletar o usuário.", status: false });
    };
});

module.exports = router;
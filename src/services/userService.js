const logger = require("../../logger");
const {
    query_select_all, query_select_by_id, query_select_by_email,
    query_delete_user_by_id, query_insert_user,
    query_update_user_by_id
} = require("../repositores/query_user");
const { hashSync } = require("bcrypt");

class UserService {
    async service_query_select_all() {
        logger.info("UserService: Fetching all users");
        
        try {
            const result = await query_select_all();
            logger.info(`UserService: Successfully fetched ${result.length || 0} users`);
            return result;
        } catch (error) {
            logger.error("UserService: Error fetching all users", { error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_select_by_id(user_id) {
        logger.info("UserService: Fetching user by ID", { user_id });
        
        try {
            const result = await query_select_by_id(user_id);
            if (!result) {
                logger.warn("UserService: User not found", { user_id });
                return { status: 404, message: "user not found." };
            };
            logger.info("UserService: Successfully fetched user by ID", { user_id });
            return result;
        } catch (error) {
            logger.error("UserService: Error fetching user by ID", { user_id, error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_insert_user(data) {
        logger.info("UserService: Creating new user", { username: data.username, email: data.email });
        
        try {
            const check_if_email_exists = await query_select_by_email(data.email);

            if (check_if_email_exists[0]) {
                logger.error("UserService: Email already exists", { email: data.email });
                return { status: 409, message: "email already exists." };
            }

            data.password = hashSync(data.password, 10);
            const result = await query_insert_user(data);
            logger.info("UserService: User created successfully", { username: data.username, email: data.email });
            return result;
        } catch (error) {
            logger.error("UserService: Error creating user", { username: data.username, email: data.email, error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_update_user_by_id(user_id, data) {
        logger.info("UserService: Updating user by ID", { user_id, username: data.username, email: data.email });

        try {
            const user_if_exists = await query_select_by_id(user_id);

            if (!user_if_exists[0]?.user_id) {
                logger.error("UserService: User not found for update", { user_id });
                return { status: 404, message: "user not found." };
            };

            const check_if_email_exists = await query_select_by_email(data.email);

            if (check_if_email_exists[0] && check_if_email_exists[0].user_id !== Number(user_id)) {
                logger.error("UserService: Email already exists for different user", { email: data.email, user_id });
                return { status: 409, message: "E-mail already exists." };
            };

            data.password = hashSync(data.password, 10);

            const result = await query_update_user_by_id(user_id, data);
            logger.info("UserService: User updated successfully", { user_id });
            return result;
        } catch (error) {
            logger.error("UserService: Error updating user by ID", { user_id, error: error.message });
            throw new Error(error.message);
        };
    };

    async service_query_delete_user_by_id(user_id) {
        logger.info("UserService: Deleting user by ID", { user_id });

        try {
            const user_if_exists = await query_select_by_id(user_id);

            if (!user_if_exists[0]?.user_id) {
                logger.warn("UserService: User not found for deletion", { user_id });
                return { status: 404, message: "user not found." };
            }

            const result = await query_delete_user_by_id(user_id);
            logger.info("UserService: User deleted successfully", { user_id });
            return result;
        } catch (error) {
            logger.error("UserService: Error deleting user by ID", { user_id, error: error.message });
            throw new Error(error.message);
        };
    };
};

module.exports = new UserService();
const AuthService = require("../services/authService");
const logger = require("../../logger");

class Authentication {
    async isAuthenticated (req, res, next) {
        const header = req.headers;
        const clientIP = req.ip || req.connection.remoteAddress;
        const userAgent = req.get('User-Agent');
    
        logger.auth("Tentativa de autenticação", {
            clientIP,
            userAgent: userAgent ? userAgent.substring(0, 100) : 'Unknown',
        });
    
        try {
            const auth = await this.authenticationUser(header);
    
            if (auth?.user_id) {
                req.user_id = auth.user_id;
                
                logger.auth("Usuário autenticado com sucesso", {
                    user_id: auth.user_id,
                    clientIP
                });
                return next();
            };
    
            logger.security("Acesso negado - autenticação falhou", {
                clientIP,
                userAgent: userAgent ? userAgent.substring(0, 100) : 'Unknown'
            });
            return res.status(401).json({ 
                message: "Acesso negado. Faça login.", 
                status: false 
            });
        } catch (error) {
            logger.error("Erro durante autenticação", {
                error: error.message,
                clientIP,
                userAgent: userAgent ? userAgent.substring(0, 100) : 'Unknown'
            });
            return res.status(500).json({ 
                message: "Erro interno do servidor", 
                status: false 
            });
        };
    };

    async authenticationUser(headers) {
        logger.info("Authentication attempt for user");
        
        const authHeader = headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            logger.warn("User authentication failed: Invalid or missing authorization header");
            return { message: "Token não fornecido ou inválido.", status: false };
        };

        const token = authHeader.split(" ")[1];
        logger.info("User authentication: Token extracted, verifying...");

        try {
            const result = await AuthService.authenticateUser(token);
            
            if (result?.user_id) {
                logger.info(`User authentication successful for user_id: ${result.user_id}`);
                return { status: true, user_id: result.user_id };
            } else {
                logger.warn("User authentication failed: Invalid token or user not found");
                return { status: false };
            }
        } catch (error) {
            logger.error("User authentication error during token verification:", error);
            return { message: "Erro na autenticação.", status: false };
        };
    };
};

module.exports = new Authentication;
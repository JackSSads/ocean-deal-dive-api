const express = require("express");
const app = express();
const cors = require("cors");
const logger = require("./logger");
const Authentication = require("./src/resources/isAtuthenticaded");

require("dotenv").config();

app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));

app.use(cors({
    origin: [process.env.URL_FRONT],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

const authRouter = require("./src/api/router/auth");
const userRouter = require("./src/api/router/user");
const tourRouter = require("./src/api/router/tour");

const isAuthenticated = Authentication.isAuthenticated;

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/tour", tourRouter);

app.listen(process.env.PORT_BACK, () => {
    logger.info(`Servidor iniciado na porta ${process.env.PORT_BACK}`);
});

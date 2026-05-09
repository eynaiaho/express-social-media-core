const path = require("path");
require("dotenv").config({path: path.resolve(__dirname, "../.env")})

const express = require("express");
const app = express();
const cors = require("cors");

const cookieParser = require("cookie-parser");

const authRouter = require("./routes/v1/auth.route");

const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use("/api/v1/auth", authRouter);


app.use((err, req, res, next) => {
    console.error(err)
    const status = err.status || 500;
    const message = err.message || "Sunucu Hatası";

    return res.status(status).json({
        success: false,
        message
    })
})

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sunucu: localhost:${PORT} üzerinde yayında.`);
})
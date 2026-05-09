const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const {v4: uuidv4} = require("uuid");

const refreshKey = process.env.REFRESH_SECRET;
const accessKey = process.env.JWT_SECRET;

const createAccessToken = (user, sid, time) => {
    return jwt.sign(
        {
            sub: user.id,
            roles: user.role,
            sid: sid,
            jti: uuidv4(),
            iss: process.env.APP_ISS,
            aud: process.env.APP_AUD,
        },
        accessKey,
        {expiresIn: time||"15m"}
    )
}

const createRefreshToken = () => {
    return crypto.randomBytes(64).toString("hex");
}

const createVerifyToken = () => {
    return crypto.randomBytes(32).toString("hex");
}

const hashRefreshToken = (token) => {
    return crypto.createHmac("sha256", refreshKey).update(token).digest("hex");
}

const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
}

module.exports = {createAccessToken, createRefreshToken, createVerifyToken, hashRefreshToken, hashToken}
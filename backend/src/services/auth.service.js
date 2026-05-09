const bcrypt = require("bcrypt");
const pool = require("../config/db");
const UserModel = require("../models/user.model");
const SessionModel = require("../models/session.model");
const {v4: uuidv4} = require("uuid");
const { createAccessToken, createRefreshToken, hashRefreshToken } = require("../utils/tokens.util");

const SALT_ROUNDS = 12;

const register = async ({username, display_name, password, email}, meta) => {
    const hasEmail = await UserModel.findByEmail(email);
    if(hasEmail) throw { status: 409, message: "Bu email zaten kullanılıyor" }
    const hasUsername = await UserModel.findByUsername(username);
    if(hasUsername) throw { status: 409, message: "Bu kullanıcı ismi zaten kullanılıyor" }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const refreshToken = createRefreshToken();
    const token_hash = hashRefreshToken(refreshToken);
    const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const userId = await UserModel.create({username, display_name, email, password_hash}, conn);
        const user = {id: userId, role: "user"};
        const sid = uuidv4();
        const accessToken = createAccessToken(user, sid);

        await SessionModel.create({user_id: userId, token_hash, ip_address: meta.ipAddress, user_agent: meta.userAgent, expires_at}, conn);

        await conn.commit();
        return {accessToken, refreshToken};
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
}

const login = async ({email, password}, meta) => {
    const user = await UserModel.findByEmail(email);
    if(!user) throw { status: 401, message: "Email veya şifre hatalı" }
    if(user.is_banned) throw { status: 401, message: "Hesabınız askıya alınmış" }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if(!isMatch) throw { status: 401, message: "Email veya şifre hatalı" }

    const refreshToken = createRefreshToken();
    const token_hash = hashRefreshToken(refreshToken);
    const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const sid = uuidv4();
    const accessToken = createAccessToken(user, sid);

    await SessionModel.create({user_id: user.id, token_hash, ip_address: meta.ipAddress, user_agent: meta.userAgent, expires_at});

    return {accessToken, refreshToken}
}

const refresh = async ({refreshToken}, meta) => {
    const token_hash = hashRefreshToken(refreshToken);

    const session = await SessionModel.findByTokenHash(token_hash);
    if(!session) throw { status: 401, message: "Geçersiz ya da süresi dolmuş token" }
    const is_expires = session.expires_at < Date.now();
    if (session.is_revoked || is_expires) throw { status: 401, message: "Geçersiz ya da süresi dolmuş token" }

    const user = await UserModel.findById(session.user_id);
    if(!user || user.is_banned) throw { status: 401, message: "Yetkisiz Erişim" }

    const newRefreshToken = createRefreshToken();
    const newToken_hash = hashRefreshToken(newRefreshToken);
    const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const sid = uuidv4();
    const accessToken = createAccessToken(user, sid);

    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        await SessionModel.revokeByTokenHash(token_hash);
        await SessionModel.create({user_id: user.id, token_hash: newToken_hash, ip_address: meta.ipAddress, user_agent: meta.userAgent, expires_at}, conn);
        
        await conn.commit();
        return { accessToken, refreshToken: newRefreshToken }
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        await conn.release();
    }
}

const logout = async ({refreshToken}) => {
    const token_hash = hashRefreshToken(refreshToken);
    await SessionModel.deleteByTokenHash(token_hash);
}

module.exports = { register, login, refresh, logout }
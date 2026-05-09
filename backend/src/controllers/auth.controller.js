const authService = require("../services/auth.service");

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
}

const getMeta = (req) => {
    return {
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"]
    }
}

const register = async (req, res, next) => {
    try {
        const meta = getMeta(req);

        const { accessToken, refreshToken } = await authService.register( req.body, meta );
    
        res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

        res.status(201).json({status: 201, success: true, message: 'Kullanıcı başarıyla kayıt oldu', data: accessToken})
    } catch (err) {
        next(err)
    }
}

const login = async (req, res, next) => {
    try {
        const meta = getMeta(req)

        const { accessToken, refreshToken } = await authService.login( req.body, meta );

        res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

        res.status(200).json({status: 200, success: true, message: 'Kullanıcı başarıyla giriş yaptı', data: accessToken})
    } catch (err) {
        next(err)
    }
}

const refresh = async (req, res, next) => {
    try {
        const currentRefreshToken = req.cookies?.refreshToken;
        if(!currentRefreshToken) return next({ status: 401, message: "Token bulunamadı" })

        const meta = getMeta(req)

        const {accessToken, refreshToken} = await authService.refresh( { refreshToken: currentRefreshToken }, meta );
        res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
        res.status(200).json({status: 200, success: true, data: accessToken})
    } catch (err) {
        next(err)
    }
}

const logout = async (req, res, next) => {
    try {
        const currentRefreshToken = req.cookies?.refreshToken;
        await authService.logout({refreshToken: currentRefreshToken});
        res.clearCookie("refreshToken");
        res.status(200).json({status: 200, success: true, message: "Başarıyla çıkış yapıldı"});
    } catch (err) {
        next(err)
    }
}

module.exports = {register, login, refresh, logout}
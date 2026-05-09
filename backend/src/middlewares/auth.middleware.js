const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const verifyToken = async (req, res, next) => {
    const header = req.headers?.authorization;
    if(!header || !header.startsWith("Bearer ")) return next( { status: 401, success: false, message: "Geçersiz veya süresi dolmuş token" } );
    const accessToken = header.split(" ")[1];

    try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        const user = await userModel.findById(session.user_id);
        if(!user || user.is_banned) return next( { status: 401, success: false, message: "Geçersiz veya süresi dolmuş token" } );
        req.user = { id: decoded.sub, role: decoded.roles };
        next();
    } catch (err) {
        return next( { status: 401, success: false, message: "Geçersiz veya süresi dolmuş token" } )
    }
}

module.exports = verifyToken;
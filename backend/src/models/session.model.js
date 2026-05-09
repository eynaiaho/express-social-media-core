const pool = require("../config/db");

const SessionModel = {
    create: async ({user_id, token_hash, ip_address, user_agent, expires_at}) => {
        const [result] = await pool.query("INSERT INTO sessions(user_id, token_hash, ip_address, user_agent, expires_at) VALUES(?, ?, ?, ?, ?)",[user_id, token_hash, ip_address, user_agent, expires_at]);
        return result.insertId;
    },
    findByTokenHash: async (token_hash) => {
        const [rows] = await pool.query("SELECT * FROM sessions WHERE token_hash = ?",[token_hash]);
        return rows[0] || null;
    },
    findByUserId: async (user_id) => {
        const [rows] = await pool.query("SELECT * FROM sessions WHERE user_id = ?",[user_id]);
        return rows[0] || null;
    },

    deleteByTokenHash: async (token_hash) => {
        await pool.query("DELETE FROM sessions WHERE token_hash = ?",[token_hash]);
    },
    deleteAllByUserId: async (user_id) => {
        await pool.query("DELETE FROM sessions WHERE user_id = ?",[user_id]);
    },
    revokeByTokenHash: async (token_hash) => {
        await pool.query("UPDATE sessions SET is_revoked = true WHERE token_hash = ?",[token_hash]);
    },
    revokeAllByUserId: async (user_id) => {
        await pool.query("UPDATE sessions SET is_revoked = true WHERE user_id = ?",[user_id]);
    }
}

module.exports = SessionModel;
const pool = require("../config/db");

const UserModel = {
    findByEmail: async (email) => {
        const [rows] = await pool.query("SELECT * FROM users WHERE email = ?",[email]);
        return rows[0] || null;
    },
    findByUsername: async (username) => {
        const [rows] = await pool.query("SELECT * FROM users WHERE username = ?",[username]);
        return rows[0] || null;
    },
    findById: async (id) => {
        const [rows] = await pool.query("SELECT * FROM users WHERE id = ?",[id]);
        return rows[0] || null;
    },
    create: async ({username, display_name, email, password_hash}) => {
        const [result] = await pool.query("INSERT INTO users(username, display_name, email, password_hash) VALUES(?, ?, ?, ?)",[username, display_name, email, password_hash]);
        return result.insertId;
    }
}

module.exports = UserModel;
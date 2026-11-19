const db = require('../db');

class User {

    static async getUserByEmail(email) {
        const { rows } = await db.query(
            'SELECT id, is_admin AS "isAdmin" FROM users WHERE email = $1',
            [email]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    static async create(email, name) {
        const { rowCount } = await db.query(
            'INSERT INTO users (email, name) VALUES ($1, $2)',
            [email, name]
        );

        return rowCount > 0;
    }
}

module.exports = User;

import promisePool from "../../utils/database.js";

const postRegisterUser = async (user) => {
    try {
        const {name, username, password, role} = user;
        const sql = `INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, ?)`;
        const params = [name, username, password, role];
        const [result] = await promisePool.execute(sql, params);
        return {user_id: result.insertId};
    } catch (error) {
        console.log(error);
    }
};

const isUsernameAvailable = async (username) => {
    const [response] = await promisePool.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
    );
    return response.length === 0;
};

const getUserByUsername = async (user) => {
    const sql = "SELECT * FROM users WHERE username = ?";
    const [rows] = await promisePool.execute(sql, [user]);
    if (rows.length === 0) return false;
    return rows[0];
};
const saveProfilePicturePath = async (clientId, filePath) => {
    try {
        const sql = `UPDATE clients SET profilePicture = ? WHERE id = ?`;
        await promisePool.execute(sql, [filePath, clientId]);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export {postRegisterUser, isUsernameAvailable, getUserByUsername, saveProfilePicturePath};


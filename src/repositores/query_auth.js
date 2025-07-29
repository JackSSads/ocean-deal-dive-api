const pool = require("../../db/conn");

const query_auth_verify_if_user_exists = (email) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * FROM aqua_dive.user u
            WHERE u.email = ?`;
        pool.query(sql, [email], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0]);
            };
        });
    });
};

const query_auth_verify_if_user_exists_by_id = (id) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT user_id FROM aqua_dive.user u
            WHERE u.user_id = ?`;
        pool.query(sql, [id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0]);
            };
        });
    });
};

module.exports = {
    query_auth_verify_if_user_exists,
    query_auth_verify_if_user_exists_by_id
};

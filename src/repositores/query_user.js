const pool = require("../../db/conn");

const query_select_all = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM aqua_dive.user;`;

        pool.query(sql, (err, result) => {
            if (err) {

                reject(err);
                return;
            };

            resolve(result);
        });
    });
};

const query_select_by_id = (user_id) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT * 
            FROM aqua_dive.user u
            WHERE u.user_id =?;`;

        pool.query(sql, [user_id], (err, result) => {
            if (err) {

                reject(err);
                return;
            };

            resolve(result);
        });
    });
};

const query_select_by_email = (email) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT u.user_id, u.email
            FROM aqua_dive.user u
            WHERE u.email =?;`;

        pool.query(sql, [email], (err, result) => {
            if (err) {

                reject(err);
                return;
            };

            resolve(result);
        });
    });
};

const query_insert_user = (data) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO aqua_dive.user 
            (username, email, password)
            VALUES (?,?,?);`;

        const values = [
            data.username,
            data.email,
            data.password,
        ];

        pool.query(sql, values, (err, result) => {
            if (err) {

                reject(err);
                return;
            };

            resolve(result);
        });
    });
};

const query_update_user_by_id = (user_id, data) => {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE aqua_dive.user u
            SET u.username = ?,
                u.email = ?,
                u.password = ?
            WHERE u.user_id = ?;`;

        const values = [
            data.username,
            data.email,
            data.password,
            user_id,
        ];

        pool.query(sql, values, (err, result) => {
            if (err) {

                reject(err);
                return;
            };

            resolve(result);
        });
    });
};

const query_delete_user_by_id = (user_id) => {
    return new Promise((resolve, reject) => {
        const sql = `
            DELETE FROM aqua_dive.user u
            WHERE u.user_id =?;`;

        pool.query(sql, [user_id], (err, result) => {
            if (err) {

                reject(err);
                return;
            };

            resolve(result);
        });
    });
};

module.exports = {
    query_select_all,
    query_select_by_id,
    query_select_by_email,
    query_update_user_by_id,
    query_insert_user,
    query_delete_user_by_id,
};
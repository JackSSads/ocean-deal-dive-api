const pool = require("../../db/conn");

const query_tour_create = (tourData) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO aqua_dive.tour (
                client_name, 
                client_contact, 
                contact_type, 
                tour_date, 
                guide_name, 
                total_value, 
                guide_commission, 
                commission_type, 
                client_payment_status, 
                guide_payment_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        const values = [
            tourData.client_name,
            tourData.client_contact,
            tourData.contact_type,
            tourData.tour_date,
            tourData.guide_name,
            tourData.total_value,
            tourData.guide_commission,
            tourData.commission_type,
            tourData.client_payment_status,
            tourData.guide_payment_status
        ];

        pool.query(sql, values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.insertId);
            };
        });
    });
};

const query_tour_get_all = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                tour_id,
                client_name,
                client_contact,
                contact_type,
                tour_date,
                guide_name,
                total_value,
                guide_commission,
                commission_type,
                client_payment_status,
                guide_payment_status
            FROM aqua_dive.tour 
            ORDER BY created_at DESC`;
        
        pool.query(sql, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            };
        });
    });
};

const query_tour_get_by_id = (tourId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                tour_id,
                client_name,
                client_contact,
                contact_type,
                tour_date,
                guide_name,
                total_value,
                guide_commission,
                commission_type,
                client_payment_status,
                guide_payment_status
            FROM aqua_dive.tour 
            WHERE tour_id = ?`;
        
        pool.query(sql, [tourId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0]);
            };
        });
    });
};

const query_tour_update = (tourId, tourData) => {
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE aqua_dive.tour SET
                client_name = ?,
                client_contact = ?,
                contact_type = ?,
                tour_date = ?,
                guide_name = ?,
                total_value = ?,
                guide_commission = ?,
                commission_type = ?,
                client_payment_status = ?,
                guide_payment_status = ?
            WHERE tour_id = ?`;
        
        const values = [
            tourData.client_name,
            tourData.client_contact,
            tourData.contact_type,
            tourData.tour_date,
            tourData.guide_name,
            tourData.total_value,
            tourData.guide_commission,
            tourData.commission_type,
            tourData.client_payment_status,
            tourData.guide_payment_status,
            tourId
        ];

        console.log("\n\n\n\n\n", values, "\n\n\n\n\n")

        pool.query(sql, values, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.affectedRows > 0);
            };
        });
    });
};

const query_tour_delete = (tourId) => {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM aqua_dive.tour WHERE tour_id = ?`;
        
        pool.query(sql, [tourId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.affectedRows > 0);
            };
        });
    });
};

const query_tour_get_by_date_range = (startDate, endDate) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                tour_id,
                client_name,
                client_contact,
                contact_type,
                tour_date,
                guide_name,
                total_value,
                guide_commission,
                commission_type,
                client_payment_status,
                guide_payment_status
            FROM aqua_dive.tour 
            WHERE date BETWEEN ? AND ?
            ORDER BY date DESC`;
        
        pool.query(sql, [startDate, endDate], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            };
        });
    });
};

const query_tour_get_by_guide = (guideName) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                tour_id,
                client_name,
                client_contact,
                contact_type,
                tour_date,
                guide_name,
                total_value,
                guide_commission,
                commission_type,
                client_payment_status,
                guide_payment_status
            FROM aqua_dive.tour 
            WHERE guide_name LIKE ?
            ORDER BY date DESC`;
        
        pool.query(sql, [`%${guideName}%`], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            };
        });
    });
};

module.exports = {
    query_tour_create,
    query_tour_get_all,
    query_tour_get_by_id,
    query_tour_update,
    query_tour_delete,
    query_tour_get_by_date_range,
    query_tour_get_by_guide
}; 
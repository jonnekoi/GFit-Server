import promisePool from "../../utils/database.js";

const postNewClient = async (client) => {
    try {
       const {FirstName, LastName, plan, birthday, clientRegisterCode, status, email, address, city, postalCode} = client;
       const sql = `INSERT INTO clients (FirstName, LastName, plan, birthday, clientRegisterCode, status, email, address, city, postalCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
       const params = [FirstName, LastName, plan, birthday, clientRegisterCode, status, email, address, city, postalCode];
       await promisePool.execute(sql, params);
       return {clientRegisterCode};
    } catch (error) {
        console.log(error);
    }
}

const fetchAllClients = async () => {
    try {
        const sql = `
            SELECT c.*, cp.plan_name AS plan_name
            FROM clients c
            JOIN clientsPlans cp ON c.plan = cp.id
        `;
        const [clients] = await promisePool.execute(sql);
        return clients;
    } catch (error) {
        console.log(error);
    }
}

const fetchClientData = async (id) => {
    try {
        const sql = `
            SELECT c.*, cp.plan_name, w.id AS workout_id, w.name AS workout_name, w.description AS workout_description, w.type AS workout_type, w.level AS workout_level,
                   e.id AS exercise_id, e.name AS exercise_name, we.low_reps, we.weight, we.duration, we.max_reps, we.descrip, we.sets
            FROM clients c
            JOIN clientsPlans cp ON c.plan = cp.id
            LEFT JOIN clients_workouts cw ON c.id = cw.client_id
            LEFT JOIN workouts w ON cw.workout_id = w.id
            LEFT JOIN workout_exercises we ON w.id = we.workout_id
            LEFT JOIN exercises e ON we.exercise_id = e.id
            WHERE c.id = ?
        `;
        const [rows] = await promisePool.execute(sql, [id]);

        if (rows.length === 0) {
            return null;
        }

        const client = {
            id: rows[0].id,
            FirstName: rows[0].FirstName,
            LastName: rows[0].LastName,
            plan: rows[0].plan,
            birthday: rows[0].birthday,
            weight: rows[0].weight,
            targetWeight: rows[0].targetWeight,
            clientRegisterCode: rows[0].clientRegisterCode,
            status: rows[0].status,
            email: rows[0].email,
            address: rows[0].address,
            city: rows[0].city,
            postalCode: rows[0].postalCode,
            plan_name: rows[0].plan_name,
            workouts: {}
        };

        rows.forEach(row => {
            if (row.workout_id) {
                if (!client.workouts[row.workout_id]) {
                    client.workouts[row.workout_id] = {
                        name: row.workout_name,
                        description: row.workout_description,
                        type: row.workout_type,
                        level: row.workout_level,
                        exercises: []
                    };
                }
                if (row.exercise_id) {
                    client.workouts[row.workout_id].exercises.push({
                        id: row.exercise_id,
                        name: row.exercise_name,
                        low_reps: row.low_reps,
                        weight: row.weight,
                        duration: row.duration,
                        max_reps: row.max_reps,
                        descrip: row.descrip,
                        sets: row.sets
                    });
                }
            }
        });

        return client;
    } catch (error) {
        console.log(error);
    }
}

export { postNewClient, fetchAllClients, fetchClientData };

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

export { postNewClient, fetchAllClients };

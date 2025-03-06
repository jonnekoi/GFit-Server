import {fetchAllClients, postNewClient} from "../model/clientModel.js";

const addNewClient = async (req, res) => {
    try {
        const code = generateRandomCode(8);

        const status = "Pending";

        const client = {
            FirstName: req.body.firstName,
            LastName: req.body.lastName,
            plan: req.body.plan,
            birthday: req.body.birthday,
            weight: req.body.weight,
            targetWeight: req.body.targetWeight,
            clientRegisterCode: code,
            status: status,
            email: req.body.email,
            address: req.body.address,
            city: req.body.city,
            postalCode: req.body.postalCode
        }

        const saveClient = await postNewClient(client);
        res.status(201).json({message: "client added", saveClient});
    } catch (error) {
        console.log(error);
    }
}

const getAllClients = async (req, res) => {
    try {
        const clients = await fetchAllClients();
        res.status(200).json(clients);
    } catch (error) {
        console.log(error);
    }
}

const generateRandomCode = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


export { addNewClient, getAllClients };

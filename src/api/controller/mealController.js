import {fetchAllMeals, addMeal, getClientMeals} from "../model/mealModel.js";


const getAllMeals = async (req, res) => {
    try {
        const meals = await fetchAllMeals();
        res.status(200).json({ meals });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const addMealForClient = async (req, res) => {
    const { meal } = req.body;
    const { id } = req.params;

    try {
        await addMeal(meal, id);
        res.status(201).json({ message: "Meal added successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const fetchClientMealData = async (req, res) => {
    const { id } = req.params;
    try {
        const meals = await getClientMeals(id);
        res.status(200).json(meals);
    } catch (error) {
        throw error;
    }
}


export { getAllMeals, addMealForClient, fetchClientMealData };

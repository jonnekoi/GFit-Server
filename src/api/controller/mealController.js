import {fetchAllMeals, addMeal, getClientMeals, fetchAllIngredients, putClientMeal, fetchClientTargets, putClientTargets} from "../model/mealModel.js";


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

const getAllIngredients = async (req, res) => {
    try {
        const ingredients = await fetchAllIngredients();
        res.status(200).json(ingredients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateClientMeal = async (req, res) => {
    try {
        await putClientMeal(req.body);
        res.status(201).json({ message: "Meal updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const getClientTargets = async (req, res) => {
    const user = req.params.id;
    try {
        const targets = await fetchClientTargets(user);
        res.status(200).json(targets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const updateClientTargets = async (req, res) => {
    const targets = req.body;
    const user = req.params.id;
    try {
        await putClientTargets(targets, user);
        res.status(201).json({ message: "Targets updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export { getAllMeals, addMealForClient, fetchClientMealData, getAllIngredients, updateClientMeal, getClientTargets, updateClientTargets };

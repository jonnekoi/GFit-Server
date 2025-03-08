import fetchAllMeals from "../model/mealModel.js";


const getAllMeals = async (req, res) => {
    try {
        const meals = await fetchAllMeals();
        res.status(200).json({ meals });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export default getAllMeals;

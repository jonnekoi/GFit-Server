import promisePool from "../../utils/database.js";

const fetchAllMeals = async () => {
    const mealQuery = `
        SELECT 
            m.id AS meal_id,
            m.name AS meal_name,
            m.description AS meal_description,
            m.category AS meal_category,
            COALESCE(SUM((i.protein_per_100g / 100) * mi.quantity_g), 0) AS total_protein,
            COALESCE(SUM((i.carbs_per_100g / 100) * mi.quantity_g), 0) AS total_carbs,
            COALESCE(SUM((i.fat_per_100g / 100) * mi.quantity_g), 0) AS total_fat,
            COALESCE(SUM((i.calories_per_100g / 100) * mi.quantity_g), 0) AS total_calories
        FROM meals m
        LEFT JOIN meal_ingredients mi ON m.id = mi.meal_id
        LEFT JOIN ingredients i ON mi.ingredient_id = i.id
        GROUP BY m.id;
    `;

    const ingredientQuery = `
        SELECT 
            mi.meal_id,
            i.id AS ingredient_id,
            i.name AS ingredient_name,
            mi.quantity_g AS ingredient_quantity_g,
            i.protein_per_100g,
            i.carbs_per_100g,
            i.fat_per_100g,
            i.calories_per_100g
        FROM meal_ingredients mi
        JOIN ingredients i ON mi.ingredient_id = i.id;
    `;

    try {
        const [meals] = await promisePool.query(mealQuery);
        const [ingredients] = await promisePool.query(ingredientQuery);

        const formattedMeals = meals.map(meal => ({
            ...meal,
            ingredients: ingredients.filter(ing => ing.meal_id === meal.meal_id)
        }));

        return formattedMeals;
    } catch (error) {
        console.error("Error fetching meals:", error);
        throw error;
    }
};

export default fetchAllMeals;

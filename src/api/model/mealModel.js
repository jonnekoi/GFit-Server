import promisePool from "../../utils/database.js";

const fetchAllMeals = async () => {
    const query = `
        SELECT 
            m.id AS meal_id,
            m.name AS meal_name,
            m.description AS meal_description,
            m.protein AS total_protein,
            m.carbs AS total_carbs,
            m.fat AS total_fat,
            m.calories AS total_calories,
            m.category AS meal_category,
            i.id AS ingredient_id,
            i.name AS ingredient_name,
            mi.quantity_g AS ingredient_quantity_g,
            i.protein_per_100g,
            i.carbs_per_100g,
            i.fat_per_100g,
            i.calories_per_100g
        FROM meals m
        LEFT JOIN meal_ingredients mi ON m.id = mi.meal_id
        LEFT JOIN ingredients i ON mi.ingredient_id = i.id
        ORDER BY m.id, i.id;
    `;

    try {
        const [rows] = await promisePool.query(query);

        const formattedMeals = {};

        rows.forEach(row => {
            const { meal_id, meal_name, meal_description, total_protein, total_carbs, total_fat, total_calories, meal_category, ingredient_id, ingredient_name, ingredient_quantity_g, protein_per_100g, carbs_per_100g, fat_per_100g, calories_per_100g } = row;

            if (!formattedMeals[meal_name]) {
                formattedMeals[meal_name] = {
                    meal_id,
                    meal_description,
                    total_protein,
                    total_carbs,
                    total_fat,
                    total_calories,
                    meal_category,
                    ingredients: []
                };
            }

            if (ingredient_id) {
                formattedMeals[meal_name].ingredients.push({
                    ingredient_id,
                    ingredient_name,
                    quantity_g: ingredient_quantity_g,
                    protein_per_100g,
                    carbs_per_100g,
                    fat_per_100g,
                    calories_per_100g
                });
            }
        });

        return formattedMeals;
    } catch (error) {
        console.error("Error fetching meals:", error);
        throw error;
    }
};


export default fetchAllMeals;

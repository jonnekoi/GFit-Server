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

const getClientMeals = async (clientId) => {
    const mealQuery = `
        SELECT 
            cm.meal_id AS meal_id,
            m.name AS meal_name,
            m.category AS meal_category,
            m.description AS meal_description,
            COALESCE(SUM((i.protein_per_100g / 100) * mic.quantity_g), 0) AS total_protein,
            COALESCE(SUM((i.carbs_per_100g / 100) * mic.quantity_g), 0) AS total_carbs,
            COALESCE(SUM((i.fat_per_100g / 100) * mic.quantity_g), 0) AS total_fat,
            COALESCE(SUM((i.calories_per_100g / 100) * mic.quantity_g), 0) AS total_calories
        FROM clients_meals cm
        JOIN meals m ON cm.meal_id = m.id
        LEFT JOIN meal_ingredients_client mic ON cm.meal_id = mic.meal_id AND mic.client_id = cm.client_id
        LEFT JOIN ingredients i ON mic.ingredient_id = i.id
        WHERE cm.client_id = ?
        GROUP BY cm.meal_id, m.name;
    `;

    const ingredientQuery = `
        SELECT 
            mic.meal_id,
            i.id AS ingredient_id,
            i.name AS ingredient_name,
            mic.quantity_g AS ingredient_quantity_g,
            i.protein_per_100g,
            i.carbs_per_100g,
            i.fat_per_100g,
            i.calories_per_100g
        FROM meal_ingredients_client mic
        JOIN ingredients i ON mic.ingredient_id = i.id
        WHERE mic.client_id = ?;
    `;

    try {
        const [meals] = await promisePool.execute(mealQuery, [clientId]);
        const [ingredients] = await promisePool.execute(ingredientQuery, [clientId]);

        const formattedMeals = meals.map(meal => ({
            ...meal,
            ingredients: ingredients.filter(ing => ing.meal_id === meal.meal_id)
        }));

        return formattedMeals;
    } catch (error) {
        console.error("Error fetching client meals:", error);
        throw error;
    }
};


const addMeal = async (meal, clientId) => {
    try {
        const [mealCheck] = await promisePool.query(
            'SELECT id FROM meals WHERE id = ?',
            [meal.meal_id]
        );

        if (mealCheck.length === 0) {
            throw new Error('Meal not found');
        }

        await promisePool.query(
            'INSERT INTO clients_meals (client_id, meal_id) VALUES (?, ?)',
            [clientId, meal.meal_id]
        );

        const ingredientPromises = meal.ingredients.map(async (ingredient) => {
            const [ingredientCheck] = await promisePool.query(
                'SELECT id FROM ingredients WHERE id = ?',
                [ingredient.ingredient_id]
            );

            if (ingredientCheck.length === 0) {
                throw new Error(`Ingredient with ID ${ingredient.ingredient_id} not found`);
            }

            return promisePool.query(
                'INSERT INTO meal_ingredients_client (client_id, meal_id, ingredient_id, quantity_g) VALUES (?, ?, ?, ?)',
                [clientId, meal.meal_id, ingredient.ingredient_id, ingredient.quantity_g]
            );
        });

        await Promise.all(ingredientPromises);

    } catch (error) {
        throw error;
    }
};

const fetchAllIngredients = async () => {
    const query = `
        SELECT * FROM ingredients;
    `;

    try {
        const [ingredients] = await promisePool.query(query);
        return ingredients;
    } catch (error) {
        console.error("Error fetching ingredients:", error);
        throw error;
    }
}

const putClientMeal = async (meal) => {
    try {
        console.log("MODEL MEAL", meal);

        if (!meal.meal_id || !meal.user_id || !meal.ingredients) {
            throw new Error("Missing required meal data");
        }
        await promisePool.query(
            'DELETE FROM meal_ingredients_client WHERE meal_id = ? AND client_id = ?',
            [meal.meal_id , meal.user_id]
        );

        const ingredientPromises = meal.ingredients.map(ingredient => {
            return promisePool.query(
                'INSERT INTO meal_ingredients_client (client_id, meal_id, ingredient_id, quantity_g) VALUES (?, ?, ?, ?)',
                [meal.user_id, meal.meal_id, ingredient.ingredient_id, ingredient.ingredient_quantity_g]
            );
        });

        await Promise.all(ingredientPromises);

    } catch (error) {
        console.error("Error in putClientMeal:", error);
        throw error;
    }
}


export {fetchAllMeals, addMeal, getClientMeals, fetchAllIngredients, putClientMeal};

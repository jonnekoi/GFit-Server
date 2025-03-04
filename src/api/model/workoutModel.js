import promisePool from "../../utils/database.js";

const fetchAllWorkouts = async () => {
    const [workouts] = await promisePool.query(`
        SELECT
            w.id AS workout_id,
            w.name AS workout_name,
            w.description AS workout_description,
            w.created_at AS workout_created_at,
            e.id AS exercise_id,
            e.name AS exercise_name,
            e.description AS exercise_description,
            e.created_at AS exercise_created_at,
            we.reps,
            we.weight,
            we.duration
        FROM
            workouts w
        JOIN
            workout_exercises we ON w.id = we.workout_id
        JOIN
            exercises e ON e.id = we.exercise_id
        ORDER BY
            w.id, e.id;
    `);
    return workouts;
}

const postExercise = async (exercise) => {
    try {
        const { name, description } = exercise;
        const created_at = new Date();
        const sql = `INSERT INTO exercises (name, description, created_at) VALUES (?, ?, ?)`;
        const params = [name, description, created_at];
        const [result] = await promisePool.execute(sql, params);
        return { exercise_id: result.insertId };
    } catch (error) {
        console.log(error);
    }
}

const fetchAllExercises = async () => {
    const [exercises] = await promisePool.query(`SELECT id, name, description FROM exercises`);
    return exercises;
}

export {fetchAllWorkouts, postExercise, fetchAllExercises};

import promisePool from "../../utils/database.js";

const fetchAllWorkouts = async () => {
    const [workouts] = await promisePool.query(`
        SELECT
            w.id AS workout_id,
            w.name AS workout_name,
            w.description AS workout_description,
            w.created_at AS workout_created_at,
            w.type AS workout_type,
            w.level AS workout_level,
            e.id AS exercise_id,
            e.name AS exercise_name,
            e.description AS exercise_description,
            we.low_reps,
            we.max_reps,
            we.weight,
            we.sets
        FROM
            workouts w
        JOIN
            workout_exercises we ON w.id = we.workout_id
        JOIN
            exercises e ON we.exercise_id = e.id;
    `);

    const formattedWorkouts = {};

    workouts.forEach(workout => {
        const { workout_id, workout_name, workout_description, workout_created_at, workout_type, workout_level, exercise_id, exercise_name, exercise_description, low_reps, max_reps, weight, sets } = workout;

        if (!formattedWorkouts[workout_name]) {
            formattedWorkouts[workout_name] = {
                workout_id,
                workout_description,
                workout_created_at,
                workout_type,
                workout_level,
                exercises: []
            };
        }

        formattedWorkouts[workout_name].exercises.push({
            exercise_id,
            exercise_name,
            exercise_description,
            low_reps,
            max_reps,
            weight,
            sets
        });
    });

    return formattedWorkouts;
};

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

const postWorkout = async (workout) => {
    try {
        const workoutName = workout.workoutName !== undefined ? workout.workoutName : null;
        const workoutType = workout.workoutType !== undefined ? workout.workoutType : null;
        const level = workout.level !== undefined ? workout.level : null;
        const {exercises} = workout;
        const description = workout.description !== undefined ? workout.description : null;
        const created_at = new Date();
        const sql = `INSERT INTO workouts (name, description, created_at, type, level) VALUES (?, ?, ?, ?, ?)`;
        const params = [workoutName, description, created_at, workoutType, level];
        const [result] = await promisePool.execute(sql, params);
        const workout_id = result.insertId;

        const exercisePromises = exercises.map(exercise => {
            const {id, reps_low, reps_max, weight, description, duration, sets} = exercise;
            const exerciseSql = `INSERT INTO workout_exercises (workout_id, exercise_id, low_reps, weight, duration, max_reps, descrip, sets) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            const exerciseParams = [
                workout_id,
                id !== undefined ? id : null,
                reps_low !== undefined ? reps_low : null,
                weight !== undefined ? weight : null,
                duration !== undefined ? duration : null,
                reps_max !== undefined ? reps_max : null,
                description !== undefined ? description : null,
                sets !== undefined ? sets : null
            ];
            return promisePool.execute(exerciseSql, exerciseParams);
        });

        await Promise.all(exercisePromises);
        return {workout_id};
    } catch (error) {
        console.log(error);
    }
}

const putUpdateWorkout = async (workout) => {
    const workout_id = workout.id;
    const exercises = workout.exercises;

    const updatePromises = exercises.map(exercise => {
        const { exercise_id, low_reps, max_reps, weight, sets } = exercise;
        const updateWorkoutSql = `
            UPDATE workout_exercises 
            SET low_reps = ?, max_reps = ?, weight = ?, sets = ? 
            WHERE workout_id = ? AND exercise_id = ?
        `;
        const params = [low_reps, max_reps, weight, sets, workout_id, exercise_id];
        return promisePool.execute(updateWorkoutSql, params);
    });

    try {
        await Promise.all(updatePromises);
        return { message: "Workout updated successfully" };
    } catch (error) {
        console.log(error);
        throw new Error("Failed to update workout");
    }
}

export {fetchAllWorkouts, postExercise, fetchAllExercises, postWorkout, putUpdateWorkout};

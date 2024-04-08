  import pg from "pg";
  import dotenv from 'dotenv';

  dotenv.config();
  
  const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  db.connect();

  async function registerUser(username,password){
    const result= await db.query("SELECT user_name FROM users WHERE user_name=$1 ",[username]);
    if(result.rowCount===0){
  await db.query("INSERT INTO users(user_name, password) VALUES($1, $2);", [username, password]);

    }else{
      throw new Error("User already exists");
    }
    
  }

  async function checkValidation(username,password){
    let result =await db.query("SELECT * FROM users WHERE user_name=$1 AND password=$2",[username,password]);
    return result.rows;
  }

  async function registerUserPhysicalDetails(fname,age,gender,height,weight,username){
    await db.query("INSERT INTO physical_details(fname,age,gender,height,weight,user_name) VALUES($1,$2,$3,$4,$5,$6)",[fname,age,gender,height,weight,username]);
    
  }

  async function registerUserCalorieDetails(username,fname,bmi,idealBMI,weight,idealW,bmr,activityLevel,weightLossPerWeek){
    await db.query("INSERT INTO calories_details(user_name,fname,bmi,ideal_bmi,bmr,weight,ideal_weight,activity_level,weightLossPerWeek) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)",[username,fname,bmi,idealBMI,bmr,weight,idealW,activityLevel,weightLossPerWeek]);
  }

  async function registerUserCaloriesBurned(username, exerciseName, duration, reps, caloriesBurnedPW) {
    await db.query("INSERT INTO calories_burned(user_name, time, exercise_name, duration, reps, calories_burned) VALUES($1, CURRENT_TIMESTAMP, $2, $3, $4, $5)", [username, exerciseName, duration, reps, caloriesBurnedPW]);
  }

  async function registerUserCaloriesConsumed(username, foodName, serving, caloriesConsumed) {
    await db.query("INSERT INTO calories_consumed(username, time, food_name, num_of_serving,calories_consumed) VALUES($1, CURRENT_TIMESTAMP, $2, $3, $4)", [username, foodName, serving, caloriesConsumed]);
  }

  async function getCalorieBurnedTable(username) {
    const result = await db.query("SELECT * FROM calories_burned WHERE user_name = $1 AND DATE(time) = CURRENT_DATE", [username]);
    return result.rows;
  }

  async function getCaloriesConsumedTable(username) {
    const result = await db.query("SELECT * FROM calories_consumed WHERE username = $1 AND DATE(time) = CURRENT_DATE", [username]);
    return result.rows;
  }
  

  async function getUserDetails(username){
    const result = await db.query("SELECT * FROM calories_details WHERE user_name = $1", [username]);
          return result.rows;
  }

  async function getUserProgressDetails(username){
    const result = await db.query("SELECT * FROM user_progress WHERE username = $1", [username]);
          return result.rows;
  }

  async function registerUserProgress(username,fname,status,calBurned,calAfterExe,calConsumed,calAfterDiet,weight,weightAfter,today,tdee,cal_cons_week,cal_burn_week,weeklytarget){
    await db.query("INSERT INTO user_progress(username,fn,status,cal_burn_goal,cal_after_exercise,cal_con_goal,cal_after_diet,cur_weight,weight_progress,today,target,tdee,cal_cons_week,cal_burn_week,weeklytarget) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)",[username,fname,status,calBurned,calAfterExe,calConsumed,calAfterDiet,weight,weightAfter,today,'',tdee,cal_cons_week,cal_burn_week,weeklytarget] );
  };

  async function updateCalAfterExercise(username, caloriesBurnedPW) {
    await db.query("UPDATE user_progress SET cal_after_exercise = cal_after_exercise + $1, cal_burn_week = cal_burn_week + $2 WHERE username = $3", [caloriesBurnedPW, caloriesBurnedPW,username]);
  }
  

  async function updateCalAfterFood(username, calConsumed) {
    await db.query("UPDATE user_progress SET cal_after_diet = cal_after_diet + $1, cal_cons_week=cal_cons_week+$1 WHERE username = $2", [calConsumed, username]);
  }

  async function resetProgressData(username,now) {
    await db.query("UPDATE user_progress SET cal_after_exercise = $1,cal_after_diet=$2,today=$3,target=$4 WHERE username = $5", [0,0, now,"",username]);
  }

  async function updateAchievement(username){
    await db.query("UPDATE user_progress SET target=target || $1 WHERE username=$2",['A', username]);
  }
  

  async function setTarget(username){
    await db.query("UPDATE user_progress SET target=$1 WHERE username=$2",['achieved',username]);
  }
  async function setWeeklyTarget(st,username){
    await db.query("UPDATE user_progress SET weeklytarget=$1 WHERE username=$2",[st,username]);
  }

  async function resetWeeklyData(username){
    await db.query("UPDATE user_progress SET cal_cons_week=$1,cal_burn_week=$2,weeklytarget=$3 WHERE username=$4",[0,0,"a",username]);
  }

  async function setProgressTable(username,fname,weight,progressData){
    await db.query("INSERT INTO progressTable (username,fname,weight,progressdata) VALUES($1,$2,$3,$4)",[username,fname,weight,progressData]);
  }

  async function getProgressTable(username){
    const result=await db.query("SELECT * FROM progressTable WHERE username=$1",[username]);
    return result.rows;
  }
 
  

  export default { registerUser,checkValidation, registerUserPhysicalDetails ,registerUserCalorieDetails,registerUserCaloriesBurned,registerUserCaloriesConsumed,getCalorieBurnedTable,getCaloriesConsumedTable,getUserDetails,registerUserProgress,getUserProgressDetails,updateCalAfterExercise,updateCalAfterFood,resetProgressData,updateAchievement,setTarget,setWeeklyTarget,resetWeeklyData,setProgressTable,getProgressTable};
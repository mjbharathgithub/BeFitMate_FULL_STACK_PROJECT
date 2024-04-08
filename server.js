import express from "express";
import bodyParser from "body-parser";
import database from './database.js';
//import flash from 'connect-flash';
//import expressSession from 'express-session';
import ff from "./fitnessFunctions.js"
const app = express();
const port = 3000;

// Use express-session before connect-flash
// app.use(expressSession({
//   secret: '1234/.,3434.3343434',
//   resave: false,
//   saveUninitialized: true
// }));
// app.use(flash());

app.use(express.static("public")); 
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/waiting", (req, res) => {
  let height=184,weight=78,gender='male',age=21,idealBMI=22;
  res.render("sugSample.ejs",{
    fn:'fname',
    username:'username',
    bmi:24,
    idealBMI:idealBMI,
    weight:weight,
    idealW:ff.calculateIdealWeight(idealBMI,height).toFixed(2),
    bmr:ff.calculateBMR(gender,weight,height,age).toFixed(2),
    programType:'Loss'
  });
  //What is What and Why is What?
});

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/create", (req, res) => {
  const actionType = req.query.type;
  let loggingStatus = "Sign-In";
  if (actionType === "get-started") loggingStatus = "Sign-Up";

  res.render("login.ejs", { loggingStatus: loggingStatus });
});

app.post("/create", async (req, res) => {
  try {
    const { username, password,loggingStatus } = req.body;
    console.log("in post create rout "+loggingStatus);
    if(loggingStatus=="Sign-Up" &&username!=null&&password!=null){
    await database.registerUser(username, password);
    res.render("suggestion.ejs",{firstTime:"first time",username:username});
  }else{
    let result = await database.checkValidation(username, password);
console.log(result);
if (result && result.length > 0) {
    let { user_name } = result[0];
    console.log("username in the post create route" + user_name);
    res.redirect(`/profileMain?username=${user_name}`);
} else {
    console.log("Result is undefined or null, or the array is empty.");
    res.render("login.ejs",{loggingStatus:loggingStatus,error:"Improper credentials Try again"});
}

    

    }
    
  } catch (error) {
    if (error.message.includes('User already exists')) {
      // console.log("Flash Messages:", req.flash('error'));
      // req.flash('error', 'Username already exists. Please choose a different username.');
      // console.log("Flash Messages after setting:", req.flash('error'));
      res.render("login.ejs",{error:'Username already exists.',loggingStatus:"Sign-Up"});
    } else {
      console.error('Error registering user in create route :', error.message);
      res.status(500).send('Internal Server Error');
    }
  }
});

app.post("/suggestion",async(req,res)=>{
  try{
    const {fname,age,gender,height,weight,username}=req.body;
    await database.registerUserPhysicalDetails(fname,age,gender,height,weight,username);
    let bmi=ff.calculateBMI(weight,height).toFixed(2);
    let idealBMI=ff.calculateIdealBMI(gender);
    let programType='Loss';
    if(bmi<idealBMI){
      programType='Gain';
    }
      
      res.render("suggestion.ejs",{
        fn:fname,
        username:username,
        bmi:bmi,
        idealBMI:idealBMI,
        weight:weight,
        idealW:ff.calculateIdealWeight(idealBMI,height).toFixed(2),
        bmr:ff.calculateBMR(gender,weight,height,age).toFixed(2),
        programType:programType
      });

  }
  catch(error){
    console.error('Error registering user in post/suggestion route:', error.message);
      res.status(500).send('Internal Server Error');
  }
});


app.post("/profile",async(req,res)=>{
  try{
    const {username,fname,bmi,idealBMI,weight,idealW,bmr,activityLevel,weightLossPerWeek}=req.body;
    console.log("in server"+username+"  "+fname+"  "+bmi+"  "+idealBMI+"  "+ weight+"  "+ idealW+"  "+bmr+"  "+activityLevel+"  "+weightLossPerWeek);
    await database.registerUserCalorieDetails(username,fname,bmi,idealBMI,weight,idealW,bmr,activityLevel,weightLossPerWeek);

    console.log("database created successfully");
    let calConsumed,calBurned,tdee,status;
    // let weight="100",idealW="63.58";
    console.log("w :"+weight+" type :"+typeof weight+" iw : "+idealW+"  type"+ typeof idealW+" addition"+(weight+idealW) +" multiplication :"+(weight*idealW));
    
    
    if(parseFloat(weight)<parseFloat(idealW)){
      status="Gain";
      tdee=ff.calculateTDEE(bmr,activityLevel);
      
      calBurned=tdee-bmr;
      
      calConsumed=ff.calculateCaloriesForWeightChange(tdee,weightLossPerWeek);
      console.log(" Weight gain maintainence :"+tdee+" calBurned :"+calBurned+" calConsumed :"+calConsumed);
      
      
    }else{
      status="Loss";
      tdee=ff.calculateTDEE(bmr ,activityLevel);
      calConsumed=tdee-250;//deficient
      calBurned=(ff.calculateCaloriesForWeightChange(tdee,weightLossPerWeek)-(tdee+250));
      console.log(" Weight loss maintainence :"+tdee+" calBurned :"+calBurned+" calConsumed :"+calConsumed+"or :"+(tdee-250));
}
let date = new Date();
let now = `${date.getDate()}:0${date.getMonth()+1}:${date.getFullYear()}`;
await database.registerUserProgress(username,fname,status,calBurned,0,calConsumed,0,weight,0,now,tdee,0,0,"a");
//need to check this
let progressDetail=await database.getUserProgressDetails(username);
console.log(`progress detail on first time : ${progressDetail[0]}`)


    res.render("profile.ejs",

    {username:username,
      fname:fname,
      weight:weight,
    firstTime:"yes",
    status:status,
    weight_diff:"",
    cal_con_goal:calConsumed.toFixed(2),
    cal_after_diet:0,
    cal_burn_goal:calBurned.toFixed(2),
    cal_after_exercise:0,
    cal_burn_week:0,
    cal_cons_week:0
  });

  }catch(error){
  console.log(error);

}
});

app.get("/logExercise",async (req, res) => {
  const username=req.query.username;
  let exerciseTable=await database.getCalorieBurnedTable(username);
  let progressDetail=await database.getUserProgressDetails(username);
  console.log(`progress detail on ProfileMain : ${progressDetail[0]}`)
  let {fn,cal_burn_goal,cal_after_exercise}=progressDetail[0];
  if(cal_burn_goal>cal_after_exercise){
  res.render("logExercise.ejs",{username:username,exerciseTable:exerciseTable,ffff:fn});
  }else{
    res.render("logExercise.ejs",{username:username,exerciseTable:exerciseTable,fn:fn});

  }
});

app.get("/logFood",async(req,res)=>{
  const username=req.query.username;
  console.log('from log food '+username);
  let foodTable=await database.getCaloriesConsumedTable(username);
  let progressDetail=await database.getUserProgressDetails(username);
  let {fn,cal_con_goal,cal_after_diet}=progressDetail[0];
  if(cal_con_goal>cal_after_diet){
  res.render("logFood.ejs",{username:username,foodTable:foodTable,ffff:fn});
  }else{
    res.render("logFood.ejs",{username:username,foodTable:foodTable,fn:fn});

  }

})

app.post('/logExercise', async(req, res) => {
  const { exerciseName, caloriesBurned, duration, reps,username } = req.body;
  
  try{
  let caloriesBurnedPW;
  // console.log('user name:', username);
  // console.log('Exercise:', exerciseName);
  // console.log('Calories BurnedPerHour:', caloriesBurned);
  // console.log('Duration:', duration, 'minutes');
  // console.log('Reps:', reps);
  caloriesBurnedPW=ff.getCaloriesFromExercise(caloriesBurned,duration,reps);
  // console.log("caloriesBurned :"+caloriesBurnedPW);
  await database.registerUserCaloriesBurned(username,exerciseName,duration,reps,caloriesBurnedPW);
  let exerciseTable=await database.getCalorieBurnedTable(username);
  //console.log("exercise table :",exerciseTable)
  await database.updateCalAfterExercise(username,caloriesBurnedPW);
  let currCalBurn=await database.getUserProgressDetails(username);
  let {cal_burn_goal,cal_after_exercise,fn}=currCalBurn[0];
  if(cal_burn_goal<=cal_after_exercise){
    res.redirect(`/profileMain?username=${"firstTimeExercise"+username}`);

  }
  else{
 res.render("logExercise.ejs",{exerciseTable:exerciseTable,username:username,ffff:fn});
  }
  }catch(error){
    console.log(error);

}


  // Send a response back to the client
  //res.redirect("/");
});

app.post('/logFood',async (req,res)=>{
  let {username,foodName,caloriesConsumed,serving}=req.body;

  console.log("entered the logfood route successfully ")
 console.log(` user name : ${username} food name : ${foodName}  Calories Consumed :${caloriesConsumed}  servings : ${serving}`);

  caloriesConsumed*=serving;
  console.log(caloriesConsumed);

  await database.registerUserCaloriesConsumed(username,foodName,serving,caloriesConsumed);
  let foodTable = await database.getCaloriesConsumedTable(username);

  await database.updateCalAfterFood(username,caloriesConsumed);
  console.log(foodTable);
  let curCalCons=await database.getUserProgressDetails(username);
  let {cal_con_goal,cal_after_diet,fn}=curCalCons[0];
  if(cal_con_goal<=cal_after_diet){
    res.redirect(`/profileMain?username=${"firstTimeFood"+username}`);
  }else{
    res.render("logFood.ejs",{foodTable:foodTable,username:username,ffff:fn});
  }



})

app.get("/profileMain",async(req,res)=>{
  let username=req.query.username;
  let dailyTarget="pending";
  let congrats="pending";
  
 

  
  if(username.substring(0,13)=='firstTimeFood'){
    
    username=username.substring(13);
    dailyTarget="FoodAchieved";

    
    
    console.log("first time food");
    await database.updateAchievement(username);

  }else if(username.substring(0,17)=='firstTimeExercise'){
    username=username.substring(17);
    dailyTarget="ExerciseAchieved";
    await database.updateAchievement(username);//updateAchievement
    
    console.log("first time exercise");
  }
  let userDetails = await database.getUserDetails(username);
  console.log("user details from database:", userDetails); 
  let  {fname,bmi,idealBMI,weight,idealW,bmr,activityLevel,weightLossPerWeek}=userDetails;
  let progressDetail= await database.getUserProgressDetails(username);
  console.log("user progress details ",progressDetail);
  // console.log("user status details ",progressDetail.status);
  let {fn,status,cal_burn_goal,cal_after_exercise,cal_con_goal,cal_after_diet,cur_weight,weight_progress,today,target,tdee,cal_cons_week,cal_burn_week,weeklytarget}=progressDetail[0];
  console.log(`fname :${fn} status ${status} calBurned goal ${cal_burn_goal} calAfter exercise ${cal_after_exercise} calConsujmed ${cal_con_goal} cal aater diet ${cal_after_diet} current weight ${cur_weight} weight progress ${weight_progress} tdee ${tdee} weekly cal cons ${cal_cons_week} weekly cal burn ${cal_burn_week} weekly target ${weeklytarget}`);
   console.log("target after :"+target+" congrats :"+congrats);
 let date = new Date();
let now = `${date.getDate()}:0${date.getMonth()+1}:${date.getFullYear()}`;
  console.log("target before :"+target);
  if(target=="AA"){
    congrats="congrats";
    let weight=ff.finalWeight(cur_weight,cal_after_exercise,cal_after_diet,status,tdee);
    let progressData=`Date:${today}\nCalories Consumed:${cal_after_diet}\nCalories Burned:${cal_after_exercise}`;
    console.log(`progress data : ${progressData} and weight ${weight}`);

    await database.setProgressTable(username,fn,weight,progressData);
    

    await database.setTarget(username);

  } 
  if(today!=now){
    if(target!="achieved"){
      let weight=ff.finalWeight(cur_weight,cal_after_exercise,cal_after_diet,status,tdee);
    let progressData=`Date:${today}\nCalories Consumed:${cal_after_diet}\nCalories Burned:${cal_after_exercise}`;
    console.log(`progress data : ${progressData} and weight ${weight}`);

    await database.setProgressTable(username,fn,weight,progressData);
    }
    cal_after_exercise=0;
    cal_after_diet=0;
    await database.resetProgressData(username,now);
  //  dailyTarget="pending";
  }
  let wkTarget="pending";
  if(cal_burn_goal*7<=cal_burn_week&&cal_con_goal*7<=cal_cons_week&&weeklytarget!="AA"&&date.getDay()==0){
    console.log("enterd statement");
    wkTarget="achieved";
    await database.setWeeklyTarget("AA",username);
  }
  if(cal_burn_goal*7<=cal_burn_week&&cal_con_goal*7<=cal_cons_week&&weeklytarget=="AA"&&date.getDay()!=0){
    console.log(`Entere the statement in the reset route`);
    await database.resetWeeklyData(username);
  }
  console.log(`weekly target : ${wkTarget}`);

 
  // if(cal_after_diet>=cal_con_goal&&cal_after_exercise>=cal_burn_goal){
  //   congrats="true";
  // }
  console.log(`normal date :${now} database date ${today}`);


  

 res.render("profile.ejs",{
  username:username,
  fname:fn,
  status:status,
  cal_con_goal:cal_con_goal.toFixed(2),
  cal_after_diet:cal_after_diet.toFixed(2),
  cal_burn_goal:cal_burn_goal.toFixed(2),
  cal_after_exercise:cal_after_exercise.toFixed(2),
  dailyTarget:dailyTarget,
  congrats:congrats,
  cal_burn_week:cal_burn_week,
  cal_cons_week:cal_cons_week,
  wkTarget:wkTarget,  
 });


 // res.render("profile.ejs",{})
});

app.get("/navBar",(req,res)=>{
  let{fname,actionType,username}=req.query;
  console.log(fname+ ' '+ actionType+' ' +username);
  res.render("navBar.ejs",{username:username,fname:fname,actionType:actionType});

});
app.get("/viewProgress",async (req,res)=>{
  const username=req.query.username;
  let weights = [],progressDatas = [],fn;
  let progressTable = await database.getProgressTable(username);
  if(progressTable.length==0){
    console.log("no table");
    res.render("viewProgress.ejs",{username:username,fname:fn,error:"TargetNotAchieved"});
    
  }else{
console.log("here comes the progress table:");
fn=progressTable[0].fname;
console.log(`fname is: ${fn}`);
progressTable.forEach((row, index) => {
  console.log(`Row ${index + 1}:`);
  console.log(row); // Log the entire object
});


progressTable.forEach((row) => {
  weights.push(row.weight);
  progressDatas.push(row.progressdata);
});

console.log("Weights:", weights);
console.log("Progress Data:", progressDatas);
res.render("viewProgress.ejs",{username:username,fname:fn,weights:weights,progressDatas:progressDatas});
  }



});


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

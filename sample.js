  import express from "express";
  import bodyParser from "body-parser";
  import ff from "./fitnessFunctions.js";
  import database from "./database.js";
  const app = express();
  const port = 3000;


  app.use(express.static("public"));
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get("/waiting",(req,res)=>{
 
      res.render("logFood.ejs",{username:"newUserTest6"});
  })
  app.get("/",(req,res)=>{
    try{
      let username="newUserTest005",fname="Joe",weight=100,height=170,age=20,gender="male";

      let idealBMI=ff.calculateIdealBMI(gender);
      
      res.render("suggestion.ejs",{
        fn:fname,
        username:username,
        bmi:ff.calculateBMI(weight,height).toFixed(2),
        idealBMI:idealBMI,
        weight:weight.toFixed(2),
        idealW:ff.calculateIdealWeight(idealBMI,height).toFixed(2),
        bmr:ff.calculateBMR(gender,weight,height,age).toFixed(2),

      });

    }
    catch(error){
      console.error('Error registering user:', error.message);
        res.status(500).send('Internal Server Error');
    }
  });

  app.post("/profile",async(req,res)=>{
    try{
      const {username,fname,bmi,idealBMI,weight,idealW,bmr,activityLevel,weightLossPerWeek}=req.body;
      console.log("in server"+username+"  "+fname+"  "+bmi+"  "+idealBMI+"  "+ weight+"  "+ idealW+"  "+bmr,activityLevel+"  "+weightLossPerWeek);
      await database.registerUserCalorieDetails(username,fname,bmi,idealBMI,weight,idealW,bmr,activityLevel,weightLossPerWeek);

      console.log("database created successfully");
      let calConsumed,calBurned,tdee,status;
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
        calConsumed=tdee-250;//used to find the calorie deficient
        calBurned=(ff.calculateCaloriesForWeightChange(tdee,weightLossPerWeek)-(tdee+250));
        console.log(" Weight loss maintainence :"+tdee+" calBurned :"+calBurned+" calConsumed :"+calConsumed+"or :"+(tdee-250));
  }
  let date = new Date();
  let now = `${date.getFullYear()}:0${date.getMonth()+1}:${date.getDate()}`;
  await database.registerUserProgress(username,fname,status,calBurned,0,calConsumed,0,weight,0,now);
  //need to check this
  

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
      cal_after_exercise:0
    });

    }catch(error){
    console.log(error);

  }
  });

  app.get("/logExercise",async (req, res) => {
    const username=req.query.username;
    let exerciseTable=await database.getCalorieBurnedTable(username);
    let progressDetail=await database.getUserProgressDetails(username);
    let {fn,cal_burn_goal,cal_after_exercise}=progressDetail[0];
    if(cal_burn_goal>cal_after_exercise){
    res.render("logExercise.ejs",{username:username,exerciseTable:exerciseTable});
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
    res.render("logFood.ejs",{username:username,foodTable:foodTable});
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
    let {cal_burn_goal,cal_after_exercise}=currCalBurn[0];
    if(cal_burn_goal<=cal_after_exercise){
      res.redirect(`/profileMain?username=${"firstTimeExercise"+username}`);

    }
    else{
   res.render("logExercise.ejs",{exerciseTable:exerciseTable,username:username});
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
    let {cal_con_goal,cal_after_diet}=curCalCons[0];
    if(cal_con_goal<=cal_after_diet){
      res.redirect(`/profileMain?username=${"firstTimeFood"+username}`);
    }else{
      res.render("logFood.ejs",{foodTable:foodTable,username:username});
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
    let {status,cal_burn_goal,cal_after_exercise,cal_con_goal,cal_after_diet,cur_weight,weight_progress,today,target}=progressDetail[0];
    console.log(`fname : status ${status} calBurned goal ${cal_burn_goal} calAfter exercise ${cal_after_exercise} calConsujmed ${cal_con_goal} cal aater diet ${cal_after_diet} current weight ${cur_weight} weight progress ${weight_progress}`);
    
    console.log("target before :"+target);
    if(target=="AA"){
      congrats="congrats";
      await database.setTarget(username);

    }
    
    console.log("target after :"+target+" congrats :"+congrats);
   let date = new Date();
  let now = `${date.getFullYear()}:0${date.getMonth()+1}:${date.getDate()}`;
   
    if(today!=now){
      cal_after_exercise=0;
      cal_after_diet=0;
      await database.resetExerciseDietData(username);
    //  dailyTarget="pending";
    }
   
    // if(cal_after_diet>=cal_con_goal&&cal_after_exercise>=cal_burn_goal){
    //   congrats="true";
    // }
    console.log(`normal date :${now} database date ${today}`);
    

   res.render("profile.ejs",{
    username:username,
    fname:fname,
    status:status,
    cal_con_goal:cal_con_goal.toFixed(2),
    cal_after_diet:cal_after_diet.toFixed(2),
    cal_burn_goal:cal_burn_goal.toFixed(2),
    cal_after_exercise:cal_after_exercise.toFixed(2),
    dailyTarget:dailyTarget,
    congrats:congrats  
   });


   // res.render("profile.ejs",{})
  });


  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });

      function calculateBMI(weight, height) {
        // BMI Formula: weight (kg) / (height (m))^2
        const heightInMeters = height / 100; // Convert height from cm to meters
        return weight / (heightInMeters ** 2);
      }

      function calculateIdealBMI(gender) {
        // Assuming a standard BMI range for both genders
        return gender === 'male' ? 22 : 21.7;
      }

      function calculateIdealWeight(idealBMI, height) {
        // Ideal Weight Formula: idealBMI * (height (m))^2
        const heightInMeters = height / 100; // Convert height from cm to meters
        return idealBMI * (heightInMeters ** 2);
      }
      
      function calculateBMR(gender, weight, height, age) {
        let bmr;

        if (gender === 'male') {
          bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
        } else if (gender === 'female') {
          bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;
        } else {
          // Default to male BMR if gender is not recognized
          console.error('Invalid gender. Defaulting to male BMR.');
          bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
        }
      return bmr ;
      }
      


      function calculateTDEE(bmr, activityLevel) {
        const activityFactors = {
          sedentary: 1.2,
          lightlyActive: 1.375,
          moderatelyActive: 1.55,
          veryActive: 1.725,
          extraActive: 1.9,
          other:1
        };

        return bmr * activityFactors[activityLevel];
      }

      function calculateCaloriesForWeightChange(tdee,weightGainPerWeek) {
        // Assuming 1 kg of weight gain is approximately 7700 calories
        const caloriesForWeightChange = weightGainPerWeek * (1100);
        return ((tdee) + caloriesForWeightChange);
      }
      // function calculateCaloriesForWeightLoss(tdee, weightLossPerWeek) {
      //   // Assuming 1 kg of weight gain is approximately 7700 calories
      //   const caloriesForWeightLoss = weightLossPerWeek * (1100);
        
      //   return ((tdee-gmr) + caloriesForWeightLoss);
      // }
      function getCaloriesFromExercise(calBurnedPerHour, duration, reps) {
        // const exercises = {
        //   "Running on Treadmill": 800,
        //   "Bench Press": 250,
        //   "Dumbbell Curls": 250,
        //   "Plank": 250,
        //   "Squats": 400,
        //   "Deadlifts": 500,
        //   "Leg Press": 500,
        //   "Shoulder Press": 250,
        //   "Lat Pulldowns": 350,
        //   "Barbell Rows": 350,
        //   "Tricep Dips": 250,
        //   "Hammer Curls": 250,
        //   "Lunges": 400,
        //   "Calf Raises": 250,
        //   "Russian Twists": 350,
        //   "Pull-Ups": 500,
        //   "Push-Ups": 250,
        //   "Burpees": 500,
        //   "Box Jumps": 600,
        //   "Seated Cable Rows": 350,
        //   "Jumping Jacks": 500,
        //   "Cycling (Stationary Bike)": 500,
        //   "Kettlebell Swings": 400,
        //   "Battle Ropes": 600,
        //   "Box Squats": 400,
        //   "Mountain Climbers": 500,
        //   "Jump Rope": 700,
        //   "Medicine Ball Slams": 400,
        //   "Burpees with Push-Up": 600,
        //   "Trx Rows": 350,
        //   "Plank with Shoulder Taps": 350,
        //   "Sprints (High Intensity)": 850,
        //   "Swimming": 600,
        //   "Rowing Machine": 500,
        //   "Elliptical Trainer": 500,
        //   "High Knees": 600,
        //   "Clean and Jerk": 600,
        //   "Farmer's Walk": 400,
        //   "Wall Sits": 250,
        //   "Bench Dips": 250,
        //   "Incline Push-Ups": 350,
        //   "Jumping Lunges": 600,
        //   "Bicycle Crunches": 350,
        //   "Leg Raises": 250,
        //   "Jumping Squats": 600,
        //   "Tuck Jumps": 600,
        //   "Plank with Knee to Elbow": 350,
        //   "Walking Lunges": 400,
        //   "Reverse Crunches": 250,
        //   "Side Plank": 250
        // };
        let caloriesBurned;
        
        if (duration < 0) {
            console.log("Time can't be negative");
            return;
        }
      if (duration >= 0) {
              caloriesBurned = Math.round(calBurnedPerHour * (duration / 60));
           }
        if (reps ==0) {
            return caloriesBurned;
        } else {
            return caloriesBurned * reps;
        }
    }

    // function getCaloriesFromFood(food, numberOfServing) {
      
    //   const foods = {
    //     "Dosa": 150,
    //     "Idli": 50,
    //     "Sambar": 125,
    //     "Vada": 125,
    //     "Upma": 175,
    //     "Pongal": 250,
    //     "Appam": 125,
    //     "Biryani": 400,
    //     "Parotta": 300,
    //     "Chettinad Chicken": 300,
    //     "Fish Curry": 250,
    //     "Rasam": 75,
    //     "Paniyaram": 125,
    //     "Kothu Parotta": 350,
    //     "Poriyal": 75,
    //     "Avial": 125,
    //     "Lemon Rice": 250,
    //     "Tomato Rice": 250,
    //     "Curd Rice": 250,
    //     "Chicken 65": 250,
    //     "Mutton Curry": 300,
    //     "Masala Dosa": 250,
    //     "Thalappakatti Biriyani": 600,
    //     "Payasam": 250,
    //     "Pal Payasam": 250,
    //     "Mysore Pak": 175,
    //     "Medhu Vada": 125,
    //     "Kuzhi Paniyaram": 125,
    //     "Kozhukattai": 125,
    //     "Adai": 175,
    //     "Puttu": 175,
    //     "Vegetable Biryani": 325,
    //     "Kootu": 125,
    //     "Chicken Chettinad": 300,
    //     "Sevai": 250,
    //     "Karuvattu Kuzhambu": 175,
    //     "Mutton Chukka": 300,
    //     "Murukku": 75,
    //     "Seedai": 75,
    //     "Thattai": 75,
    //     "Mullu Murukku": 75,
    //     "Rava Kesari": 175,
    //     "Rava Upma": 175,
    //     "Sweet Pongal": 250,
    //     "Karasev": 125,
    //     "Idiyappam": 175,
    //     "Mutton Kola Urundai": 300,
    //     "Kaara Kozhukattai": 125,
    //     "Puli Sadam": 300
    // };
    // return foods[food]*numberOfServing;
    // }

    function finalWeight(intialWeight,calBurned,calConsumed,status,tdee){
      if(status=='Loss'){
      intialWeight=intialWeight-(Math.abs((calBurned+calConsumed+250)-(calConsumed))/7700);//initialW-((calburned+tdee)-(calconumed))/7700
      return intialWeight;}
      else{
        intialWeight+=((calConsumed-(tdee))/7700);
        return intialWeight;

      }
    }



    


    export default {calculateBMI,calculateIdealBMI,calculateIdealWeight,calculateBMR,calculateTDEE,calculateCaloriesForWeightChange,getCaloriesFromExercise,finalWeight};
  //   let bmi=Math.round(calculateBMI(74,185));
  //   let bmr=Math.round(calculateBMR("male",74,185,20));
  //   let tdee=Math.round(calculateTDEE(bmr,"moderatelyActive"));
  //   let calWgain=Math.round(calculateCaloriesForWeightGain(tdee,1));
  //   let calWloss=Math.round(calculateCaloriesForWeightLoss(tdee,1));
  //   let calFromExercise=getCaloriesFromExercise("Plank",360,"NA");
  //   let calFromFood=getCaloriesFromFood("Dosa",5);
  //   let wcpe=weightLossPerExercise(84,0,770);

  // console.log(`
  // bmi :${bmi}
  // bmr :${bmr}
  // tdee: ${tdee}
  // tdee x 7: ${tdee*7}
  // calories to be consumed in a day  ${calWgain}
  // calories to be consumed in a week  ${calWgain*7}
  // calories for weight loss:
  // calories consumed in a day ${tdee}
  // calories burned in a day ${calWloss}
  // calories from exercise ${calFromExercise}
  // calories from food ${calFromFood}
  // weight loss per exercise ${wcpe}
  // `);
    // function calculateDailyCalories(age, gender, weight, height) {
      //   // Harris-Benedict Equation for BMR (Basal Metabolic Rate)
      //   let bmr;


      //   if (gender === 'male') {
      //     bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
      //   } else {
      //     bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
      //   }

      //   // Adjust BMR based on activity level
      //   const moderatelyActive =1.55;
          
      //   const totalCalories = bmr * moderatelyActive;
      //   return totalCalories;
      // }
      // function calculateWeightChangeDays(initialWeight, targetWeight, bmi) {
        
      //   const caloriesPerKg = 7700; // Approximate calories per kg of body weight

      //   // Calculate the caloric change needed based on the target weight and current weight
      //   const weightChangeCalories = (targetWeight - initialWeight) * caloriesPerKg;

      //   // Adjust the daily caloric deficit or surplus based on BMI
      //   let dailyCaloricChange = 0;

      //   if (bmi < 18.5) {
      //     // Underweight - encourage weight gain
      //     dailyCaloricChange = 500;
      //   } else if (bmi >= 18.5 && bmi < 24.9) {
      //     // Normal weight - aim for weight maintenance
      //     dailyCaloricChange=1;
      //   } else {
      //     // Overweight or obese - encourage weight loss
      //     dailyCaloricChange = -500;
      //   }

      //   // Calculate the estimated days to reach the target weight
      //   const daysToReachTargetWeight = weightChangeCalories / dailyCaloricChange;

      //   return daysToReachTargetWeight;
      // }
      // function calculateCaloriesToBurn(weightGainPerWeek, activityLevel) {
      //   // Assuming different portions of calories will be burned through exercise based on activity level
      //   const activityLevelFactors = {
      //     sedentary: 0.1,        // 10% burned through exercise
      //     lightlyActive: 0.15,   // 15%
      //     moderatelyActive: 0.2, // 20%
      //     veryActive: 0.25,      // 25%
      //     extraActive: 0.3       // 30%
      //   };

      //   // Default to moderately active if the specified activity level is not recognized
      //   const percentageBurnedThroughExercise = activityLevelFactors[activityLevel] || activityLevelFactors.moderatelyActive;

      //   return weightGainPerWeek * 7700 * percentageBurnedThroughExercise;
      // }
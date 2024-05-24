import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.get("/all", (req, res) => {
  res.json(exercises);
});
app.get("/exercises/:exercise", (req, res) => {
  const name = req.params.exercise;
  console.log("Requested exercise name:", name); // Add this line for 
  const exe = exercises.find((e) => e.exercise == name);
  console.log(exe);
  console.log("Exercise Name: "+exe.exercise+"Exercise cal"+ exe.caloriesBurned);
  res.json(exe);
});


app.listen(port, () => {
  console.log(`Successfully started server on port ${port}.`);
});

const exercises = [
  { exercise: "Running on Treadmill", caloriesBurned: 800 },
  { exercise: "Bench Press", caloriesBurned: 250 },
  { exercise: "Dumbbell Curls", caloriesBurned: 250 },
  { exercise: "Plank", caloriesBurned: 250 },
  { exercise: "Squats", caloriesBurned: 400 },
  { exercise: "Deadlifts", caloriesBurned: 500 },
  { exercise: "Leg Press", caloriesBurned: 500 },
  { exercise: "Shoulder Press", caloriesBurned: 250 },
  { exercise: "Lat Pulldowns", caloriesBurned: 350 },
  { exercise: "Barbell Rows", caloriesBurned: 350 },
  { exercise: "Tricep Dips", caloriesBurned: 250 },
  { exercise: "Hammer Curls", caloriesBurned: 250 },
  { exercise: "Lunges", caloriesBurned: 400 },
  { exercise: "Calf Raises", caloriesBurned: 250 },
  { exercise: "Russian Twists", caloriesBurned: 350 },
  { exercise: "Pull-Ups", caloriesBurned: 500 },
  { exercise: "Push-Ups", caloriesBurned: 250 },
  { exercise: "Burpees", caloriesBurned: 500 },
  { exercise: "Box Jumps", caloriesBurned: 600 },
  { exercise: "Seated Cable Rows", caloriesBurned: 350 },
  { exercise: "Jumping Jacks", caloriesBurned: 500 },
  { exercise: "Cycling (Stationary Bike)", caloriesBurned: 500 },
  { exercise: "Kettlebell Swings", caloriesBurned: 400 },
  { exercise: "Battle Ropes", caloriesBurned: 600 },
  { exercise: "Box Squats", caloriesBurned: 400 },
  { exercise: "Mountain Climbers", caloriesBurned: 500 },
  { exercise: "Jump Rope", caloriesBurned: 700 },
  { exercise: "Medicine Ball Slams", caloriesBurned: 400 },
  { exercise: "Burpees with Push-Up", caloriesBurned: 600 },
  { exercise: "Trx Rows", caloriesBurned: 350 },
  { exercise: "Plank with Shoulder Taps", caloriesBurned: 350 },
  { exercise: "Sprints (High Intensity)", caloriesBurned: 850 },
  { exercise: "Swimming", caloriesBurned: 600 },
  { exercise: "Rowing Machine", caloriesBurned: 500 },
  { exercise: "Elliptical Trainer", caloriesBurned: 500 },
  { exercise: "High Knees", caloriesBurned: 600 },
  { exercise: "Clean and Jerk", caloriesBurned: 600 },
  { exercise: "Farmer's Walk", caloriesBurned: 400 },
  { exercise: "Wall Sits", caloriesBurned: 250 },
  { exercise: "Bench Dips", caloriesBurned: 250 },
  { exercise: "Incline Push-Ups", caloriesBurned: 350 },
  { exercise: "Jumping Lunges", caloriesBurned: 600 },
  { exercise: "Bicycle Crunches", caloriesBurned: 350 },
  { exercise: "Leg Raises", caloriesBurned: 250 },
  { exercise: "Jumping Squats", caloriesBurned: 600 },
  { exercise: "Tuck Jumps", caloriesBurned: 600 },
  { exercise: "Plank with Knee to Elbow", caloriesBurned: 350 },
  { exercise: "Walking Lunges", caloriesBurned: 400 },
  { exercise: "Reverse Crunches", caloriesBurned: 250 },
  { exercise: "Side Plank", caloriesBurned: 250 }
];


const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
app.use(cors());

// Middleware
app.use(express.json());

const PORT = 3000;

// MongoDB connection
mongoose.connect('MongoDB')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define root route handler
app.get('/', (req, res) => {
  res.send('Welcome to the Meal Cards App!');
});

// Meal schema
const mealSchema = new mongoose.Schema({
  name: String,
  type: String,
  description: String,
  image: String,
  clicks: { type: Number, default: 0 } // Click count field
});

// Meal model
const Meal = mongoose.model('Meal', mealSchema);

// Route to fetch meals (unchanged)
app.get('/meals', async (req, res) => {
  try {
    const meals = await Meal.find();
    res.json(meals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to update click count
app.put('/meals/:id/clicks', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedMeal = await Meal.findByIdAndUpdate(id, { $inc: { clicks: 1 } }, { new: true }); // Update click count and return updated document
    if (!updatedMeal) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    res.json(updatedMeal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Route to get a specific meal by ID
app.get('/meals/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const meal = await Meal.findById(id);
    if (!meal) {
      return res.status(404).json({ message: 'Meal not found' });
    }
    res.json(meal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Dummy data seeding
app.post('/seed', async (req, res) => {
  try {
    await Meal.deleteMany(); // Clear existing data
    const meals = await Meal.insertMany([
      { name: "Délicieux Bénédicte", type: "Breakfast/Eggs", description: "Eggs Benedict with hollandaise sauce, crispy bacon and an assortment of garden herbs.", image: "https://images.unsplash.com/photo-1604135307399-86c6ce0aba8e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1374&q=80" },
      { name: "Scrumptious Pancakes", type: "Breakfast/Pancakes", description: "Fluffy pancakes served with maple syrup, fresh berries, and a dollop of whipped cream.", image: "https://images.unsplash.com/photo-1514945022200-437ec2f8bb61?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
      { name: "Savory Avocado Toast", type: "Breakfast/Toast", description: "Toasted sourdough bread topped with mashed avocado, cherry tomatoes, feta cheese, and a drizzle of balsamic glaze.", image: "https://images.unsplash.com/photo-1557339770-279d18e2c7b2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
      // Add more meal objects here
    ]);
    res.status(201).json(meals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Server start
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

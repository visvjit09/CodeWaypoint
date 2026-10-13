
require("dotenv").config();

const mongoose = require("mongoose");
const Category = require("./models/Category");

const categories = [
  {
    name: "Programming Fundamentals",
    description: "Learn programming languages and core concepts.",
  },
  {
    name: "Data Structures & Algorithms",
    description: "Learn data structures, algorithms, and problem solving.",
  },
  {
    name: "Web Development",
    description: "Learn frontend and backend web development.",
  },
  {
    name: "App Development",
    description: "Learn to build mobile and desktop applications.",
  },
  {
    name: "Data Science",
    description: "Learn data analysis and data science fundamentals.",
  },
  {
    name: "Machine Learning",
    description: "Learn machine learning concepts and applications.",
  },
];

async function seedCategories() {
  try {
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL is missing from server/.env");
    }

    await mongoose.connect(process.env.MONGODB_URL);

    for (const category of categories) {
      await Category.updateOne(
        { name: category.name },
        { $setOnInsert: category },
        { upsert: true }
      );
    }

    console.log("Categories are ready.");
  } catch (error) {
    console.error("Category seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedCategories();

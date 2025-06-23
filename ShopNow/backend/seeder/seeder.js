import mongoose from "mongoose"; 
import products from "./data.js"; 
import Product from "../models/product.js"; 

const seedProducts = async () => {
  try {
    // Connect to DB
    await mongoose.connect("mongodb+srv://caesar:pogi123@shopna.vd42asa.mongodb.net/ShopNa?retryWrites=true&w=majority&appName=ShopNa");

    // Delete existing products
    await Product.deleteMany();
    console.log("Existing products deleted");

    // Insert products
    await Product.insertMany(products);
    console.log("New products inserted successfully");

    process.exit();
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();

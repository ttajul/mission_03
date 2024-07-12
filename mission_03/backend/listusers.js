const mongoose = require("mongoose");

// Connect to your MongoDB
mongoose.connect("mongodb://localhost:27017/yourdbname", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define the user schema (if not already defined)
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

// Create a user model
const User = mongoose.model("User", userSchema);

// Function to list all users
async function listUsers() {
  try {
    const users = await User.find();
    console.log(users);
  } catch (error) {
    console.error("Error listing users:", error);
  } finally {
    mongoose.connection.close();
  }
}

// Call the function
listUsers();

const express = require("express");


const app = express();

// Middleware
app.use(express.json());
app.use("/api", apiRoutes);

// Database connection
/*if (process.env.NODE_ENV !== "test") {
  mongoose.connect("mongodb://localhost:27017/yourdbname", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}*/
//commented for testing purposes

const PORT = 3000; // Ensure this is set to 3000
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

export default app;

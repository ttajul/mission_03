const express = require("express");
const mongoose = require("mongoose");
const apiRoutes = require("./routes/api");
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
require('dotenv').config();



// Middleware
app.use(express.json());
app.use("/api", apiRoutes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//routes
const aiRoutes = require('./routes/aiRoutes');

//endpoints
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use('/api/ai', aiRoutes); 




const PORT = 3000; // Ensure this is set to 3000
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});



module.exports = app;


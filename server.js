const express = require('express');
const app = express();
const port = 9000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the HRMS API!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
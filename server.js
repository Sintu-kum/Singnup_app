const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8090; // Port number

// Middleware to parse incoming form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the root page
app.get('/', (req, res) => {
  res.send('Welcome! Go to <a href="/signup">Signup</a> or <a href="/login">Login</a>');
});

// Serve the signup form
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup.html')); // Ensure this path is correct
});

// Serve the login form
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html')); // Ensure this path is correct
});

// Handle signup form submission
app.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  
  // Store the data in a file
  const userData = `${username},${email},${password}\n`;
  fs.appendFile(path.join(__dirname, 'users.txt'), userData, (err) => { // Ensure this path is correct
    if (err) {
      console.error('Error saving data:', err);
      return res.status(500).send('Error saving data');
    }
    res.send('Signup successful! <a href="/login">Login here</a>');
  });
});

// Handle login form submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Read user data from the file
  fs.readFile(path.join(__dirname, 'users.txt'), 'utf8', (err, data) => { // Ensure this path is correct
    if (err) {
      console.error('Error reading data:', err);
      return res.status(500).send('Error reading data');
    }
    
    // Check if the user exists
    const users = data.trim().split('\n');
    const userFound = users.some(user => {
      const [fileUsername, , filePassword] = user.split(',');
      return fileUsername === username && filePassword === password;
    });
    
    if (userFound) {
      res.send('Login successful!');
    } else {
      res.send('Invalid username or password. <a href="/login">Try again</a>');
    }
  });
});

// Start the server on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

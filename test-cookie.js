const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

// Middleware to manage sessions
app.use((req, res, next) => {
  // Check if there's a session cookie present
  if (req.cookies.session) {
    console.log("Session active");
  } else {
    console.log("Session inactive");
  }
  next();
});

// Route to set the cookie
app.get('/set-cookie', (req, res) => {
  // Set cookie to expire after 3 minutes
  res.cookie('session', 'active', { maxAge: 10000 }); // 3 minutes = 180000 milliseconds
  res.send('Cookie set!');
});

// Route to clear the cookie
app.get('/clear-cookie', (req, res) => {
  // Clear cookie by setting its expiration to a past date
  res.cookie('session', '', { expires: new Date(0) });
  res.send('Cookie cleared!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

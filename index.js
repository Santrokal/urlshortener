require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const validUrl = require("valid-url"); // Use this for validation
const bodyParser = require('body-parser');

const urlDatabase = {};


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// POST: Create short URL
app.post("/api/shorturl", (req, res) => {
  const originalUrl = req.body.url;

  // ✅ Validate URL
  if (!validUrl.isWebUri(originalUrl)) {
    return res.json({ error: "invalid url" });
  }

  // Generate random 5-digit ID
  const id = Math.floor(10000 + Math.random() * 90000);

  // Save mapping
  urlDatabase[id] = originalUrl;

  res.json({
    original_url: originalUrl,
    short_url: id,
  });
});

// GET: Redirect to original URL
app.get("/api/shorturl/:id", (req, res) => {
  const id = req.params.id;
  const originalUrl = urlDatabase[id];

  if (originalUrl) {
    return res.redirect(originalUrl);
  } else {
    return res.json({ error: "No short URL found for given input" });
  }
});


// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

const express = require("express");
const logger = require("morgan");
const app = express();
const PORT = process.env.PORT || 5000;

require("dotenv").config();

// Use Morgan for dev logging
app.use(logger("dev"));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
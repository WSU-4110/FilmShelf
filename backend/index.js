const express = require("express");
const fs = require("fs").promises; // Using fs.promises for asynchronous file operations
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
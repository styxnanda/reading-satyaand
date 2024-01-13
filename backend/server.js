const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5001;

app.use(cors());

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("/pdf/:filename", (req, res) => {
	res.sendFile(path.join(__dirname, "public", req.params.filename));
});

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

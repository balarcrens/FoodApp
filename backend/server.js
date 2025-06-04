const express = require("express");
const multer = require("multer");
const FormData = require("form-data");
const fetch = require("node-fetch");
const fs = require("fs");
const cors = require("cors");
// const path = require("path");

const app = express();
app.use(cors());
app.use(express.static("public")); // To serve HTML frontend

const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const apiKey = "0cca656a-6467-41a1-8d62-e972404988bf";
        const formData = new FormData();
        formData.append("file", fs.createReadStream(req.file.path));

        const response = await fetch("https://pixeldrain.com/api/file", {
            method: "POST",
            headers: {
                "Authorization": "Basic " + Buffer.from(":" + apiKey).toString("base64")
            },
            body: formData
        });

        const result = await response.json();

        // Delete temp uploaded file
        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            id: result.id,
            url: `https://pixeldrain.com/u/${result.id}`
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Upload failed" });
    }
});

app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));

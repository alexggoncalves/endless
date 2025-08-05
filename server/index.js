import dotenv from "dotenv";
import express from "express";
import cors from "cors";
dotenv.config();

const app = express();
const port = 3000;

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

app.use(express.json());
app.use(cors());

app.post("/get-token", async (req, res) => {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        body: new URLSearchParams({
            grant_type: "client_credentials",
        }),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
                "Basic " +
                Buffer.from(client_id + ":" + client_secret).toString("base64"),
        },
    });

    const data = await response.json();


    if (data.access_token) {
        res.json({ access_token: data.access_token, expires_in: data.expires_in });
    } else {
        res.status(500).json({ error: "No token received", raw: data });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

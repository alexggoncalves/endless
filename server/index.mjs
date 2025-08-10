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

const spotifyPreviewFinder = await import("spotify-preview-finder").then(
    (mod) => mod.default || mod
);

app.post("/get-token", async (req, res) => {
    try {
        const authorizationHeader = {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
                "Basic " +
                Buffer.from(client_id + ":" + client_secret).toString("base64"),
        };

        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: authorizationHeader,
            body: new URLSearchParams({
                grant_type: "client_credentials",
            }),
        });

        const data = await response.json();

        if (response.ok) {
            res.json({
                access_token: data.access_token,
                expires_in: data.expires_in,
            });
        } else {
            res.status(response.status).json({ error: data });
        }
    } catch (e) {
        res.status(500).json({
            error: "Internal server error during token request",
            message: e.message,
        });
    }
});

app.get("/song-preview", async (req, res) => {
    const { song, artist } = req.query;

    if (!song || !artist) {
        return res
            .status(400)
            .json({ error: "Missing song or artist parameter" });
    }

    try {
        const result = await spotifyPreviewFinder(song, artist, 1);

        if (result.success) {
            res.json({
                searchQuery: result.searchQuery,
                results: result.results,
            });
        } else {
            res.status(500).json({ error: result.error });
        }
    } catch (e) {
        res.status(500).json({
            error: "Internal server error during token request",
            message: e.message,
        });
    }
});

app.post("/song-previews", async (req, res) => {
    // const searches = [
    //     { song: "Bohemian Rhapsody", artist: "Queen" },
    //     { song: "Hotel California", artist: "Eagles" },
    //     { song: "Imagine", artist: "John Lennon" },
    // ];

    const searches = req.body;

    if (!Array.isArray(searches) || searches.length === 0) {
        return res
            .status(400)
            .json({ error: "Request body must be a non-empty array" });
    }

    let songs = [];

    try {
        let result;

        for (const search of searches) {
            if (search.artist) {
                result = await spotifyPreviewFinder(
                    search.song,
                    search.artist,
                    1
                );
            } else {
                result = await spotifyPreviewFinder(search.song, 1);
            }

            if (result.success && result.results.length > 0) {
                const song = result.results[0];
                songs.push(song);
            } else {
                songs.push(null);
            }
        }

        res.json({
            success: true,
            songs: songs,
        });
    } catch (e) {
        res.status(500).json({
            error: "Internal server error during token request",
            message: e.message,
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

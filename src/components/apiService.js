import { createBucketClient } from "@cosmicjs/sdk";

const cosmic = createBucketClient({
    bucketSlug: "endless-production",
    readKey: "UifAf7d5l53oSwQ11U6Qv4u8DLBgYZgJFsiBiSfWXZtJdZ75Vw",
});

export const getAllSongs = async () => {
    try {
        const response = await cosmic.objects.find({
            type: "songs"
        })

        return response.objects;
    } catch (error) {
        throw error;
    }
};

export const getSongByID = async (id) => {
    try {
        const response = await cosmic.objects.find({
            type: "songs",
            id: id,
        })

        return response.objects[0];
    } catch (error) {
        throw error;
    }
};

export const getArtistByID = async (id) => {
    try {
        const response = await cosmic.objects.find({
            type: "artists",
            id: id,
        });

        return response.objects[0];
    } catch (error) {
        throw error;
    }
};

export const getAlbumByID = async (id) => {
    try {
        const response = await cosmic.objects.find({
            type: "albums",
            id: id,
        });
        return response.objects[0];
    } catch (error) {
        throw error;
    }
};


import { createBucketClient } from "@cosmicjs/sdk";

const cosmic = createBucketClient({
    bucketSlug: "endless-production",
    readKey: "UifAf7d5l53oSwQ11U6Qv4u8DLBgYZgJFsiBiSfWXZtJdZ75Vw",
});

export const getAllSongs = async () => {
    try {
        const response = await cosmic.objects.find({
            type: "songs",
        }).props([
            'id',
            'title',
            'metadata.artist',
            'metadata.album',
            'metadata.cover_image',
            'metadata.thumbnail',
            'metadata.year',
            'metadata.genre',
            'metadata.duration'
        ]);

        return response.objects;
    } catch {
        console.log("a");
    }
};

export const getSongByID = async (id) => {
    const response = await cosmic.objects.find({
        type: "songs",
        id: id,
    }).props([
        'id',
        'title',
        'metadata.artist',
        'metadata.album',
        'metadata.cover_image',
        'metadata.thumbnail',
        'metadata.year',
        'metadata.genre',
        'metadata.duration'
    ]);;

    return response.objects[0];
};

export const getArtistByID = async (id) => {
    const response = await cosmic.objects.find({
        type: "artists",
        id: id,
    });

    return response.objects[0];
};

export const getAlbumByID = async (id) => {
    const response = await cosmic.objects.find({
        type: "albums",
        id: id,
    });
    return response.objects[0];
};

export const searchSongsByName = async (name) => {
    try {
        const response = await cosmic.objects.find({
            type: "songs",
            title: {
                $regex: name,
                $options: "i", // case insensitive
            },
        }).props([
            'id',
            'title',
            'metadata.artist',
            'metadata.album',
            'metadata.cover_image',
            'metadata.thumbnail',
            'metadata.year',
            'metadata.genre',
            'metadata.duration'
        ]);;
        return response.objects;
        // return response.objects;
    } catch(error) {
        return 
    }

    
};

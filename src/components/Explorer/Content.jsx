import SongTile from "./SongTile";
import { createBucketClient } from "@cosmicjs/sdk";

const maxSize = 250,
    minSize = 180;

const boundSize = 1000;

const cosmic = createBucketClient({
    bucketSlug: "endless-production",
    readKey: "UifAf7d5l53oSwQ11U6Qv4u8DLBgYZgJFsiBiSfWXZtJdZ75Vw",
});

const songs = await cosmic.objects.find({
    type: "songs",
})



const tempURL =
    "https://imgix.cosmicjs.com/8c3a0de0-9912-11ee-b62d-5b90a0a1bade-c7e4b8a305e2852d2c3c697fb4e721f8.1000x1000x1.jpg";

function Content(props) {
    const musicAmount = 50;
    const musicList = [];

    for (var i = 0; i < musicAmount; i++) {
        musicList.push(1);
    }
    return (
        <group>
            {songs.objects.map((song, index) => {
                const size = Math.random() * (maxSize - minSize) + minSize;

                return (
                    <SongTile
                    
                        key={index}
                        position={{
                            x: (Math.random() - 0.5) * boundSize,
                            y: (Math.random() - 0.5) * boundSize,
                        }}
                        size={size}
                        song={song}
                        
                    />
                );
            })}
        </group>
    );
}

export default Content;

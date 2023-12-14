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

function Content(props) {

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

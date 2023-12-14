import { createBucketClient } from "@cosmicjs/sdk";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const cosmic = createBucketClient({
    bucketSlug: "endless-production",
    readKey: "UifAf7d5l53oSwQ11U6Qv4u8DLBgYZgJFsiBiSfWXZtJdZ75Vw",
});

async function getSong(id) {
    const promise = await cosmic.objects.find({
        type: "songs",
        id: id,
    });
    return promise;
}
function Song() {
    const [songInfo, setInfo] = useState();
    const { songID } = useParams();

    useEffect(() => {
        getSong(songID).then((response) => {
            setInfo(response.objects[0]);
            console.log(response.objects[0]);
        });
    }, []);

    if (songInfo) {
        return (
            <>
                <h1>{songInfo.title}</h1>
                <img height={200} src={songInfo.metadata.cover_image.imgix_url} alt={songInfo.title + " cover art"} />
            </>
        );
    } else return <></>;
}

export default Song;

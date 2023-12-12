import { createBucketClient } from "@cosmicjs/sdk";

import Header from "./components/Header";
import Explorer from "./components/Explorer/Explorer";
import Archive from "./components/Archive/Archive";

const cosmic = createBucketClient({
    bucketSlug: "endless-production",
    readKey: "UifAf7d5l53oSwQ11U6Qv4u8DLBgYZgJFsiBiSfWXZtJdZ75Vw",
});

await cosmic.objects
  .find({
    type: 'artists',
  })

function App() {
    return (
        <>
            {/* <Header /> */}
            {/* <Explorer />
            <Archive /> */}
        </>
    );
}

export default App;

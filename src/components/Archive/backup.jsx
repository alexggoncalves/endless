    // Update order of list when user changes ordering parameters
useEffect(() => {
    if (list) {
        let sortedList = list;
        if (orderBy == "title") {
            if (orderDirection) {
                sortedList.sort((a, b) => orderByName(b.title, a.title));
            } else {
                sortedList.sort((a, b) => orderByName(a.title, b.title));
            }
        } else if (orderBy == "artist") {
            if (orderDirection) {
                sortedList.sort((a, b) =>
                    orderByName(
                        b.metadata.artist[0].title,
                        a.metadata.artist[0].title
                    )
                );
            } else {
                sortedList.sort((a, b) =>
                    orderByName(
                        a.metadata.artist[0].title,
                        b.metadata.artist[0].title
                    )
                );
            }
        } else if (orderBy == "album") {
            if (orderDirection) {
                sortedList.sort((a, b) =>
                    orderByName(
                        b.metadata.album.title,
                        a.metadata.album.title
                    )
                );
            } else {
                sortedList.sort((a, b) =>
                    orderByName(
                        a.metadata.album.title,
                        b.metadata.album.title
                    )
                );
            }
        } else if (orderBy == "genre") {
            if (orderDirection) {
                sortedList.sort((a, b) =>
                    orderByName(b.metadata.genre, a.metadata.genre)
                );
            } else {
                sortedList.sort((a, b) =>
                    orderByName(a.metadata.genre, b.metadata.genre)
                );
            }
        } else if (orderBy == "year") {
            if (orderDirection) {
                sortedList.sort((a, b) => {
                    return b - a;
                });
            } else {
                sortedList.sort((a, b) => {
                    return a - b;
                });
            }
        } else if (orderBy == "duration") {
            if (orderDirection) {
                sortedList.sort((a, b) =>
                    orderByName(b.metadata.duration, a.metadata.duration)
                );
            } else {
                sortedList.sort((a, b) =>
                    orderByName(a.metadata.duration, b.metadata.duration)
                );
            }
        }

        setList(sortedList);
    }
}, [orderBy, orderDirection, list]);
export const artistsToString = (artists) => {
    let output = "";

    artists.map((artist, index) => {
        if (index == artists.length - 1) {
            output += artist.name;
        } else output += artist.name + ", ";
    });

    return output;
};

export const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

export const sortList = (array, sortBy, sortDirection) => {
    switch (sortBy) {
        case "title":
            return sortByTitle(array, sortDirection);
        case "artist":
            return sortByArtist(array, sortDirection);
        case "album":
            return sortByAlbum(array, sortDirection);
        case "genre":
            return sortByGenre(array, sortDirection);
        case "year":
            return sortByYear(array, sortDirection);
        case "duration":
            return sortByDuration(array, sortDirection);
    }
};

const sortByString = (a, b, direction) => {
    const nameA = a.toUpperCase();
    const nameB = b.toUpperCase();

    if (nameA < nameB) {
        return -1 * direction;
    }
    if (nameA > nameB) {
        return 1 * direction;
    }

    return 0;
};

export const sortByInt = (a, b, direction) => {
    return (a - b) * direction;
};
const sortByTitle = (array, direction) => {
    const temp = array;
    temp.sort((a, b) => sortByString(a.title, b.title, direction));
    return temp;
};
const sortByArtist = (array, direction) => {
    const temp = array;
    temp.sort((a, b) =>
        sortByString(
            a.metadata.artist[0].title,
            b.metadata.artist[0].title,
            direction
        )
    );
    return temp;
};

const sortByAlbum = (array, direction) => {
    const temp = array;
    temp.sort((a, b) =>
        sortByString(a.metadata.album.title, b.metadata.album.title, direction)
    );
    return temp;
};

const sortByGenre = (array, direction) => {
    const temp = array;
    temp.sort((a, b) =>
        sortByString(a.metadata.genre, b.metadata.genre, direction)
    );
    return temp;
};

const sortByYear = (array, direction) => {
    const temp = array;
    temp.sort((a, b) => sortByInt(a.metadata.year, b.metadata.year, direction));
    return temp;
};

const sortByDuration = (array, direction) => {
    const temp = array;
    temp.sort((a, b) =>
        sortByString(a.metadata.duration, b.metadata.duration, direction)
    );
    return temp;
};

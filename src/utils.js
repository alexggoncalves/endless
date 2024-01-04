export const artistsToString = (array) => {
    let output = "";

    for (let i = 0; i < array.length; i++) {
        if (i == array.length - 1) {
            output += array[i].title;
        } else output += array[i].title + ", ";
    }
    return output;
};

export const orderByName = (a, b) => {
    const nameA = a.toUpperCase();
    const nameB = b.toUpperCase();

    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }

    // names must be equal
    return 0;
};

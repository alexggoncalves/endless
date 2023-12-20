export const artistsToString = (array) => {
    let output = "";

    for (let i = 0; i < array.length; i++) {
        if (i == array.length - 1) {
            output += array[i].title;
        } else output += array[i].title + ", ";
    }
    return output;
};

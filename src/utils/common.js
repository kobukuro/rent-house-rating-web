export let findIndexByColumnValue = function (data, column_name, value) {
    let index = -1
    for (let i = 0; i < data.length; i++) {
        if (data[i][column_name] === value) {
            index = i;
        }
    }
    return index
}
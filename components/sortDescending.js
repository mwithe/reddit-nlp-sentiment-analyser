//Bubble sort function - array and property parameters example: peopleData.mentions or postData.comments
function sortDescending(array, property){
    let swapped;
    do {
      swapped = false;
      for (let i = 0; i < array.length - 1; i++) {
        if (array[i][`${property}`] < array[i + 1][`${property}`]) {
          let temp = array[i][`${property}`];
          array[i][`${property}`] = array[i + 1][`${property}`];
          array[i + 1][`${property}`] = temp;
          swapped = true;
        }
      }
    } while (swapped);

    //Removes entries where count of property is 0.
    for (let i = array.length - 1; i >= 0; i--) {
        if (array[i][`${property}`] === 0) {
            array.pop();
        }
    }
    return array;
};

module.exports = {sortDescending};
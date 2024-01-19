const ner = require('compromise');

//Gets the length of the name identified (best results came from 2 word count i.e. John Smith)
function getWordCount(str) {
    return str.split(' ')
      .filter(function(n) { return n != '' })
      .length;
}

//Checks last name isn't a single character
function checkLastNameLength(str) {
  let lastName = str.split(' ')[1];
  return lastName.length;
}

function namedEntityRecognition(data) {
  const peopleMentioned = [];
  for (let i = 0; i < data.length; i++){                     //Iterate over each post in posts from reddit
    for (let x = 0; x < data[i].comments.length; x++) {      //Iterate over each commment on a post
      let postComments = ner(data[i].comments[x]);           //Telling compromise/NER package WHAT the data is to look at (each comment iterated over)
      let people = postComments.people().normalize().text();      //Telling compromise/NER package to recognise names in the data

      peopleUpperCase = people.toUpperCase();               //Found names converted to uppercase to avoid duplicates
      if (peopleUpperCase !== ''                            //If name is not empty
              && !peopleUpperCase.includes('.')             //Doesn't include the below punctuation or 'REDDIT' (came up a few times)
              && !peopleUpperCase.includes("'")
              && !peopleUpperCase.includes('"')             //Before these && statements were implemented there was ~250 'names', but most weren't actually names.
              && !peopleUpperCase.includes("*")
              && !peopleUpperCase.includes("!")
              && !peopleUpperCase.includes("<")
              && !peopleUpperCase.includes(">")
              && !peopleUpperCase.includes("REDDIT")
              && getWordCount(peopleUpperCase) == 2         //Name must be 2 words long (first and last name)
              && checkLastNameLength(peopleUpperCase) > 1   //Last name must be longer than 1 character (Chandler B wasn't informative enough)
              && !peopleMentioned.includes(peopleUpperCase) //Check that the name doesn't already exist in the storage array
          ) {
            peopleMentioned.push(peopleUpperCase);          //If satisfies above, push to storage array.
      };
    };
  };
  return peopleMentioned;
};

module.exports = {namedEntityRecognition};
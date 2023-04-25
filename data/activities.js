//file containing functions for quizes, flashcards, and matching
const listsFunc = require('../data/list');
const helpers = require("../helpers");


const randomizeOrder = async (listID) => {
  listID = helpers.checkID(listID);
  const list = await listsFunc.getWordListById(listID);
  let list_of_words = list.words;
  let list_of_definitions = list.definitions;
  if (list_of_words.length !== list_of_definitions.length) throw 'Input arrays must have the same length';
  if (list_of_words.length < 2) throw 'there must be at least 2 words in the word list to play this game';

  // Fisher-Yates shuffle algorithm
  for (let i = list_of_words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list_of_words[i], list_of_words[j]] = [list_of_words[j], list_of_words[i]];
    [list_of_definitions[i], list_of_definitions[j]] = [list_of_definitions[j], list_of_definitions[i]];
  }

  return [list_of_words, list_of_definitions];
}

//todo Quizzes


//todo flashcards


//todo matching


module.exports= {
  randomizeOrder
}
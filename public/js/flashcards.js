const { getWordListById } = require('../../data/list.js');
let start = document.getElementById('startForm') ;

// let input = document.getElementById('numberList')
// let results = document.getElementById('results')

let currentIndex = 0;
if(start) {
  console.log("4")
  start.addEventListener('submit', e =>   {
    e.preventDefault();
    console.log("here1")
    document.addEventListener('click', async function(event) {
      console.log("here2")
      const targetId = event.target.id;
      let url = window.location.href;
      var match = url.match(/\/([^\/?]+)(?:\?|$)/);
      var id = match[1];
      console.log(id);
      let list = await getWordListById(id);
      let list_of_words = list.words;
      console.log(list_of_words);
      if (targetId.startsWith('word-')) {
        // Show the definition for the clicked word
        const index = parseInt(targetId.substring(5));
        document.getElementById(`definition-${index}`).style.display = 'block';
      } else if (targetId.startsWith('definition-')) {
        // Hide the definition for the clicked word and show the next word
        const index = parseInt(targetId.substring(11));
        document.getElementById(`definition-${index}`).style.display = 'none';
        currentIndex++;
        if (currentIndex < words.length) {
          // There are still more words to show
          document.getElementById(`word-${currentIndex}`).style.display = 'block';
        } else {
          // All words have been shown
          document.getElementById('flashcard').innerHTML = 'All done!';
        }
      }
    });
    
  });
  
}
//document.getElementById(`word-${currentIndex}`).style.display = 'block';

// // Define the words and definitions
// const word = {{json words}};
// const definition = {{json definitions}};

// // Initialize the current index and definition visibility
// let currentIndex = 0;
// let isDefinitionHidden = true;

// // Initialize the first word
// document.getElementById('word').innerHTML = words[0];

// // Add a click event listener to the document
// document.addEventListener('click', function() {
//   if (isDefinitionHidden) {
//     // Show the definition
//     document.getElementById('definition').style.display = 'block';
//     isDefinitionHidden = false;
//   } else {
//     // Hide the definition and show the next word
//     document.getElementById('definition').style.display = 'none';
//     currentIndex++;
//     if (currentIndex < words.length) {
//       // There are still more words to show
//       document.getElementById('word').innerHTML = words[currentIndex];
//       isDefinitionHidden = true;
//     } else {
//       // All words have been shown
//       document.getElementById('flashcard').innerHTML = 'All done!';
//     }
//   }
// });


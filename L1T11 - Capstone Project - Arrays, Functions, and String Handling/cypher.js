/*  97 98 99 100 101 102 103 104 105 106 107 108 109 110 111 112 113 114 115 116 117 118 119 120 121 122  
    a  b  c   d   e   f   g   h   i   j   k   l   m   n   o   p   q   r   s   t   u   v   w   x   y   z
    p  q  r   s   t   u   v   w   x   y   z   a   b   c   d   e   f   g   h   i   j   k   l   m   n   o
    
    65 66 67 68 69 70 71 72 73 74 75 76 77 78 79 80 81 82 83 84 85 86 87 88 89 90
    A  B  C  D  E  F  G  H  I  J  K  L  M  N  O  P  Q  R  S  T  U  V  W  X  Y  Z
    P  Q  R  S  T  U  V  W  X  Y  Z  A  B  C  D  E  F  G  H  I  J  K  L  M  N  O

(0 > (x - 15) < 26) - 26

1. No predefined alphabet array should be used.
2. Convert letters into numbers using the ASCII table.
3. Consider both uppercase and lowercase letters from the ASCII table.
4. Spaces and punctuation marks must remain unchanged.
5. Use a formula to determine the 15th letter of the alphabet dynamically.
*/

// Function to get the ASCII values.
function lowerCaseLetters(userInput) {
  let userInputArray = [];
  let userInputSplit = userInput.split(``);
  for (let x = 0; x < userInput.length; x++) {
    userInputArray.push(userInputSplit[x].charCodeAt(0));
  }
  return userInputArray;
}

let userInput;
// User input word that will be cyphered and while loop if not inputted.
while (true) {
  userInput = prompt(`Please provide a word to be converted into cypher`);
  // Check if the user input is not empty.
  if (userInput !== "") {
    break;
  } else {
    alert(`Invalid input, please enter a valid word.`);
  }
}

let asciiValues = lowerCaseLetters(userInput);
let convertedLetters = [];

// Loop through the ASCII values.
for (let x = 0; x < asciiValues.length; x++) {
  let shiftedAscii = asciiValues[x];

  // Check if the letter is uppercase.
  if (asciiValues[x] >= 65 && asciiValues[x] <= 90) {
    if (asciiValues[x] + 15 >= 65 && asciiValues[x] + 15 <= 90) {
      shiftedAscii = asciiValues[x] + 15;
    } else if (
      asciiValues[x] + 15 - 26 >= 65 &&
      asciiValues[x] + 15 - 26 <= 90
    ) {
      shiftedAscii = asciiValues[x] + 15 - 26;
    }
    // Check if the letter is lowercase.
  } else if (asciiValues[x] >= 97 && asciiValues[x] <= 122) {
    if (asciiValues[x] + 15 >= 97 && asciiValues[x] + 15 <= 122) {
      shiftedAscii = asciiValues[x] + 15;
    } else if (
      asciiValues[x] + 15 - 26 >= 97 &&
      asciiValues[x] + 15 - 26 <= 122
    ) {
      shiftedAscii = asciiValues[x] + 15 - 26;
    }
    // Check if the letter is not a letter.
  } else if (
    !asciiValues[x] >= 97 &&
    !asciiValues[x] <= 122 &&
    !asciiValues[x] >= 65 &&
    !asciiValues[x] <= 90
  ) {
    shiftedAscii = asciiValues[x];
  }
  // Push the converted letter into the array.
  convertedLetters.push(String.fromCharCode(shiftedAscii));
}
// Join the array into a string.
let result = convertedLetters.join(``);
alert(result);

/* --- Where did I found information from ---
    1. ChatGPT
        To check my spelling and grammar.
        https://chatgpt.com/
    2. stackoverflow
        I found some information about how to convert letters to numbers.
        https://stackoverflow.com/questions/22624379/how-to-convert-letters-to-numbers-with-javascript
    3. alpharithms
        I found some information about the ASCII table
        https://www.alpharithms.com/ascii-table-512119/
    4. Wikipedia
        I found some information about the caesar cipher and the formula they used.
        https://en.wikipedia.org/wiki/Caesar_cipher
*/

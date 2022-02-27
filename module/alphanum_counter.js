exports.alphaNumCounter = (cur) => {
  var i = 0;
  var count = cur / 26;
  var v = "";
  while (count != 0) {
    i = cur % 26;
    v = v + alpnum[i];
    count--;
  }
  return cur;
};

const alpnum = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "0",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

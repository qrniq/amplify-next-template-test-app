// In-memory word list storage
let wordList: string[] = [];

export const getWordList = (): string[] => {
  return [...wordList];
};

export const addWord = (word: string): boolean => {
  if (!word || typeof word !== 'string') {
    return false;
  }
  
  const trimmedWord = word.trim();
  if (!trimmedWord) {
    return false;
  }
  
  if (!wordList.includes(trimmedWord)) {
    wordList.push(trimmedWord);
    return true;
  }
  
  return false; // Word already exists
};

export const resetWordList = (): void => {
  wordList = [];
};

export const removeWord = (word: string): boolean => {
  const index = wordList.indexOf(word);
  if (index > -1) {
    wordList.splice(index, 1);
    return true;
  }
  return false;
};

export const getWordCount = (): number => {
  return wordList.length;
};
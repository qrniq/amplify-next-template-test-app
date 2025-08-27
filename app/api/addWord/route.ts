import { NextRequest, NextResponse } from 'next/server';
import { addWord, getWordList, getWordCount } from '../wordlist';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { word } = body;
    
    if (!word) {
      return NextResponse.json(
        { error: 'Word is required', success: false },
        { status: 400 }
      );
    }
    
    const added = addWord(word);
    const wordList = getWordList();
    const wordCount = getWordCount();
    
    if (added) {
      return NextResponse.json({
        success: true,
        message: `Word "${word}" added successfully`,
        word: word,
        wordList: wordList,
        wordCount: wordCount,
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        success: false,
        message: `Word "${word}" already exists in the list`,
        word: word,
        wordList: wordList,
        wordCount: wordCount,
        timestamp: new Date().toISOString()
      });
    }
    
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to add word',
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    wordList: getWordList(),
    wordCount: getWordCount(),
    timestamp: new Date().toISOString()
  });
}
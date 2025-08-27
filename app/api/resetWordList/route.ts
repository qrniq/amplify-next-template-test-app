import { NextRequest, NextResponse } from 'next/server';
import { resetWordList, getWordCount } from '../wordlist';

export async function POST(request: NextRequest) {
  try {
    const previousCount = getWordCount();
    resetWordList();
    
    return NextResponse.json({
      success: true,
      message: `Word list reset successfully. Removed ${previousCount} words.`,
      previousCount: previousCount,
      currentCount: 0,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to reset word list',
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const previousCount = getWordCount();
    resetWordList();
    
    return NextResponse.json({
      success: true,
      message: `Word list reset successfully. Removed ${previousCount} words.`,
      previousCount: previousCount,
      currentCount: 0,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to reset word list',
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
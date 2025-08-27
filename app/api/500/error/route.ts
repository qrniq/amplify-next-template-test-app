import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // This endpoint always throws an actual server error
  throw new Error('This is an intentional server error for testing purposes');
}

export async function POST(request: NextRequest) {
  // Simulate different types of server errors
  const errorTypes = [
    () => { throw new Error('Database connection lost'); },
    () => { throw new TypeError('Cannot read property of undefined'); },
    () => { throw new RangeError('Array index out of bounds'); },
    () => { throw new ReferenceError('Variable is not defined'); },
    () => { 
      // Simulate memory issue
      const largeArray = new Array(1000000).fill('error');
      throw new Error(`Memory error with ${largeArray.length} items`);
    }
  ];
  
  // Randomly select an error type
  const randomError = errorTypes[Math.floor(Math.random() * errorTypes.length)];
  randomError();
}

export async function PUT(request: NextRequest): Promise<never> {
  // Simulate async error
  await new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('Async operation failed after timeout'));
    }, 1000);
  });
  
  // This line will never be reached due to the rejection above
  throw new Error('This should never execute');
}

export async function DELETE(request: NextRequest) {
  // Force a 500 by returning invalid response
  return new Response('This is not a valid JSON response', {
    status: 200,
    headers: { 'Content-Type': 'application/json' } // This mismatch will cause issues
  });
}
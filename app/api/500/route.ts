import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const errorType = url.searchParams.get('type') || 'generic';
  const delay = parseInt(url.searchParams.get('delay') || '0');
  
  // Add optional delay before error
  if (delay > 0) {
    await new Promise(resolve => setTimeout(resolve, Math.min(delay, 10000)));
  }

  const errorResponses = {
    generic: {
      error: 'Internal Server Error',
      message: 'Something went wrong on the server',
      code: 'INTERNAL_ERROR',
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9)
    },
    database: {
      error: 'Database Connection Error',
      message: 'Unable to connect to the database server',
      code: 'DB_CONNECTION_FAILED',
      details: 'Connection timeout after 30 seconds',
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9)
    },
    timeout: {
      error: 'Request Timeout',
      message: 'The request took too long to process',
      code: 'REQUEST_TIMEOUT',
      timeout: '30000ms',
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9)
    },
    validation: {
      error: 'Validation Error',
      message: 'Invalid request parameters',
      code: 'VALIDATION_FAILED',
      errors: [
        { field: 'email', message: 'Invalid email format' },
        { field: 'password', message: 'Password too weak' }
      ],
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9)
    },
    auth: {
      error: 'Authentication Error',
      message: 'Invalid or expired authentication token',
      code: 'AUTH_FAILED',
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9)
    },
    ratelimit: {
      error: 'Rate Limit Exceeded',
      message: 'Too many requests from this IP address',
      code: 'RATE_LIMIT_EXCEEDED',
      limit: 100,
      remaining: 0,
      resetTime: new Date(Date.now() + 3600000).toISOString(),
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9)
    }
  };

  const responseData = errorResponses[errorType as keyof typeof errorResponses] || errorResponses.generic;

  return NextResponse.json(responseData, { 
    status: 500,
    headers: {
      'X-Error-Type': errorType,
      'X-Request-ID': responseData.requestId,
      'Content-Type': 'application/json'
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const errorType = body.errorType || 'generic';
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const errorResponse = {
      error: 'POST Request Failed',
      message: `POST request with errorType '${errorType}' intentionally failed`,
      code: 'POST_ERROR',
      receivedData: body,
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9),
      method: 'POST'
    };

    return NextResponse.json(errorResponse, { 
      status: 500,
      headers: {
        'X-Error-Type': errorType,
        'X-Request-ID': errorResponse.requestId
      }
    });
    
  } catch (parseError) {
    return NextResponse.json({
      error: 'JSON Parse Error',
      message: 'Invalid JSON in request body',
      code: 'PARSE_ERROR',
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substr(2, 9)
    }, { status: 400 });
  }
}
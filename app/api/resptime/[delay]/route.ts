import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { delay: string } }
) {
  const delay = parseInt(params.delay) || 2000;
  const maxDelay = 30000; // 30 seconds max
  const actualDelay = Math.min(delay, maxDelay);

  const startTime = Date.now();

  // Simulate response time delay - different from TTFB as this simulates
  // the entire response processing time, not just time to first byte
  await new Promise(resolve => setTimeout(resolve, actualDelay));

  const endTime = Date.now();
  const actualResponseTime = endTime - startTime;

  // Generate some mock data to simulate a more realistic response
  const mockData = {
    users: Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      active: Math.random() > 0.5
    })),
    products: Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      name: `Product ${i + 1}`,
      price: Math.round(Math.random() * 1000) / 10,
      inStock: Math.random() > 0.3
    }))
  };

  return NextResponse.json({
    message: `Response time test completed with ${actualDelay}ms delay`,
    requestedDelay: delay,
    actualDelay: actualDelay,
    startTime: startTime,
    endTime: endTime,
    actualResponseTime: actualResponseTime,
    timestamp: new Date().toISOString(),
    dataSize: JSON.stringify(mockData).length,
    mockData: mockData,
    performance: {
      memoryUsage: process.memoryUsage ? process.memoryUsage() : null,
      cpuTime: process.cpuUsage ? process.cpuUsage() : null
    },
    requestInfo: {
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers.entries())
    }
  });
}
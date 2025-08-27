import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { delay: string } }
) {
  const delay = parseInt(params.delay) || 1000;
  const maxDelay = 30000; // 30 seconds max
  const actualDelay = Math.min(delay, maxDelay);

  const startTime = Date.now();

  // Simulate Time To First Byte delay
  await new Promise(resolve => setTimeout(resolve, actualDelay));

  const endTime = Date.now();
  const actualResponseTime = endTime - startTime;

  return NextResponse.json({
    message: `TTFB test completed with ${actualDelay}ms delay`,
    requestedDelay: delay,
    actualDelay: actualDelay,
    startTime: startTime,
    endTime: endTime,
    actualResponseTime: actualResponseTime,
    timestamp: new Date().toISOString(),
    headers: Object.fromEntries(request.headers.entries())
  });
}
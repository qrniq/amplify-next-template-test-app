import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { delay: string } }
) {
  const delay = parseInt(params.delay) || 1500;
  const maxDelay = 30000; // 30 seconds max
  const actualDelay = Math.min(delay, maxDelay);

  const startTime = Date.now();

  // Generate progressive content that will be loaded in chunks
  const contentChunks = [
    {
      id: 1,
      title: "Initial Content",
      content: "This is the first chunk of content that loads immediately.",
      loadTime: 0
    },
    {
      id: 2, 
      title: "Secondary Content",
      content: "This content appears after a short delay, simulating async loading.",
      loadTime: Math.floor(actualDelay * 0.3)
    },
    {
      id: 3,
      title: "Tertiary Content", 
      content: "Additional content that loads later, demonstrating progressive enhancement.",
      loadTime: Math.floor(actualDelay * 0.6)
    },
    {
      id: 4,
      title: "Final Content",
      content: "The last piece of content to load, completing the DOM construction.",
      loadTime: actualDelay
    }
  ];

  // Generate dynamic widgets/components
  const widgets = [
    { type: "chart", data: Array.from({length: 12}, (_, i) => ({ month: i + 1, value: Math.floor(Math.random() * 100) })) },
    { type: "stats", data: { users: Math.floor(Math.random() * 10000), orders: Math.floor(Math.random() * 5000), revenue: Math.floor(Math.random() * 100000) } },
    { type: "notifications", data: Array.from({length: 5}, (_, i) => ({ id: i + 1, message: `Notification ${i + 1}`, time: new Date(Date.now() - i * 3600000).toISOString() })) },
    { type: "activities", data: Array.from({length: 8}, (_, i) => ({ id: i + 1, action: `Action ${i + 1}`, user: `User ${i + 1}`, timestamp: new Date(Date.now() - i * 1800000).toISOString() })) }
  ];

  // Simulate some processing time
  await new Promise(resolve => setTimeout(resolve, 100));

  const endTime = Date.now();

  return NextResponse.json({
    message: `DOM load test data prepared with ${actualDelay}ms total delay`,
    requestedDelay: delay,
    actualDelay: actualDelay,
    startTime: startTime,
    endTime: endTime,
    processingTime: endTime - startTime,
    timestamp: new Date().toISOString(),
    contentChunks: contentChunks,
    widgets: widgets,
    domStructure: {
      elements: contentChunks.length + widgets.length,
      estimatedDOMNodes: contentChunks.length * 5 + widgets.reduce((acc, w) => acc + (Array.isArray(w.data) ? w.data.length : Object.keys(w.data).length), 0),
      loadStrategy: "progressive"
    },
    performanceHints: {
      totalDelay: actualDelay,
      chunkDelays: contentChunks.map(c => c.loadTime),
      recommendedBatchSize: Math.ceil(contentChunks.length / 2),
      estimatedRenderTime: actualDelay + 200
    }
  });
}
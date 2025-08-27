import { NextRequest, NextResponse } from 'next/server';

interface RegionInfo {
  ip: string;
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
  headers: Record<string, string>;
}

export async function GET(request: NextRequest) {
  try {
    const ip = request.ip || 
               request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               request.headers.get('x-real-ip') ||
               'unknown';

    const country = request.headers.get('cloudfront-viewer-country') ||
                   request.headers.get('cf-ipcountry') ||
                   request.geo?.country ||
                   'Unknown';

    const region = request.headers.get('cloudfront-viewer-country-region') ||
                  request.geo?.region ||
                  'Unknown';

    const city = request.headers.get('cloudfront-viewer-city') ||
                request.geo?.city ||
                'Unknown';

    const timezone = request.headers.get('cloudfront-viewer-time-zone') ||
                    'Unknown';

    const allHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      allHeaders[key] = value;
    });

    const regionInfo: RegionInfo = {
      ip,
      country,
      region, 
      city,
      timezone,
      headers: allHeaders
    };

    return NextResponse.json(regionInfo, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });

  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Failed to detect region',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
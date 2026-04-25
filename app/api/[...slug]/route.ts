import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8788';

export async function OPTIONS(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, User-Agent, Origin',
      'Access-Control-Max-Age': '86400',
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  return handleRequest(request, params.slug);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  return handleRequest(request, params.slug);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  return handleRequest(request, params.slug);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  return handleRequest(request, params.slug);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  return handleRequest(request, params.slug);
}

async function handleRequest(request: NextRequest, slug: string[]) {
  try {
    const path = 'api/' + slug.join('/');
    
    const url = new URL(path, API_BASE_URL);
    console.log('Proxy request:', request.method, url.toString());
    
    // Copy query parameters
    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });

    // Prepare headers for backend request
    const backendHeaders = new Headers();
    
    // Copy essential headers
    const essentialHeaders = ['authorization', 'content-type', 'accept', 'user-agent'];
    essentialHeaders.forEach(headerName => {
      const value = request.headers.get(headerName);
      if (value) {
        backendHeaders.set(headerName, value);
      }
    });

    // Add frontend origin header for backend processing
    backendHeaders.set('origin', request.nextUrl.origin);

    // Prepare request body
    let body: string | undefined;
    if (request.method !== 'GET' && request.method !== 'HEAD' && request.method !== 'OPTIONS') {
      try {
        const clonedRequest = request.clone();
        const contentType = request.headers.get('content-type') || '';
        
        if (contentType.includes('application/json')) {
          const jsonBody = await clonedRequest.json();
          body = JSON.stringify(jsonBody);
          backendHeaders.set('content-type', 'application/json');
        } else if (contentType.includes('multipart/form-data') || contentType.includes('application/x-www-form-urlencoded')) {
          // For form data, pass the original body
          body = await clonedRequest.text();
          if (contentType) {
            backendHeaders.set('content-type', contentType);
          }
        } else {
          body = await clonedRequest.text();
          if (contentType) {
            backendHeaders.set('content-type', contentType);
          }
        }
      } catch (error) {
        console.warn('Failed to read request body:', error);
        // If we can't read the body, continue without it
      }
    }

    // Make request to backend
    const response = await fetch(url.toString(), {
      method: request.method,
      headers: backendHeaders,
      body,
      redirect: 'manual', // Don't auto-follow redirects, let browser handle them
    });

    // Handle response
    const contentType = response.headers.get('content-type') || '';
    let responseData: any;

    // Handle redirect responses
    if (response.type === 'opaqueredirect' || (response.status >= 300 && response.status <= 399)) {
      console.log('Redirect response detected:', response.status);
      const location = response.headers.get('location');
      
      if (location) {
        // Return redirect response to client
        return new NextResponse(null, {
          status: response.status,
          statusText: response.statusText,
          headers: {
            'Location': location,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, User-Agent, Origin',
          },
        });
      }
    }

    try {
      if (contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }
    } catch (error) {
      console.warn('Failed to parse response body:', error);
      responseData = null;
    }

    console.log('Backend response:', response.status, 
      typeof responseData === 'object' && responseData !== null ? 
        JSON.stringify(responseData).substring(0, 200) + '...' : 
        String(responseData).substring(0, 200) + '...'
    );

    // Create response headers
    const responseHeaders = new Headers();
    
    // Copy essential response headers
    const allowedResponseHeaders = ['content-type', 'cache-control', 'etag', 'last-modified'];
    allowedResponseHeaders.forEach(headerName => {
      const value = response.headers.get(headerName);
      if (value) {
        responseHeaders.set(headerName, value);
      }
    });

    // Add CORS headers
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, User-Agent');

    // Ensure JSON response has correct content-type
    if (typeof responseData === 'object' && responseData !== null) {
      responseHeaders.set('content-type', 'application/json');
      return new NextResponse(JSON.stringify(responseData), {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    } else {
      // For text responses, preserve the original content-type if available
      if (contentType && !responseHeaders.has('content-type')) {
        responseHeaders.set('content-type', contentType);
      }
      return new NextResponse(responseData || '', {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    }
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Proxy request failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, User-Agent, Origin',
        }
      }
    );
  }
}
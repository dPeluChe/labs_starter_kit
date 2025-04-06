import { NextRequest, NextResponse } from 'next/server';

// Variable global para rastrear si hay una solicitud en progreso
let requestInProgress = false;
let lastRequestTime = 0;
const REQUEST_COOLDOWN = 1000; // 1 segundo de espera entre solicitudes

export async function POST(request: NextRequest) {
  // Verificar si hay una solicitud en progreso o si ha pasado poco tiempo desde la última
  const now = Date.now();
  if (requestInProgress || (now - lastRequestTime < REQUEST_COOLDOWN)) {
    console.log('GraphQL Proxy: Request already in progress or too soon after previous request');
    return NextResponse.json(
      { errors: [{ message: 'A request is already in progress or too many requests' }] },
      { status: 429 }
    );
  }
  
  requestInProgress = true;
  lastRequestTime = now;
  
  try {
    // Get the target URL from the query parameter
    const url = request.nextUrl.searchParams.get('url');
    
    if (!url) {
      requestInProgress = false;
      return NextResponse.json(
        { errors: [{ message: 'Missing URL parameter' }] },
        { status: 400 }
      );
    }
    
    console.log(`GraphQL Proxy: Forwarding request to ${url}`);
    
    // Get the original headers from the request
    const originalHeaders = request.headers.get('X-Original-Headers');
    let headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (originalHeaders) {
      try {
        headers = {
          ...headers,
          ...JSON.parse(originalHeaders)
        };
        console.log('GraphQL Proxy: Using headers', headers);
      } catch (e) {
        console.error('Failed to parse original headers:', e);
      }
    }
    
    // Get the request body
    const body = await request.json();
    
    // Forward the request to the target URL
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      // Add a timeout to prevent hanging requests
      signal: AbortSignal.timeout(15000)
    });
    
    // Check if the response is 404 or other error
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GraphQL Proxy: Target server responded with ${response.status}:`, errorText);
      
      requestInProgress = false;
      // Return a more descriptive error
      return NextResponse.json(
        { 
          errors: [{ 
            message: `GraphQL server responded with status ${response.status}`,
            details: errorText,
            url: url // Include the URL that was attempted
          }] 
        },
        { status: response.status }
      );
    }
    
    // Get the response data
    const data = await response.json();
    console.log('GraphQL Proxy: Successfully received response');
    
    requestInProgress = false;
    // Return the response
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('GraphQL proxy error:', error);
    requestInProgress = false;
    return NextResponse.json(
      { errors: [{ message: error instanceof Error ? error.message : String(error) }] },
      { status: 500 }
    );
  } finally {
    // Asegurarse de que requestInProgress se restablezca después de un tiempo
    setTimeout(() => {
      requestInProgress = false;
    }, 5000); // Tiempo de seguridad
  }
}
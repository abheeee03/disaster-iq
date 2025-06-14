export async function GET(request) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const timeRange = url.searchParams.get('timeRange') || '24h';
    
    // NASA EONET API URL
    // In production, use your actual API key from environment variables
    // const NASA_API_KEY = process.env.NASA_API_KEY;
    const NASA_API_KEY = "Rybe3WhaPjrBtNH4I67Or015B4frsmiFGqfcJwSo"; // Using demo key for development
    
    // Determine limit based on timeRange
    let limit = 10;
    switch(timeRange) {
      case '12h':
        limit = 5;
        break;
      case '24h':
        limit = 10;
        break;
      case '7d':
        limit = 20;
        break;
      case '30d':
        limit = 30;
        break;
      default:
        limit = 10;
    }

    // Build the NASA API URL
    let nasaApiUrl = `https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=${limit}&api_key=${NASA_API_KEY}`;
    
    // Add category filter if type is specified
    if (type && type !== 'all') {
      const categoryMap = {
        'wildfire': 'wildfires',
        'earthquake': 'earthquakes',
        'flood': 'floods',
        'storm': 'severeStorms',
        'volcano': 'volcanoes'
      };
      
      if (categoryMap[type]) {
        nasaApiUrl += `&category=${categoryMap[type]}`;
      }
    }
    
    // Fetch data from NASA EONET API
    const response = await fetch(nasaApiUrl);
    const eonetData = await response.json();
    
    // Transform NASA EONET data to match our application's format
    const transformedData = eonetData.events.map(event => {
      // Get the latest geometry point for location
      const latestGeometry = event.geometry[event.geometry.length - 1];
      const coordinates = latestGeometry ? latestGeometry.coordinates : [0, 0];
      
      // Determine disaster type from categories
      let disasterType = 'unknown';
      let severityValue = 'moderate';
      
      if (event.categories && event.categories.length > 0) {
        const category = event.categories[0].id;
        
        if (category === 'wildfires') {
          disasterType = 'wildfire';
          severityValue = latestGeometry && latestGeometry.magnitudeValue > 1000 ? 'critical' : 'warning';
        } else if (category === 'severeStorms') {
          disasterType = 'storm';
          severityValue = latestGeometry && latestGeometry.magnitudeValue > 50 ? 'critical' : 'warning';
        } else if (category === 'volcanoes') {
          disasterType = 'volcano';
          severityValue = 'warning';
        } else if (category === 'earthquakes') {
          disasterType = 'earthquake';
          severityValue = latestGeometry && latestGeometry.magnitudeValue > 6 ? 'critical' : 'moderate';
        } else if (category === 'floods') {
          disasterType = 'flood';
          severityValue = 'warning';
        }
      }
      
      return {
        id: event.id,
        name: event.title,
        type: disasterType,
        lat: coordinates[1], // NASA API returns [lng, lat]
        lng: coordinates[0],
        severity: severityValue,
        updatedAt: latestGeometry ? latestGeometry.date : new Date().toISOString(),
        // Include additional data points if available
        magnitudeValue: latestGeometry ? latestGeometry.magnitudeValue : null,
        magnitudeUnit: latestGeometry ? latestGeometry.magnitudeUnit : null,
        sources: event.sources ? event.sources.map(source => ({ id: source.id, url: source.url })) : [],
        closed: event.closed
      };
    });
    
    return new Response(JSON.stringify({ 
      success: true, 
      data: transformedData,
      meta: {
        count: transformedData.length,
        type: type || 'all',
        timeRange,
        source: 'NASA EONET API',
        apiVersion: 'v3'
      }
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=60'
      }
    });
  } catch (error) {
    console.error('Error in disasters API:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to fetch disaster data from NASA EONET API',
      details: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 
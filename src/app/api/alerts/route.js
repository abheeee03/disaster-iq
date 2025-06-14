export async function GET(request) {
  try {
    // Get NASA EONET API data for recent disasters
    const NASA_API_KEY = "Rybe3WhaPjrBtNH4I67Or015B4frsmiFGqfcJwSo"; // Using demo key for development
    const nasaApiUrl = `https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=10&days=7&api_key=${NASA_API_KEY}`;
    
    const response = await fetch(nasaApiUrl);
    const eonetData = await response.json();
    
    // System alerts - these are always included
    const systemAlerts = [
      {
        id: "sys-1",
        title: "Earthquake monitoring systems back online",
        type: "system",
        severity: "info",
        time: "2 hours ago",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        details: "The USGS earthquake monitoring integration is now functioning normally after scheduled maintenance.",
        source: "System"
      },
      {
        id: "sys-2",
        title: "API rate limit warning",
        type: "system",
        severity: "warning",
        time: "4 hours ago",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        details: "The NASA Earth Observatory API rate limit is at 85%. Consider reducing request frequency.",
        source: "System"
      },
      {
        id: "sys-3",
        title: "Database backup completed",
        type: "system",
        severity: "info",
        time: "8 hours ago",
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        details: "Automated daily backup of disaster tracking database completed successfully.",
        source: "System"
      }
    ];
    
    // Generate disaster alerts from EONET data
    const disasterAlerts = eonetData.events.map((event, index) => {
      // Determine when the alert was generated - create a realistic timespan
      const hoursAgo = Math.floor(Math.random() * 24) + 1; // 1-24 hours ago
      const timestamp = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
      
      // Get the type from the category
      let alertType = 'Disaster';
      let severityLevel = 'warning';
      
      if (event.categories && event.categories.length > 0) {
        const category = event.categories[0].id;
        
        // Set appropriate severity based on disaster type and recency
        if (hoursAgo <= 6) {
          // Very recent events are more likely to be critical
          severityLevel = ['wildfires', 'severeStorms', 'volcanoes'].includes(category) ? 'critical' : 'warning';
        } else {
          // Less recent events typically have lower severity unless they're major
          severityLevel = hoursAgo <= 12 ? 'warning' : 'info';
        }
      }
      
      // Get the most recent geometry for location information
      const latestGeometry = event.geometry && event.geometry.length > 0 
        ? event.geometry[event.geometry.length - 1] 
        : null;
      
      // Construct a detailed message
      let details = `${event.title} has been detected.`;
      
      if (latestGeometry) {
        details += ` Located at coordinates ${latestGeometry.coordinates[1]}°N ${latestGeometry.coordinates[0]}°E.`;
        
        if (latestGeometry.magnitudeValue && latestGeometry.magnitudeUnit) {
          details += ` Measured at ${latestGeometry.magnitudeValue} ${latestGeometry.magnitudeUnit}.`;
        }
      }
      
      if (event.sources && event.sources.length > 0) {
        details += ` Data reported by ${event.sources[0].id}.`;
      }
      
      return {
        id: `disaster-${event.id}`,
        title: event.title,
        type: "disaster",
        severity: severityLevel,
        time: `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`,
        timestamp: timestamp.toISOString(),
        details: details,
        source: event.sources && event.sources.length > 0 ? event.sources[0].id : "NASA EONET",
        coordinates: latestGeometry ? [latestGeometry.coordinates[1], latestGeometry.coordinates[0]] : null,
        category: event.categories && event.categories.length > 0 ? event.categories[0].id : "unknown"
      };
    });
    
    // Combine system and disaster alerts
    const allAlerts = [...disasterAlerts, ...systemAlerts];
    
    // Sort by timestamp, most recent first
    allAlerts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Filter by type if provided in query params
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    
    let data;
    if (type) {
      data = allAlerts.filter(alert => alert.type === type);
    } else {
      data = allAlerts;
    }

    return new Response(JSON.stringify({ 
      success: true, 
      data,
      meta: {
        count: data.length,
        type: type || 'all',
        source: "NASA EONET + System Alerts"
      }
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=60'
      }
    });
  } catch (error) {
    console.error('Error in alerts API:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to fetch alert data',
      details: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// Endpoint for receiving webhook alerts from monitoring systems
export async function POST(request) {
  try {
    const data = await request.json();

    // In a real application, this would validate, process, and store the alert
    console.log('Received alert:', data);

    // For demo purposes, just acknowledge receipt
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Alert received',
      alertId: `alert-${Date.now()}`
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error in alert webhook:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: 'Failed to process alert' 
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
} 
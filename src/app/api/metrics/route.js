export async function GET(request) {
  try {
    // Generate metrics in Prometheus exposition format for scraping
    const metrics = generateMetrics();
    
    return new Response(metrics, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      }
    });
  } catch (error) {
    console.error('Error generating metrics:', error);
    
    return new Response('# Error generating metrics\n', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8'
      }
    });
  }
}

function generateMetrics() {
  const timestamp = Math.floor(Date.now() / 1000);
  
  // In a real application, these would be actual measurements
  const metrics = [
    // Counter metrics
    `# HELP disaster_iq_api_requests_total Total number of API requests\n`,
    `# TYPE disaster_iq_api_requests_total counter\n`,
    `disaster_iq_api_requests_total{endpoint="/api/disasters"} 328 ${timestamp}\n`,
    `disaster_iq_api_requests_total{endpoint="/api/alerts"} 213 ${timestamp}\n`,
    `disaster_iq_api_requests_total{endpoint="/api/metrics"} 42 ${timestamp}\n`,
    
    // Gauge metrics
    `# HELP disaster_iq_active_disasters Current number of active disasters\n`,
    `# TYPE disaster_iq_active_disasters gauge\n`,
    `disaster_iq_active_disasters{type="wildfire"} 23 ${timestamp}\n`,
    `disaster_iq_active_disasters{type="earthquake"} 12 ${timestamp}\n`,
    `disaster_iq_active_disasters{type="flood"} 7 ${timestamp}\n`,
    `disaster_iq_active_disasters{type="storm"} 4 ${timestamp}\n`,
    `disaster_iq_active_disasters{type="volcano"} 1 ${timestamp}\n`,
    
    // System metrics
    `# HELP disaster_iq_memory_usage_bytes Memory usage in bytes\n`,
    `# TYPE disaster_iq_memory_usage_bytes gauge\n`,
    `disaster_iq_memory_usage_bytes{type="heap"} ${Math.floor(Math.random() * 500000000)} ${timestamp}\n`,
    `disaster_iq_memory_usage_bytes{type="rss"} ${Math.floor(Math.random() * 700000000)} ${timestamp}\n`,
    
    `# HELP disaster_iq_cpu_usage CPU usage percentage\n`,
    `# TYPE disaster_iq_cpu_usage gauge\n`,
    `disaster_iq_cpu_usage ${(Math.random() * 35).toFixed(2)} ${timestamp}\n`,
    
    // Response time histogram
    `# HELP disaster_iq_http_request_duration_seconds HTTP request duration in seconds\n`,
    `# TYPE disaster_iq_http_request_duration_seconds histogram\n`,
    `disaster_iq_http_request_duration_seconds_bucket{le="0.05"} 1420 ${timestamp}\n`,
    `disaster_iq_http_request_duration_seconds_bucket{le="0.1"} 2326 ${timestamp}\n`,
    `disaster_iq_http_request_duration_seconds_bucket{le="0.2"} 2898 ${timestamp}\n`,
    `disaster_iq_http_request_duration_seconds_bucket{le="0.5"} 2975 ${timestamp}\n`,
    `disaster_iq_http_request_duration_seconds_bucket{le="1.0"} 2983 ${timestamp}\n`,
    `disaster_iq_http_request_duration_seconds_bucket{le="+Inf"} 2983 ${timestamp}\n`,
    `disaster_iq_http_request_duration_seconds_sum 235.67 ${timestamp}\n`,
    `disaster_iq_http_request_duration_seconds_count 2983 ${timestamp}\n`,
    
    // Error rate
    `# HELP disaster_iq_errors_total Total number of errors\n`,
    `# TYPE disaster_iq_errors_total counter\n`,
    `disaster_iq_errors_total{type="api"} 18 ${timestamp}\n`,
    `disaster_iq_errors_total{type="db"} 3 ${timestamp}\n`,
    `disaster_iq_errors_total{type="auth"} 0 ${timestamp}\n`,
    
    // External service metrics
    `# HELP disaster_iq_external_service_up External service availability (1=up, 0=down)\n`,
    `# TYPE disaster_iq_external_service_up gauge\n`,
    `disaster_iq_external_service_up{service="nasa_api"} 1 ${timestamp}\n`,
    `disaster_iq_external_service_up{service="usgs_api"} 1 ${timestamp}\n`,
    `disaster_iq_external_service_up{service="noaa_api"} ${Math.random() > 0.9 ? 0 : 1} ${timestamp}\n`,
    
    `# HELP disaster_iq_external_request_duration_seconds External API request duration in seconds\n`,
    `# TYPE disaster_iq_external_request_duration_seconds gauge\n`,
    `disaster_iq_external_request_duration_seconds{service="nasa_api"} ${(Math.random() * 0.4 + 0.2).toFixed(3)} ${timestamp}\n`,
    `disaster_iq_external_request_duration_seconds{service="usgs_api"} ${(Math.random() * 0.5 + 0.3).toFixed(3)} ${timestamp}\n`,
    `disaster_iq_external_request_duration_seconds{service="noaa_api"} ${(Math.random() * 0.8 + 0.5).toFixed(3)} ${timestamp}\n`,
  ];
  
  return metrics.join('');
} 
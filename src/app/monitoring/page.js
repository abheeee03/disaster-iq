"use client";

import { useState } from "react";
import Link from "next/link";

export default function Monitoring() {
  const [timeRange, setTimeRange] = useState("24h");

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">System Monitoring</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Time Range:</span>
          <TimeRangeSelector active={timeRange} onChange={setTimeRange} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MetricCard 
          title="API Response Time" 
          value="235ms" 
          change="-15ms"
          trend="down"
          chart="/placeholder-chart-1.png"
        />
        <MetricCard 
          title="Error Rate" 
          value="0.12%" 
          change="+0.04%"
          trend="up"
          chart="/placeholder-chart-2.png"
        />
        <MetricCard 
          title="Request Volume" 
          value="1.2M/hr" 
          change="+0.3M"
          trend="up"
          chart="/placeholder-chart-3.png"
        />
        <MetricCard 
          title="Data Processing Rate" 
          value="950 rec/s" 
          change="-50 rec/s"
          trend="down"
          chart="/placeholder-chart-4.png"
        />
      </div>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Endpoints Health</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-3 px-4 text-left">Endpoint</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Response Time (p95)</th>
                <th className="py-3 px-4 text-left">Error Rate</th>
                <th className="py-3 px-4 text-left">Requests/min</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <EndpointRow 
                name="/api/disasters" 
                status="operational" 
                responseTime="120ms" 
                errorRate="0%" 
                requestsPerMinute="350" 
              />
              <EndpointRow 
                name="/api/wildfires" 
                status="operational" 
                responseTime="95ms" 
                errorRate="0%" 
                requestsPerMinute="220" 
              />
              <EndpointRow 
                name="/api/earthquakes" 
                status="operational" 
                responseTime="105ms" 
                errorRate="0.02%" 
                requestsPerMinute="180" 
              />
              <EndpointRow 
                name="/api/floods" 
                status="degraded" 
                responseTime="450ms" 
                errorRate="2.3%" 
                requestsPerMinute="120" 
              />
              <EndpointRow 
                name="/api/weather" 
                status="operational" 
                responseTime="85ms" 
                errorRate="0%" 
                requestsPerMinute="420" 
              />
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">External Services</h2>
          <Link href="/monitoring/services" className="text-blue-500 hover:underline text-sm">
            View detailed service metrics →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ExternalServiceCard 
            name="NASA Earth Observatory API"
            status="operational"
            responseTime="280ms"
            lastChecked="2 min ago"
          />
          <ExternalServiceCard 
            name="USGS Earthquake Service"
            status="operational"
            responseTime="350ms"
            lastChecked="3 min ago"
          />
          <ExternalServiceCard 
            name="NOAA Weather API"
            status="degraded"
            responseTime="620ms"
            lastChecked="1 min ago"
          />
          <ExternalServiceCard 
            name="Global Disaster Alert Service"
            status="operational"
            responseTime="180ms"
            lastChecked="5 min ago"
          />
        </div>
      </section>
    </div>
  );
}

function TimeRangeSelector({ active, onChange }) {
  const options = ["1h", "6h", "12h", "24h", "7d", "30d"];
  
  return (
    <div className="inline-flex bg-gray-100 rounded-md p-1">
      {options.map(option => (
        <button
          key={option}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            active === option 
              ? "bg-blue-500 text-white" 
              : "text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function MetricCard({ title, value, change, trend, chart }) {
  const trendColors = {
    up: trend === "up" ? "text-red-500" : "text-green-500",
    down: trend === "down" ? "text-red-500" : "text-green-500"
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-xl">{title}</h3>
        <div className="flex flex-col items-end">
          <span className="text-2xl font-bold">{value}</span>
          <span className={trendColors[trend]}>
            {change} ({trend === "up" ? "↑" : "↓"})
          </span>
        </div>
      </div>
      <div className="h-48 bg-gray-100 flex items-center justify-center rounded">
        <p className="text-gray-500">Chart visualization will be displayed here</p>
      </div>
    </div>
  );
}

function EndpointRow({ name, status, responseTime, errorRate, requestsPerMinute }) {
  const statusStyles = {
    operational: "bg-green-100 text-green-800",
    degraded: "bg-yellow-100 text-yellow-800",
    outage: "bg-red-100 text-red-800"
  };

  // Parse errorRate as number to determine if it's concerning
  const errorRateValue = parseFloat(errorRate);
  const errorRateClass = 
    errorRateValue === 0 ? "text-green-600" :
    errorRateValue < 1 ? "text-yellow-600" :
    "text-red-600 font-bold";

  // Parse responseTime to determine if it's concerning
  const responseTimeValue = parseInt(responseTime);
  const responseTimeClass = 
    responseTimeValue < 150 ? "text-green-600" :
    responseTimeValue < 300 ? "text-yellow-600" :
    "text-red-600";

  return (
    <tr className="hover:bg-gray-50">
      <td className="py-4 px-4">{name}</td>
      <td className="py-4 px-4">
        <span className={`px-2 py-1 rounded text-xs ${statusStyles[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </td>
      <td className={`py-4 px-4 ${responseTimeClass}`}>{responseTime}</td>
      <td className={`py-4 px-4 ${errorRateClass}`}>{errorRate}</td>
      <td className="py-4 px-4">{requestsPerMinute}</td>
    </tr>
  );
}

function ExternalServiceCard({ name, status, responseTime, lastChecked }) {
  const statusStyles = {
    operational: "border-green-500",
    degraded: "border-yellow-500",
    outage: "border-red-500"
  };

  const statusBadgeStyles = {
    operational: "bg-green-100 text-green-800",
    degraded: "bg-yellow-100 text-yellow-800",
    outage: "bg-red-100 text-red-800"
  };

  return (
    <div className={`border-l-4 ${statusStyles[status]} bg-gray-50 p-4 rounded-r-lg`}>
      <div className="flex justify-between">
        <h3 className="font-bold">{name}</h3>
        <span className={`px-2 py-1 rounded text-xs ${statusBadgeStyles[status]}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>
      <div className="mt-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>Response Time:</span>
          <span className="font-medium">{responseTime}</span>
        </div>
        <div className="flex justify-between">
          <span>Last Checked:</span>
          <span>{lastChecked}</span>
        </div>
      </div>
    </div>
  );
} 
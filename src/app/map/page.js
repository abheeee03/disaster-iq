"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard } from "@/components/dashboard/StatCard";
import { TimeRangeSelector } from "@/components/dashboard/TimeRangeSelector";
import { DisasterListItem } from "@/components/dashboard/DisasterListItem";
import { ForecastCard } from "@/components/dashboard/ForecastCard";

export default function MapPage() {
  const [disasterType, setDisasterType] = useState("all");
  const [timeRange, setTimeRange] = useState("24h");
  const [loading, setLoading] = useState(true);

  // Dynamic import of Leaflet Map component because it requires browser APIs
  const DisasterMap = dynamic(() => import("../../components/DisasterMap"), {
    ssr: false,
    loading: () => (
      <div className="h-[600px] bg-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-2"></div>
          <p>Loading map...</p>
        </div>
      </div>
    )
  });

  // Simulated loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Disaster Map</h1>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Disaster Type:</span>
            <Select value={disasterType} onValueChange={setDisasterType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="wildfire">Wildfires</SelectItem>
                <SelectItem value="earthquake">Earthquakes</SelectItem>
                <SelectItem value="flood">Floods</SelectItem>
                <SelectItem value="storm">Storms</SelectItem>
                <SelectItem value="volcano">Volcanoes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Time Range:</span>
            <TimeRangeSelector active={timeRange} onChange={setTimeRange} />
          </div>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {!loading && <DisasterMap disasterType={disasterType} timeRange={timeRange} />}
          {loading && (
            <div className="h-[600px] bg-muted/20 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-2"></div>
                <p>Loading map data...</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Active Disasters" 
          count={disasterType === "all" ? "47" : disasterType === "wildfire" ? "23" : disasterType === "earthquake" ? "12" : disasterType === "flood" ? "7" : disasterType === "storm" ? "4" : "1"} 
          change={"+3"} 
          trend={"up"}
          link="#"
        />
        <StatCard 
          title="Population Affected" 
          count={"2.3M"} 
          change={"+150K"} 
          trend={"up"}
          link="#"
        />
        <StatCard 
          title="Area Affected" 
          count={"43,500 km²"} 
          change={"+2,500 km²"} 
          trend={"up"}
          link="#"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Disasters</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="px-6">
              <DisasterListItem
                type="wildfire"
                name="Dixie Fire"
                location="Northern California, USA"
                time="Detected 2 hours ago"
                severity="Critical"
                coordinates="40.12°N, 121.78°W"
              />
              <DisasterListItem
                type="earthquake"
                name="5.2M Earthquake"
                location="Tokyo, Japan"
                time="Occurred 6 hours ago"
                severity="Moderate"
                coordinates="35.69°N, 139.65°E"
              />
              <DisasterListItem
                type="flood"
                name="Mississippi River Flooding"
                location="Missouri, USA"
                time="Ongoing for 3 days"
                severity="Warning"
                coordinates="38.62°N, 90.18°W"
              />
              <DisasterListItem
                type="storm"
                name="Hurricane Alex"
                location="Gulf of Mexico"
                time="Formed 8 hours ago"
                severity="Critical"
                coordinates="24.5°N, 80.2°W"
              />
              <DisasterListItem
                type="volcano"
                name="Mt. Etna Eruption"
                location="Sicily, Italy"
                time="Began 2 days ago"
                severity="Warning"
                coordinates="37.75°N, 14.99°E"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Predictive Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ForecastCard
              title="Flood Risk Forecast"
              risk="High Risk"
              description="Increased flood risk in the Mississippi River basin over the next 48 hours due to heavy rainfall and snowmelt."
            />
            <ForecastCard
              title="Wildfire Spread Prediction"
              risk="Critical"
              description="Dixie Fire expected to expand northward due to strong winds and low humidity in the next 24 hours."
            />
            <ForecastCard
              title="Hurricane Path Projection"
              risk="Watch"
              description="Hurricane Alex projected to make landfall near Florida's Gulf Coast within 36 hours. Prepare for heavy rainfall and storm surge."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
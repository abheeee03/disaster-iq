'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/dashboard/StatCard";
import { AlertItem } from "@/components/dashboard/AlertItem";
import { StatusItem } from "@/components/dashboard/StatusItem";
import { MapPinIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [disasters, setDisasters] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data when component mounts
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch disasters and alerts in parallel
        const [disastersResponse, alertsResponse] = await Promise.all([
          fetch('/api/disasters?timeRange=24h'),
          fetch('/api/alerts')
        ]);

        if (!disastersResponse.ok) {
          throw new Error(`Disasters API responded with status ${disastersResponse.status}`);
        }
        if (!alertsResponse.ok) {
          throw new Error(`Alerts API responded with status ${alertsResponse.status}`);
        }

        const disastersData = await disastersResponse.json();
        const alertsData = await alertsResponse.json();

        if (disastersData.success && alertsData.success) {
          setDisasters(disastersData.data);
          setAlerts(alertsData.data);
          setError(null);
        } else {
          throw new Error('API returned unsuccessful response');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Calculate disaster stats
  const disasterStats = {
    wildfires: disasters.filter(d => d.type === 'wildfire').length,
    earthquakes: disasters.filter(d => d.type === 'earthquake').length,
    floods: disasters.filter(d => d.type === 'flood').length,
    storms: disasters.filter(d => d.type === 'storm').length
  };

  // Get recent alerts (just disaster alerts for now)
  const recentAlerts = alerts
    .filter(alert => alert.type === 'disaster')
    .slice(0, 3);

  // Display loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-2"></div>
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  // Display error state if needed
  if (error) {
    return (
      <div className="p-10 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Data</h2>
        <p className="text-red-600">{error}</p>
        <p className="mt-4">Please try refreshing the page or contact support if the problem persists.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 px-10">
        <h1 className="text-3xl font-bold tracking-tight">Disaster Monitoring Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to DisasterIQ, a comprehensive platform for monitoring and tracking natural disasters worldwide.
        </p>
      </div>
      <div className="px-10">

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="system">System Status</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Active Wildfires"
              count={disasterStats.wildfires.toString()}
              change={"+2"}
              trend="up"
              link="/map?type=wildfire"
            />
            <StatCard
              title="Earthquakes (24h)"
              count={disasterStats.earthquakes.toString()}
              change={"0"}
              trend="neutral"
              link="/map?type=earthquake"
            />
            <StatCard
              title="Tropical Storms"
              count={disasterStats.storms.toString()}
              change={"+1"}
              trend="up"
              link="/map?type=storm"
            />
            <StatCard
              title="Flooding Events"
              count={disasterStats.floods.toString()}
              change={"-1"}
              trend="down"
              link="/map?type=flood"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAlerts.length > 0 ? (
                    recentAlerts.map(alert => (
                      <AlertItem
                        key={alert.id}
                        type={alert.severity}
                        message={alert.title}
                        time={alert.time}
                      />
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No recent alerts to display
                    </p>
                  )}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" asChild>
                    <Link href="/alerts">View all alerts</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <StatusItem name="NASA API Connection" status="operational" />
                  <StatusItem name="Data Processing" status="operational" />
                  <StatusItem name="Alerting System" status="operational" />
                  <StatusItem name="Metrics Collection" status="degraded" />
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" asChild>
                    <Link href="/monitoring">View metrics</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Global Disaster Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] bg-secondary/20 flex items-center justify-center border rounded">
                <div className="flex flex-col items-center text-muted-foreground">
                  <MapPinIcon className="h-8 w-8 mb-2" />
                  <p>Navigate to the Map page to view interactive disaster data</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button asChild>
                  <Link href="/map">Open Full Map</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.filter(alert => alert.type === 'disaster').length > 0 ? (
                  alerts
                    .filter(alert => alert.type === 'disaster')
                    .slice(0, 6)
                    .map(alert => (
                      <AlertItem
                        key={alert.id}
                        type={alert.severity}
                        message={alert.title}
                        time={alert.time}
                      />
                    ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No disaster alerts to display
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <StatusItem name="NASA API Connection" status="operational" />
                <StatusItem name="USGS Earthquake Feed" status="operational" />
                <StatusItem name="NOAA Weather API" status="operational" />
                <StatusItem name="Real-time Data Processing" status="operational" />
                <StatusItem name="Alerting System" status="operational" />
                <StatusItem name="Metrics Collection" status="degraded" />
                <StatusItem name="Map Rendering Service" status="operational" />
                <StatusItem name="Database Connections" status="operational" />
                <StatusItem name="User Authentication" status="outage" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
              </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Info, AlertTriangle, BellRing } from "lucide-react";
import { NotificationSignup } from "@/components/NotificationSignup";

export default function Alerts() {
  const [activeTab, setActiveTab] = useState("all");
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch alerts when component mounts
    async function fetchAlerts() {
      try {
        setLoading(true);
        const response = await fetch('/api/alerts');
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setAlerts(data.data);
          setError(null);
        } else {
          throw new Error(data.error || 'Unknown error occurred');
        }
      } catch (err) {
        console.error('Error fetching alerts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchAlerts();
  }, []);

  // Filter alerts based on active tab
  const filteredAlerts = activeTab === "all" 
    ? alerts 
    : alerts.filter(alert => alert.type === activeTab);

  const testAlertSystem = () => {
    // In a real application, this would send a POST request to test the alert system
    alert('Alert system test initiated. A test alert would be sent to all configured channels.');
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Alert Center</h1>
        <div className="flex items-center space-x-2">
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={testAlertSystem}
            className="flex gap-2 items-center"
          >
            <BellRing className="h-4 w-4" />
            Test Alert
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <div className="flex border-b">
          <TabButton 
            label="All Alerts" 
            active={activeTab === "all"} 
            onClick={() => setActiveTab("all")}
            count={alerts.length}
            loading={loading}
          />
          <TabButton 
            label="Disasters" 
            active={activeTab === "disaster"} 
            onClick={() => setActiveTab("disaster")}
            count={alerts.filter(a => a.type === "disaster").length}
            loading={loading}
          />
          <TabButton 
            label="System" 
            active={activeTab === "system"} 
            onClick={() => setActiveTab("system")}
            count={alerts.filter(a => a.type === "system").length}
            loading={loading}
          />
        </div>

        <div className="divide-y">
          {loading ? (
            // Show skeleton loading UI
            Array(5).fill(0).map((_, i) => (
              <div key={i} className="p-4">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-2/3 mb-2" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-4 w-1/3 mb-1" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))
          ) : error ? (
            // Show error state
            <div className="p-6 text-center">
              <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
              <h3 className="font-semibold text-lg">Error Loading Alerts</h3>
              <p className="text-muted-foreground">{error}</p>
              <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : (
            // Show alerts
            filteredAlerts.map(alert => (
              <AlertItem key={alert.id} alert={alert} />
            ))
          )}
          
          {!loading && !error && filteredAlerts.length === 0 && (
            <div className="p-6 text-center text-muted-foreground">
              <Info className="h-10 w-10 mx-auto mb-2 opacity-50" />
              No alerts in this category
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <NotificationSignup />
        <div className="grid gap-6">
          <NotificationChannelCard />
          <AlertRulesCard />
        </div>
      </div>
    </div>
  );
}

function TabButton({ label, active, onClick, count, loading }) {
  return (
    <button
      className={`px-6 py-3 text-sm border-b-2 transition-colors ${
        active 
          ? "border-primary text-primary" 
          : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
      }`}
      onClick={onClick}
      disabled={loading}
    >
      {label} 
      {loading ? (
        <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-muted">...</span>
      ) : (
        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
          active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}

function AlertItem({ alert }) {
  const [expanded, setExpanded] = useState(false);

  const severityIcons = {
    critical: <AlertCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />
  };

  const severityStyles = {
    critical: "bg-red-100 text-red-800 border-red-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    info: "bg-blue-100 text-blue-800 border-blue-200"
  };

  const severityBadges = {
    critical: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800", 
    info: "bg-blue-100 text-blue-800"
  };

  return (
    <div 
      className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${expanded ? `border-l-4 ${severityStyles[alert.severity]}` : ''}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-3">
          <div className="mt-1">
            {severityIcons[alert.severity]}
          </div>
          <div>
            <h3 className="font-semibold leading-tight">{alert.title}</h3>
            <div className="text-xs text-muted-foreground mt-1">{alert.time} • {alert.source}</div>
            
            {expanded && (
              <div className="mt-3 text-sm text-muted-foreground">
                <p className="mb-2">{alert.details}</p>
                
                {alert.coordinates && (
                  <p className="text-xs mt-2">
                    Location: {alert.coordinates[0]}°, {alert.coordinates[1]}°
                  </p>
                )}
                
                {alert.category && (
                  <div className="mt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-muted">
                      {alert.category}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center">
          <span className={`text-xs px-2 py-0.5 rounded-full ${severityBadges[alert.severity]}`}>
            {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
          </span>
          {expanded ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4 text-muted-foreground" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

function NotificationChannelCard() {
  return (
    <div className="p-6 rounded-lg border bg-card shadow-sm">
      <h2 className="text-lg font-medium mb-4">Notification Channels</h2>
      
      <div className="space-y-3">
        <NotificationChannel 
          name="Email" 
          address="admin@disaster-iq.com" 
          active={true}
        />
        <NotificationChannel 
          name="SMS" 
          address="+1 (555) 123-4567" 
          active={true}
        />
        <NotificationChannel 
          name="Slack" 
          address="#disaster-alerts" 
          active={true}
        />
        <NotificationChannel 
          name="PagerDuty" 
          address="Incident Response Team" 
          active={false}
        />
      </div>
      
      <Button variant="ghost" size="sm" className="mt-4">
        Add notification channel
      </Button>
    </div>
  );
}

function AlertRulesCard() {
  return (
    <div className="p-6 rounded-lg border bg-card shadow-sm">
      <h2 className="text-lg font-medium mb-4">Alert Rules</h2>
      
      <div className="space-y-3">
        <AlertRule 
          name="High Response Time"
          condition="Response time > 500ms for 5 minutes"
          severity="warning"
          active={true}
        />
        <AlertRule 
          name="API Error Rate"
          condition="Error rate > 5% for 3 minutes"
          severity="critical" 
          active={true}
        />
        <AlertRule 
          name="New Earthquake M4.5+"
          condition="Earthquake magnitude >= 4.5"
          severity="warning"
          active={true}
        />
        <AlertRule 
          name="New Earthquake M6.0+"
          condition="Earthquake magnitude >= 6.0"
          severity="critical"
          active={true}
        />
        <AlertRule 
          name="Service Down"
          condition="Service unavailable for > 1 minute"
          severity="critical"
          active={true}
        />
      </div>
      
      <Button variant="ghost" size="sm" className="mt-4">
        Create alert rule
      </Button>
    </div>
  );
}

function NotificationChannel({ name, address, active }) {
  return (
    <div className="flex justify-between items-center p-3 border rounded-md">
      <div>
        <div className="font-medium">{name}</div>
        <div className="text-sm text-muted-foreground">{address}</div>
      </div>
      <div className="flex items-center">
        <span className={`text-xs px-2 py-1 rounded-full ${active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {active ? 'Active' : 'Inactive'}
        </span>
        <button className="ml-3 text-muted-foreground hover:text-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function AlertRule({ name, condition, severity, active }) {
  const severityColors = {
    critical: "bg-red-100 text-red-800",
    warning: "bg-yellow-100 text-yellow-800",
    info: "bg-blue-100 text-blue-800"
  };

  return (
    <div className="flex justify-between items-center p-3 border rounded-md">
      <div>
        <div className="font-medium">{name}</div>
        <div className="text-sm text-muted-foreground">{condition}</div>
      </div>
      <div className="flex items-center">
        <span className={`text-xs px-2 py-1 rounded-full mr-2 ${severityColors[severity]}`}>
          {severity.charAt(0).toUpperCase() + severity.slice(1)}
        </span>
        <div className="relative inline-block w-10 h-5">
          <input 
            type="checkbox" 
            className="opacity-0 w-0 h-0" 
            checked={active}
            readOnly
          />
          <span className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full ${active ? 'bg-primary' : 'bg-gray-300'}`}>
            <span className={`absolute h-4 w-4 left-0.5 bottom-0.5 bg-white rounded-full transition-transform ${active ? 'transform translate-x-5' : ''}`}></span>
          </span>
        </div>
      </div>
    </div>
  );
} 
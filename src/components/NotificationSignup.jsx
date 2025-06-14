'use client';

import { useState } from 'react';
import { 
  Card,
  CardContent, 
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BellRing, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export function NotificationSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }
    
    try {
      setStatus('loading');
      const response = await fetch('/api/notification/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStatus('success');
        setMessage('You have successfully subscribed to disaster alerts');
        setEmail('');
      } else {
        throw new Error(data.error || 'Failed to subscribe');
      }
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'An error occurred. Please try again.');
    }
  };

  const handleTestAlert = async () => {
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address first');
      return;
    }
    
    try {
      setStatus('loading');
      const response = await fetch('/api/notification/test-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStatus('success');
        setMessage('Test alert has been sent to your email');
      } else {
        throw new Error(data.error || 'Failed to send test alert');
      }
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Failed to send test alert');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BellRing className="h-5 w-5" />
          Disaster Alert Notifications
        </CardTitle>
        <CardDescription>
          Get immediate email alerts when disasters occur in your areas of interest
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'loading'}
              className="w-full"
            />
            
            {status === 'error' && (
              <div className="text-sm flex items-center gap-1 text-red-500">
                <AlertCircle className="h-4 w-4" />
                {message}
              </div>
            )}
            
            {status === 'success' && (
              <div className="text-sm flex items-center gap-1 text-green-500">
                <CheckCircle className="h-4 w-4" />
                {message}
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button 
              type="submit" 
              disabled={status === 'loading'}
              className="flex-1"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subscribing...
                </>
              ) : 'Subscribe to Alerts'}
            </Button>
            
            <Button 
              type="button"
              variant="outline"
              onClick={handleTestAlert}
              disabled={status === 'loading'}
            >
              Test Alert
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        We'll only send you alerts for significant events. You can unsubscribe at any time.
      </CardFooter>
    </Card>
  );
} 
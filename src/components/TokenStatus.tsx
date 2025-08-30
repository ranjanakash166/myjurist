import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { RefreshCw, Clock, AlertCircle, CheckCircle } from 'lucide-react';

export default function TokenStatus() {
  const { token, refreshToken: refreshTokenFn, isAuthenticated } = useAuth();
  const [tokenExpiry, setTokenExpiry] = useState<number | null>(null);
  const [refreshTokenExpiry, setRefreshTokenExpiry] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  useEffect(() => {
    const updateExpiryTimes = () => {
      const storedTokenExpiry = localStorage.getItem('token_expiry');
      const storedRefreshTokenExpiry = localStorage.getItem('refresh_token_expiry');
      
      setTokenExpiry(storedTokenExpiry ? parseInt(storedTokenExpiry) : null);
      setRefreshTokenExpiry(storedRefreshTokenExpiry ? parseInt(storedRefreshTokenExpiry) : null);
    };

    updateExpiryTimes();
    const interval = setInterval(updateExpiryTimes, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const success = await refreshTokenFn();
      if (success) {
        setLastRefresh(new Date());
      }
    } catch (error) {
      console.error('Manual refresh failed:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatTimeRemaining = (expiryTime: number | null) => {
    if (!expiryTime) return 'Unknown';
    
    const now = Date.now();
    const remaining = expiryTime - now;
    
    if (remaining <= 0) return 'Expired';
    
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    return `${minutes}m ${seconds}s`;
  };

  const getTokenStatus = () => {
    if (!tokenExpiry) return 'unknown';
    const now = Date.now();
    const remaining = tokenExpiry - now;
    
    if (remaining <= 0) return 'expired';
    if (remaining <= 30000) return 'expiring'; // 30 seconds
    return 'valid';
  };

  const getRefreshTokenStatus = () => {
    if (!refreshTokenExpiry) return 'unknown';
    const now = Date.now();
    const remaining = refreshTokenExpiry - now;
    
    if (remaining <= 0) return 'expired';
    return 'valid';
  };

  const tokenStatus = getTokenStatus();
  const refreshTokenStatus = getRefreshTokenStatus();

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Not Authenticated
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Please log in to view token status.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Token Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Access Token Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Access Token</span>
            <Badge 
              variant={
                tokenStatus === 'valid' ? 'default' :
                tokenStatus === 'expiring' ? 'secondary' : 'destructive'
              }
              className="flex items-center gap-1"
            >
              {tokenStatus === 'valid' && <CheckCircle className="w-3 h-3" />}
              {tokenStatus === 'expiring' && <AlertCircle className="w-3 h-3" />}
              {tokenStatus === 'expired' && <AlertCircle className="w-3 h-3" />}
              {tokenStatus === 'unknown' && <AlertCircle className="w-3 h-3" />}
              {tokenStatus}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            Expires in: {formatTimeRemaining(tokenExpiry)}
          </div>
        </div>

        {/* Refresh Token Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Refresh Token</span>
            <Badge 
              variant={refreshTokenStatus === 'valid' ? 'default' : 'destructive'}
              className="flex items-center gap-1"
            >
              {refreshTokenStatus === 'valid' && <CheckCircle className="w-3 h-3" />}
              {refreshTokenStatus === 'expired' && <AlertCircle className="w-3 h-3" />}
              {refreshTokenStatus === 'unknown' && <AlertCircle className="w-3 h-3" />}
              {refreshTokenStatus}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            Expires in: {formatTimeRemaining(refreshTokenExpiry)}
          </div>
        </div>

        {/* Manual Refresh Button */}
        <div className="pt-2">
          <Button 
            onClick={handleManualRefresh} 
            disabled={isRefreshing}
            className="w-full"
            variant="outline"
          >
            {isRefreshing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Manual Refresh
              </>
            )}
          </Button>
        </div>

        {/* Last Refresh Time */}
        {lastRefresh && (
          <div className="text-xs text-muted-foreground text-center">
            Last manual refresh: {lastRefresh.toLocaleTimeString()}
          </div>
        )}

        {/* Token Preview */}
        <div className="pt-2 border-t">
          <div className="text-xs text-muted-foreground mb-1">Access Token Preview:</div>
          <div className="text-xs font-mono bg-muted p-2 rounded break-all">
            {token ? `${token.substring(0, 20)}...` : 'No token'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Camera, 
  Mic, 
  Volume2, 
  Bell, 
  Play, 
  Eye, 
  Clipboard,
  Monitor
} from "lucide-react";
import { usePermissions, PermissionStatus } from '@/hooks/usePermissions';

interface PermissionItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  status: PermissionStatus;
  error?: string;
  onRequest?: () => void;
}

const PermissionItem: React.FC<PermissionItemProps> = ({ 
  icon, 
  title, 
  description, 
  status, 
  error,
  onRequest 
}) => {
  const getStatusColor = (status: PermissionStatus) => {
    switch (status) {
      case 'granted': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'denied': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'prompt': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'unavailable': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      case 'unsupported': return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusText = (status: PermissionStatus) => {
    switch (status) {
      case 'granted': return 'Granted';
      case 'denied': return 'Denied';
      case 'prompt': return 'Prompt';
      case 'unavailable': return 'Unavailable';
      case 'unsupported': return 'Unsupported';
      default: return 'Unknown';
    }
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors">
      <div className="p-2 rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm">{title}</h3>
          <Badge className={`text-xs ${getStatusColor(status)}`}>
            {getStatusText(status)}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>
      {status !== 'granted' && status !== 'unsupported' && onRequest && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRequest}
          className="h-8 text-xs"
        >
          Enable
        </Button>
      )}
    </div>
  );
};

export const PermissionsManager: React.FC = () => {
  const { permissions, errors, loading, requestAllPermissions, requestPermission } = usePermissions();

  const getPermissionIcon = (permission: keyof typeof permissions) => {
    switch (permission) {
      case 'location': return <MapPin className="w-4 h-4" />;
      case 'camera': return <Camera className="w-4 h-4" />;
      case 'microphone': return <Mic className="w-4 h-4" />;
      case 'speaker': return <Volume2 className="w-4 h-4" />;
      case 'notifications': return <Bell className="w-4 h-4" />;
      case 'autoplay': return <Play className="w-4 h-4" />;
      case 'vr': return <Eye className="w-4 h-4" />;
      case 'clipboard': return <Clipboard className="w-4 h-4" />;
      case 'screenCapture': return <Monitor className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getPermissionTitle = (permission: keyof typeof permissions) => {
    switch (permission) {
      case 'location': return 'Location Access';
      case 'camera': return 'Camera Access';
      case 'microphone': return 'Microphone Access';
      case 'speaker': return 'Speaker Selection';
      case 'notifications': return 'Notifications';
      case 'autoplay': return 'Autoplay';
      case 'vr': return 'Virtual Reality';
      case 'clipboard': return 'Clipboard Access';
      case 'screenCapture': return 'Screen Capture';
      default: return 'Permission';
    }
  };

  const getPermissionDescription = (permission: keyof typeof permissions) => {
    switch (permission) {
      case 'location': return 'Allow access to your location for location-based features';
      case 'camera': return 'Enable camera for video calls and photo capture';
      case 'microphone': return 'Enable microphone for voice communication';
      case 'speaker': return 'Select output speakers for audio playback';
      case 'notifications': return 'Receive important alerts and updates';
      case 'autoplay': return 'Allow automatic media playback';
      case 'vr': return 'Enable virtual reality experiences';
      case 'clipboard': return 'Allow access to clipboard for copy/paste';
      case 'screenCapture': return 'Enable screen sharing capabilities';
      default: return 'Permission description';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Permissions Management</span>
          <Button 
            onClick={requestAllPermissions}
            disabled={loading}
            size="sm"
          >
            {loading ? 'Requesting...' : 'Enable All'}
          </Button>
        </CardTitle>
        <CardDescription>
          Manage browser permissions for optimal experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {Object.entries(permissions).map(([key, status]) => (
            <PermissionItem
              key={key}
              icon={getPermissionIcon(key as keyof typeof permissions)}
              title={getPermissionTitle(key as keyof typeof permissions)}
              description={getPermissionDescription(key as keyof typeof permissions)}
              status={status}
              error={errors[key as keyof typeof errors]}
              onRequest={() => requestPermission(key as keyof typeof permissions)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
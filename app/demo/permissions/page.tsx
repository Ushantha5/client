"use client";

// Force dynamic rendering to avoid prerender issues with auth hooks
export const dynamic = 'force-dynamic';

import { PermissionsManager } from "@/components/permissions-manager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  Info, 
  Chrome, 
  Monitor 
} from "lucide-react";
import Link from "next/link";

export default function PermissionsDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Permissions Management</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Securely manage browser permissions for an optimal learning experience with MR5 School
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <PermissionsManager />
            
            {/* Browser Compatibility */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Browser Compatibility
                </CardTitle>
                <CardDescription>
                  Supported browsers for all permission features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border">
                    <Chrome className="w-8 h-8 text-blue-500" />
                    <span className="text-sm font-medium">Chrome</span>
                    <span className="text-xs text-muted-foreground">Fully Supported</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border">
                    <Chrome className="w-8 h-8 text-orange-500" />
                    <span className="text-sm font-medium">Firefox</span>
                    <span className="text-xs text-muted-foreground">Fully Supported</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border">
                    <Monitor className="w-8 h-8" />
                    <span className="text-sm font-medium">Safari</span>
                    <span className="text-xs text-muted-foreground">Partially Supported</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border">
                    <Monitor className="w-8 h-8 text-blue-500" />
                    <span className="text-sm font-medium">Edge</span>
                    <span className="text-xs text-muted-foreground">Fully Supported</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Security Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security First
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Your privacy is our priority. We only request permissions necessary for specific features:
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Camera/Microphone for virtual classrooms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Location for local study groups</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Notifications for important updates</span>
                  </li>
                </ul>
                <p className="text-xs text-muted-foreground pt-2">
                  You can revoke permissions at any time through your browser settings.
                </p>
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Click &#39;Enable All&#39; to request all permissions at once
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Review and approve each permission in your browser
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Status updates automatically after approval
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/student/portal">Go to Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
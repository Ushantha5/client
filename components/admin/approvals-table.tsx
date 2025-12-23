"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import { handleApiError } from "@/lib/errorHandler";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useEnhancedUser } from "@/contexts/EnhancedUserContext";
import { z } from "zod";
import { toast } from "sonner";

const rejectSchema = z.object({ reason: z.string().min(5) });

type PendingItem = {
  id: string;
  userId: string;
  name: string;
  email: string;
  roleRequested: string;
  submittedAt: string;
  status: string;
  type?: string;
};

export default function AdminApprovalsTable() {
  const [items, setItems] = useState<PendingItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<PendingItem | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { user } = useEnhancedUser();

  useEffect(() => {
    fetchPending();
  }, []);

  async function fetchPending() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<{ success: boolean; data: PendingItem[] }>(
        "/api/admin/registrations/pending"
      );
      setItems(res.data.data || []);
    } catch (err: any) {
      // Handle 404 specifically - it means no pending items
      if (err.response?.status === 404) {
        setItems([]); // Set empty array for no pending items
      } else if (err.response?.status === 401 || err.response?.status === 403) {
        // Handle authentication errors
        const errorMessage = "Unauthorized access to admin features. Please ensure you are logged in as an administrator.";
        toast.error(errorMessage);
        setError(errorMessage);
      } else {
        const errorMessage = handleApiError(err, "Fetch Pending Registrations");
        toast.error(errorMessage);
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(item: PendingItem) {
    if (!confirm(`Approve ${item.name} (${item.email})?`)) return;
    try {
      await apiClient.post("/api/admin/registrations/" + item.id + "/approve", {
        note: `Approved by ${user?.name || "admin"}`,
      });
      toast.success("Approved");
      setItems((s) => s.filter((i) => i.id !== item.id));
    } catch (err: any) {
      const errorMessage = handleApiError(err, "Approve Registration");
      toast.error(errorMessage);
    }
  }

  async function openReject(item: PendingItem) {
    setSelected(item);
    setRejectReason("");
    setShowRejectDialog(true);
  }

  async function handleRejectConfirm() {
    try {
      rejectSchema.parse({ reason: rejectReason });
    } catch (e: any) {
      return toast.error(e.errors ? e.errors[0].message : "Reason is required");
    }

    if (!selected) return;
    try {
      await apiClient.post("/api/admin/registrations/" + selected.id + "/reject", {
        reason: rejectReason,
      });
      toast.success("Rejected");
      setItems((s) => s.filter((i) => i.id !== selected.id));
      setShowRejectDialog(false);
      setSelected(null);
    } catch (err: any) {
      const errorMessage = handleApiError(err, "Reject Registration");
      toast.error(errorMessage);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Registrations</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading pending registrations...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            <p>Error loading pending registrations: {error}</p>
            <Button variant="outline" className="mt-4" onClick={fetchPending}>
              Retry
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No pending registrations at this time.</p>
            <p className="text-sm mt-2">All registration requests have been processed.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border rounded-md p-3 hover:bg-accent transition-colors"
              >
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-muted-foreground">{item.email}</div>
                  <div className="text-xs text-muted-foreground">Requested: {item.roleRequested}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleApprove(item)}>
                    Approve
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => openReject(item)}>
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Reject dialog */}
      {showRejectDialog && (
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Registration</DialogTitle>
              <DialogDescription>
                Provide a reason for rejecting this registration (min 5 chars).
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full rounded-md border p-2 min-h-[100px]"
                placeholder="Enter rejection reason..."
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRejectConfirm}>Confirm Reject</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
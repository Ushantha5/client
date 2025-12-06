"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
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
  const { user } = useAuth();

  useEffect(() => {
    fetchPending();
  }, []);

  async function fetchPending() {
    setLoading(true);
    try {
      const res = await apiFetch<{ success: boolean; data: PendingItem[] }>(
        "/admin/registrations/pending",
        { method: "GET" },
      );
      setItems(res.data || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load pending registrations");
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(item: PendingItem) {
    if (!confirm(`Approve ${item.name} (${item.email})?`)) return;
    try {
      await apiFetch("/admin/registrations/" + item.id + "/approve", {
        method: "POST",
        body: JSON.stringify({ note: `Approved by ${user?.name || "admin"}` }),
      });
      toast.success("Approved");
      setItems((s) => s.filter((i) => i.id !== item.id));
    } catch (err: any) {
      toast.error(err.message || "Approve failed");
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
      await apiFetch("/admin/registrations/" + selected.id + "/reject", {
        method: "POST",
        body: JSON.stringify({ reason: rejectReason }),
      });
      toast.success("Rejected");
      setItems((s) => s.filter((i) => i.id !== selected.id));
      setShowRejectDialog(false);
      setSelected(null);
    } catch (err: any) {
      toast.error(err.message || "Reject failed");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Registrations</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : items.length === 0 ? (
          <div>No pending registrations</div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border rounded-md p-3"
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
            </DialogHeader>
            <div className="space-y-3">
              <p>Provide a reason for rejecting this registration (min 5 chars).</p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full rounded-md border p-2"
                rows={4}
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

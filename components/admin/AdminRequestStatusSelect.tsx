"use client";

/**
 * components/admin/AdminRequestStatusSelect.tsx
 * Admin status switcher component invoking updateRequestStatus Server Action.
 */

import * as React from "react";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateRequestStatus } from "@/app/actions/service-requests";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AdminRequestStatusSelectProps {
  requestId: string;
  currentStatus: "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED" | "RESOLVED";
}

export function AdminRequestStatusSelect({
  requestId,
  currentStatus,
}: AdminRequestStatusSelectProps) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = React.useState(currentStatus);
  const router = useRouter();

  const handleStatusChange = (newStatus: string | null) => {
    if (!newStatus) return;
    startTransition(async () => {
      const res = await updateRequestStatus({
        requestId,
        status: newStatus as any,
        adminNotes: `Status changed to ${newStatus} via Admin Console`,
      });

      if (res.success) {
        setStatus(newStatus as any);
        toast.success(`Request status updated to ${newStatus}`);
        router.refresh();
      } else {
        toast.error((res as any).error || "Failed to update status");
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={status}
        onValueChange={handleStatusChange}
        disabled={isPending}
      >
        <SelectTrigger className="h-8 w-36 text-xs font-semibold">
          {isPending ? (
            <div className="flex items-center gap-1.5">
              <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
              <span>Saving...</span>
            </div>
          ) : (
            <SelectValue />
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="PENDING">PENDING</SelectItem>
          <SelectItem value="IN_REVIEW">IN REVIEW</SelectItem>
          <SelectItem value="APPROVED">APPROVED</SelectItem>
          <SelectItem value="RESOLVED">RESOLVED</SelectItem>
          <SelectItem value="REJECTED">REJECTED</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

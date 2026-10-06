"use client";

/**
 * components/requests/RequestList.tsx
 * Interactive list of service requests with status filter tabs and priority indicators.
 */

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  HelpCircle,
  Calendar,
  Plus,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export interface RequestItem {
  id: string;
  title: string;
  category: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED" | "RESOLVED";
  createdAt: string;
  updatedAt: string;
}

interface RequestListProps {
  initialRequests: RequestItem[];
}

export function RequestList({ initialRequests }: RequestListProps) {
  const [filter, setFilter] = React.useState<string>("ALL");

  const filteredRequests = initialRequests.filter((req) => {
    if (filter === "ALL") return true;
    return req.status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RESOLVED":
      case "APPROVED":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 text-[11px] font-semibold">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {status}
          </Badge>
        );
      case "IN_REVIEW":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-800 text-[11px] font-semibold">
            <Clock className="w-3 h-3 mr-1" />
            IN REVIEW
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="destructive" className="text-[11px] font-semibold">
            <XCircle className="w-3 h-3 mr-1" />
            REJECTED
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800 text-[11px] font-semibold">
            <Clock className="w-3 h-3 mr-1" />
            PENDING
          </Badge>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return <Badge variant="destructive" className="text-[10px]">URGENT</Badge>;
      case "HIGH":
        return <Badge className="bg-amber-500 text-white text-[10px]">HIGH</Badge>;
      case "MEDIUM":
        return <Badge variant="secondary" className="text-[10px]">MEDIUM</Badge>;
      default:
        return <Badge variant="outline" className="text-[10px]">LOW</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {["ALL", "PENDING", "IN_REVIEW", "RESOLVED", "REJECTED"].map((st) => (
          <Button
            key={st}
            variant={filter === st ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(st)}
            className={`text-xs font-semibold h-8 rounded-full ${
              filter === st ? "bg-indigo-600 text-white" : "border-border/60"
            }`}
          >
            {st.replace("_", " ")}
          </Button>
        ))}
      </div>

      {/* List items */}
      {filteredRequests.length === 0 ? (
        <Card className="text-center py-16 px-4 border-dashed border-border/60 bg-muted/20">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground mb-3">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold">No requests found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 mb-4">
            {filter === "ALL"
              ? "You haven't submitted any service requests yet."
              : `No requests with status "${filter}".`}
          </p>
          <Button size="sm" asChild className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs">
            <Link href="/requests/new">
              <Plus className="w-4 h-4 mr-1.5" />
              Create Request
            </Link>
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((req) => (
            <Card
              key={req.id}
              className="p-5 border-border/60 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all bg-card/70"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono text-muted-foreground font-semibold">
                      REQ-{req.id.slice(-6).toUpperCase()}
                    </span>
                    <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">
                      {req.category}
                    </Badge>
                    {getPriorityBadge(req.priority)}
                    {getStatusBadge(req.status)}
                  </div>

                  <h3 className="text-base font-bold text-foreground line-clamp-1">
                    {req.title}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {req.description}
                  </p>
                </div>

                <div className="text-xs text-muted-foreground sm:text-right shrink-0">
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      {new Date(req.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

/**
 * components/forms/ServiceRequestForm.tsx
 * Type-Safe Form Mutation using react-hook-form + zodResolver + Server Action.
 * 
 * Demonstrates:
 * 1. Client-side Zod validation with @hookform/resolvers/zod
 * 2. Shared Zod schema from lib/validations/service-request.ts
 * 3. Next.js Server Action invocation with React useTransition
 * 4. Inline accessible error messaging (aria-describedby, role="alert")
 * 5. Pending state button spinner and disabled controls
 * 6. Sonner toast notifications on success / server error
 */

import * as React from "react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  serviceRequestSchema,
  type ServiceRequestFormData,
} from "@/lib/validations/service-request";
import { createServiceRequest } from "@/app/actions/service-requests";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function ServiceRequestForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<ServiceRequestFormData>({
    resolver: zodResolver(serviceRequestSchema) as any,
    defaultValues: {
      title: "",
      category: "MAINTENANCE",
      description: "",
      priority: "MEDIUM",
    },
    mode: "onBlur",
  });

  const onSubmit = (data: ServiceRequestFormData) => {
    setServerError(null);

    startTransition(async () => {
      try {
        const result = await createServiceRequest(data);

        if (result.success) {
          toast.success("Service request submitted successfully!", {
            description: "You will receive an email confirmation shortly.",
          });
          reset();
          router.push("/requests");
          router.refresh();
        } else {
          setServerError(result.error);
          toast.error("Submission failed", {
            description: result.error,
          });

          // Map server-side field errors if present
          if (result.fieldErrors) {
            Object.entries(result.fieldErrors).forEach(([field, messages]) => {
              if (messages?.[0]) {
                setError(field as keyof ServiceRequestFormData, {
                  type: "server",
                  message: messages[0],
                });
              }
            });
          }
        }
      } catch (err: any) {
        setServerError("An unexpected network error occurred.");
        toast.error("Error submitting request");
      }
    });
  };

  return (
    <Card className="max-w-2xl mx-auto border-border/60 shadow-xl bg-card/80 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-6 border-b border-border/40">
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Send className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Create Service Request
        </CardTitle>
        <CardDescription className="text-sm">
          Report a campus facility issue, IT problem, or administrative inquiry.
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        {serverError && (
          <div
            role="alert"
            className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold">
              Request Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Projector not working in Room 304"
              {...register("title")}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "title-error" : undefined}
              className={`transition-colors ${
                errors.title ? "border-destructive focus-visible:ring-destructive" : ""
              }`}
              disabled={isPending}
            />
            {errors.title && (
              <p
                id="title-error"
                role="alert"
                className="text-xs font-medium text-destructive flex items-center gap-1 mt-1"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category Select */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-sm font-semibold">
                Category <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isPending}
                  >
                    <SelectTrigger
                      id="category"
                      aria-invalid={!!errors.category}
                      aria-describedby={errors.category ? "category-error" : undefined}
                      className={errors.category ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MAINTENANCE">Facility / Maintenance</SelectItem>
                      <SelectItem value="IT_SUPPORT">IT / Tech Support</SelectItem>
                      <SelectItem value="LIBRARY">Library Services</SelectItem>
                      <SelectItem value="SPORTS">Sports & Recreation</SelectItem>
                      <SelectItem value="CANTEEN">Canteen & Cafeteria</SelectItem>
                      <SelectItem value="ACADEMIC">Academic Affairs</SelectItem>
                      <SelectItem value="ADMINISTRATIVE">Administrative</SelectItem>
                      <SelectItem value="OTHER">Other Request</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p
                  id="category-error"
                  role="alert"
                  className="text-xs font-medium text-destructive flex items-center gap-1 mt-1"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Priority Select */}
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-semibold">
                Priority Level <span className="text-destructive">*</span>
              </Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isPending}
                  >
                    <SelectTrigger
                      id="priority"
                      aria-invalid={!!errors.priority}
                      aria-describedby={errors.priority ? "priority-error" : undefined}
                      className={errors.priority ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low (Routine)</SelectItem>
                      <SelectItem value="MEDIUM">Medium (Normal)</SelectItem>
                      <SelectItem value="HIGH">High (Urgent)</SelectItem>
                      <SelectItem value="URGENT">Urgent (Immediate attention)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.priority && (
                <p
                  id="priority-error"
                  role="alert"
                  className="text-xs font-medium text-destructive flex items-center gap-1 mt-1"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.priority.message}
                </p>
              )}
            </div>
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">
              Detailed Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Provide specific location, error codes, or details to help staff resolve this quickly..."
              {...register("description")}
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? "desc-error" : undefined}
              className={`resize-y transition-colors ${
                errors.description ? "border-destructive focus-visible:ring-destructive" : ""
              }`}
              disabled={isPending}
            />
            {errors.description && (
              <p
                id="desc-error"
                role="alert"
                className="text-xs font-medium text-destructive flex items-center gap-1 mt-1"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[140px] shadow-md shadow-indigo-600/20 font-medium"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Request
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

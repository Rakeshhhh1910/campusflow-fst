/**
 * store/activity-store.ts
 * Zustand client store for activity cart/selection.
 *
 * WHY ZUSTAND HERE (not server state)?
 * - The "selected activities" cart is purely client UI state
 * - It needs to persist across page navigations (client-side)
 * - It does NOT need to be in the database unless user explicitly registers
 * - RSC/server components handle actual activity data from DB
 *
 * WHAT IS NOT IN THIS STORE:
 * - Activity data (fetched server-side via Prisma in RSC)
 * - User session (managed by Better Auth server-side)
 * - Service requests (server state via Prisma)
 *
 * PERSISTENCE:
 * - Uses zustand/middleware persist with localStorage
 * - Survives page refreshes but not cross-device
 *
 * SELECTOR PATTERN:
 * - Components use granular selectors to avoid unnecessary re-renders
 * - e.g., useActivityStore(state => state.selectedActivities) NOT useActivityStore()
 */

"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Type for activity items stored in the cart
// Uses only serializable data (no class instances, no functions)
// This is what crosses the RSC → Client boundary
export interface SelectedActivity {
  id: string;
  title: string;
  category: string;
  date: string; // ISO string — serializable (not Date object)
  location: string;
  capacity: number;
}

interface ActivityStore {
  // State slices
  selectedActivities: SelectedActivity[];

  // Actions
  addActivity: (activity: SelectedActivity) => void;
  removeActivity: (activityId: string) => void;
  clearActivities: () => void;

  // Selectors (as methods for convenience)
  isSelected: (activityId: string) => boolean;
}

export const useActivityStore = create<ActivityStore>()(
  persist(
    (set, get) => ({
      // ── Initial State ────────────────────────────────────────────────────────
      selectedActivities: [],

      // ── Actions ──────────────────────────────────────────────────────────────

      /**
       * Add an activity to the selection.
       * Prevents duplicates — idempotent operation.
       */
      addActivity: (activity: SelectedActivity) => {
        const alreadySelected = get().selectedActivities.some(
          (a) => a.id === activity.id
        );
        if (!alreadySelected) {
          set((state) => ({
            selectedActivities: [...state.selectedActivities, activity],
          }));
        }
      },

      /**
       * Remove an activity from selection by ID.
       */
      removeActivity: (activityId: string) => {
        set((state) => ({
          selectedActivities: state.selectedActivities.filter(
            (a) => a.id !== activityId
          ),
        }));
      },

      /**
       * Clear all selected activities.
       */
      clearActivities: () => {
        set({ selectedActivities: [] });
      },

      /**
       * Check if an activity is in the selection.
       * Use as a selector: useActivityStore(state => state.isSelected)(id)
       */
      isSelected: (activityId: string) => {
        return get().selectedActivities.some((a) => a.id === activityId);
      },
    }),
    {
      name: "campusflow-activity-cart", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist the selectedActivities array, not the action functions
      partialize: (state) => ({ selectedActivities: state.selectedActivities }),
    }
  )
);

// ── Granular selectors for performance optimization ──────────────────────────
// Use these in components to avoid subscribing to the entire store.
// This prevents unnecessary re-renders when unrelated state changes.

/**
 * Hook: Get the list of selected activities.
 * Only re-renders when selectedActivities array changes.
 */
export const useSelectedActivities = () =>
  useActivityStore((state) => state.selectedActivities);

/**
 * Hook: Get count of selected activities.
 * Only re-renders when count changes.
 */
export const useSelectedActivitiesCount = () =>
  useActivityStore((state) => state.selectedActivities.length);

/**
 * Hook: Check if a specific activity is selected.
 * IMPORTANT: This creates a new selector per activityId.
 * Component only re-renders when THIS activity's selection state changes.
 */
export const useIsActivitySelected = (activityId: string) =>
  useActivityStore((state) =>
    state.selectedActivities.some((a) => a.id === activityId)
  );

/**
 * Hook: Get all store actions without subscribing to state.
 * Components that only need to call actions won't re-render on state changes.
 */
export const useActivityActions = () =>
  useActivityStore((state) => ({
    addActivity: state.addActivity,
    removeActivity: state.removeActivity,
    clearActivities: state.clearActivities,
    isSelected: state.isSelected,
  }));

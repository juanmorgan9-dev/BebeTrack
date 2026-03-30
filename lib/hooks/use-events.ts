"use client";

import useSWR from "swr";
import { useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { BabyEvent } from "@/lib/types";

const fetcher = async (): Promise<BabyEvent[]> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date_time", { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export function useEvents() {
  const { data: events, error, isLoading, mutate } = useSWR<BabyEvent[]>(
    "events",
    fetcher,
    { refreshInterval: 0, revalidateOnFocus: true }
  );

  // Real-time subscription
  useEffect(() => {
    const supabase = createClient();
    
    const channel = supabase
      .channel("events-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        () => {
          mutate();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mutate]);

  const addEvent = useCallback(async (event: Omit<BabyEvent, "id" | "created_at">) => {
    const supabase = createClient();
    const { error } = await supabase.from("events").insert([event]);
    if (error) throw error;
    mutate();
  }, [mutate]);

  const deleteEvent = useCallback(async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) throw error;
    mutate();
  }, [mutate]);

  return {
    events: events || [],
    isLoading,
    error,
    addEvent,
    deleteEvent,
    refresh: mutate,
  };
}

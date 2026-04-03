import { createBrowserClient } from "@/lib/supabase/server";
import { useEffect } from "react";
import { Appointment } from "../../prisma/generated/client";

interface Props {
  onAppointmentCreated: (appointment: Appointment) => void;
}

export const useAppointmentSubscription = ({ onAppointmentCreated }: Props) => {
  useEffect(() => {
    const supabase = createBrowserClient();

    const channel = supabase
      .channel("appointment-created")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notification",
          filter: `user_id=`,
        },
        (payload) => {},
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
};

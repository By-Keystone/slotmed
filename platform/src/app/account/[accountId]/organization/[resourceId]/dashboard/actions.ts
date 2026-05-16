import z from "zod";

export type GetStatisticsState =
  | { status: "idle" }
  | {
      status: "error";
      message: string;
      fieldErrors?: Record<string, string[]>;
    }
  | {
      status: "success";
      data: Record<string, any>;
    };

export async function getStatistics(_prevState: GetStatisticsState) {}

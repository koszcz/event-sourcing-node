import type { JSONEventType } from "@eventstore/db-client/dist/types/events";

export type CustomerRegistered = JSONEventType<
  "customer-registered",
  { id: string }
>;
export type CustomerArchived = JSONEventType<
  "customer-archived",
  { id: string; reason: string }
>;

export type CustomerEvent = CustomerRegistered | CustomerArchived;

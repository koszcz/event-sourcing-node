import { JSONEventData, jsonEvent } from "@eventstore/db-client";
import { Aggregate } from "../lib/aggregate";
import type {
  CustomerEvent,
  CustomerRegistered,
  CustomerArchived,
} from "./events";

export class Customer extends Aggregate<CustomerEvent> {
  private state: string[] = [];
  private id: string;

  constructor(id: string) {
    super();
    this.id = id;
  }

  register() {
    if (this.state.includes("registered"))
      throw new Error("Cannot register twice");

    this.apply(
      jsonEvent<CustomerRegistered>({
        type: "customer-registered",
        data: {
          id: this.id,
        },
      })
    );
  }

  archive(reason: string) {
    if (!this.state.includes("registered"))
      throw new Error("Cannot archive non registered customer");
    if (this.state.includes("archived"))
      throw new Error("Cannot archive twice");

    this.apply(
      jsonEvent<CustomerArchived>({
        type: "customer-archived",
        data: {
          id: this.id,
          reason,
        },
      })
    );
  }

  on(event: JSONEventData<CustomerEvent>) {
    switch (event.type) {
      case "customer-registered":
        this.state.push("registered");
        break;
      case "customer-archived":
        this.state.push("archived");
        break;
      default:
        break;
    }
  }

  streamName() {
    return `customer-${this.id}`;
  }

  print() {
    console.log(this.state);
  }
}

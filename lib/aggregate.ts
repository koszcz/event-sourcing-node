import type { JSONEventType } from "@eventstore/db-client/dist/types/events";

export abstract class Aggregate<E extends JSONEventType> {
  public events: E[] = [];

  apply(event: E) {
    this.events.push(event);
    this.on(event);
  }

  abstract on(event: E): void;
  abstract streamName(): string;
}

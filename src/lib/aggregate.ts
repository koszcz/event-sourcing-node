import type {
  JSONEventData,
  JSONEventType,
} from "@eventstore/db-client/dist/types/events";

export abstract class Aggregate<E extends JSONEventType> {
  public events: JSONEventData<E>[] = [];

  apply(event: JSONEventData<E>) {
    this.events.push(event);
    this.on(event);
  }

  abstract on(event: JSONEventData<E>): void;
  abstract streamName(): string;
}

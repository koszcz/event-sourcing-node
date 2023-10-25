import { EventStoreDBClient, JSONEventType } from "@eventstore/db-client";
import { Aggregate } from "./aggregate";
import { client } from "./event_store_client";

export class Repository<A extends Aggregate<E>, E extends JSONEventType> {
  private client: EventStoreDBClient;
  private lastEventRevision: bigint | undefined = undefined;

  constructor() {
    this.client = client;
  }

  async load(instance: A): Promise<void> {
    try {
      const events = this.client.readStream(instance.streamName());

      for await (const event of events) {
        if (event.event) {
          // @ts-ignore
          instance.on(event.event);
          this.lastEventRevision = event.event.revision;
        }
      }
    } catch (e: any) {
      if (e.type === "stream-not-found") {
        // In this case we just do not apply any events
      } else throw e;
    }
  }

  async store(instance: A) {
    await this.client.appendToStream<JSONEventType>(
      instance.streamName(),
      instance.events,
      {
        expectedRevision: this.lastEventRevision,
      }
    );
    instance.events = [];
  }
}

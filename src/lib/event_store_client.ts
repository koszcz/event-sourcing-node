import { EventStoreDBClient } from "@eventstore/db-client";

export const client = new EventStoreDBClient(
	{ endpoint: "localhost:2113" },
	{ insecure: true }
);

import { Customer } from "./customers/customer.js";
import { CustomerEvent } from "./customers/events.js";
import { Repository } from "./lib/repository.js";
import { runServer } from "./web/index.js";

async function letsProduceACustomer() {
  const customer = new Customer("3");
  const repository = new Repository<Customer, CustomerEvent>();

  await repository.load(customer);
  customer.register();
  await repository.store(customer);

  customer.print();
}

async function letsFinishACustomer() {
  const customer = new Customer("3");
  const repository = new Repository<Customer, CustomerEvent>();

  await repository.load(customer);
  customer.archive("Not longer with us");
  await repository.store(customer);

  customer.print();
}

// letsProduceACustomer();
// letsFinishACustomer();

runServer();

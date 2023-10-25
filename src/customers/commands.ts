import { Repository } from "../lib/repository";
import { Customer } from "./customer";
import { CustomerEvent } from "./events";

export const RegisterCustomer = (id: string) => ({
  name: 'register_customer',
  id,
}) as const;

export const ArchiveCustomer = (id: string, reason: string) => ({
  name: 'archive_customer',
  id,
  reason
}) as const;

export class CustomerCommandHandler {
  repository: Repository<Customer, CustomerEvent>;

  static instance() {
    return new CustomerCommandHandler(new Repository<Customer, CustomerEvent>)
  }

  constructor(repository: Repository<Customer, CustomerEvent>) {
    this.repository = repository;
  }

  async handle(command: ReturnType<typeof RegisterCustomer> | ReturnType<typeof ArchiveCustomer>) {
    switch (command.name) {
      case "register_customer":
        const customer1 = new Customer(command.id)
        await this.repository.load(customer1);
        customer1.register();
        await this.repository.store(customer1);
        break;
      case "archive_customer":
        const customer2 = new Customer(command.id)
        await this.repository.load(customer2);
        customer2.archive(command.reason);
        await this.repository.store(customer2)
        break;
    }
  }
}
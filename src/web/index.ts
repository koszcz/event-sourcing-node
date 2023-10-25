import express from 'express'
import { ArchiveCustomer, RegisterCustomer, CustomerCommandHandler } from '../customers/commands';
import { randomUUID } from 'crypto';
import { Repository } from '../lib/repository';
import { client } from '../lib/event_store_client';

const app = express();

app.get('/customers', async (req, res) => {
  const ids: string[] = []
  const events = client.readAll();

  for await (const event of events) {
    if (event.event?.type === 'customer-registered') {
      // @ts-ignore
      ids.push(event.event.data.id);
    };
  };

  res.json({ customers: ids.map((id) => ({ id })) })
})

app.get('/customers/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const events = client.readStream(`customer-${id}`);
    for await (const event of events) {
      res.json({ id: event.event?.id })
    }
  } catch (e) {
    console.error(e)
    res.sendStatus(404)
  }
})

app.post('/customers', async (req, res) => {
  const id = randomUUID();
  const command = RegisterCustomer(id);

  await CustomerCommandHandler.instance().handle(command);
  res.redirect(`/customers/${id}`)
})

app.delete('/customers/:id', async (req, res) => {
  const id = req.params.id;
  const reason = req.query.reason;

  if (!reason) {
    res.sendStatus(400);
    return;
  }

  const command = ArchiveCustomer(id, reason.toString());

  await CustomerCommandHandler.instance().handle(command);
  res.redirect(`/customers/${id}`)
})

export const runServer = () =>
  app.listen(3000, () => {
    console.log(`Let's go`)
  })
import { MachineRefillEvent } from "./events/machineRefillEvent";
import { MachineSaleEvent } from "./events/machineSaleEvent";
import { IEvent } from "./interface";
import { Machine } from "./machine";
import { pubSubService } from "./manager";
import { MachineStockWarningSubscriber } from "./subscribers/machineStockWarningSubscriber";
import { MachineRefillSubscriber } from "./subscribers/machineRefillSubscriber";
import { MachineSaleSubscriber } from "./subscribers/machineSaleSubscriber";

// helpers
const randomMachine = (): string => {
  const random = Math.random() * 3;
  if (random < 1) {
    return '001';
  } else if (random < 2) {
    return '002';
  }
  return '003';
}

const eventGenerator = (): IEvent => {
  const random = Math.random();

  if (random < 0.9) {
    const saleQty = Math.random() < 0.5 ? 1 : 2; // 1 or 2
    return new MachineSaleEvent(saleQty, randomMachine());
  } 
  const refillQty = Math.random() < 0.5 ? 3 : 5; // 3 or 5
  return new MachineRefillEvent(refillQty, randomMachine());
}


// program
(async () => {
  // create 3 machines with a quantity of 10 stock
  const machines: Machine[] = [ new Machine('001'), new Machine('002'), new Machine('003') ];

  const pss = new pubSubService();

  // create a machine sale event subscriber. inject the machines (all subscribers should do this)
  const saleSubscriber = new MachineSaleSubscriber('sale-01', machines);
  const refillSubscriber = new MachineRefillSubscriber('refill-01', machines);
  const stockWarningSubscriber = new MachineStockWarningSubscriber('stockCheck-01', machines);

  // create the PubSub service
  pss.subscribe(saleSubscriber)
  pss.subscribe(refillSubscriber)
  pss.subscribe(stockWarningSubscriber);

  
  // create 100 random events
  const events = new Array(100).fill(0).map(i => eventGenerator());

  // publish the events
  for(const e of events) {
    pss.publish(e)
  }
  
})();

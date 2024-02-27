import { MachineRefillEvent } from "../events/machineRefillEvent";
import { StockLevelOkEvent } from "../events/stockLevelOkEvent";
import { IPublishSubscribeService, ISubscriber } from "../interface";
import { Machine } from "../machine";

class MachineRefillSubscriber implements ISubscriber {
    public machines: Machine[];
  
    constructor (machines: Machine[]) {
      this.machines = machines
    }
  
        handle(event: MachineRefillEvent, pubSub?: IPublishSubscribeService): void {
        if(event.type() !== 'refill') return

        for(const m of this.machines) {
            if(m.id === event.machineId()) {
            const beforeRefill = m.stockLevel
  
            m.stockLevel += event.getRefillQuantity();
            console.log(`# Refill event occur at machine ${event.machineId()} for ${event.getRefillQuantity()} units.`)
            console.log(`# Current Stock Level: ${m.stockLevel}\n`)
  
            if(beforeRefill < 3 && m.stockLevel >= 3) pubSub?.publish(new StockLevelOkEvent(m.id))
            }
        }
    }
}

export {MachineRefillSubscriber}
  
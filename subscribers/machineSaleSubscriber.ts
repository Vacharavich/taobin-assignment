import { LowStockWarningEvent } from "../events/lowStockWarningEvent";
import { MachineSaleEvent } from "../events/machineSaleEvent";
import { IPublishSubscribeService, ISubscriber } from "../interface";
import { Machine } from "../machine";

class MachineSaleSubscriber implements ISubscriber {
    public machines: Machine[];
  
    constructor (machines: Machine[]) {
      this.machines = machines; 
    }
  
    handle(event: MachineSaleEvent, pubSub?: IPublishSubscribeService): void {
        if(event.type() !== 'sale') return

        for(const m of this.machines) {
            if(m.id === event.machineId()) {
                const preSell = m.stockLevel
  
                m.stockLevel -= event.getSoldQuantity();
                console.log(`# Sale event occur at machine ${event.machineId()} for ${event.getSoldQuantity()} units.`)
                console.log(`# Current Stock Level: ${m.stockLevel}\n`)
  
                if(preSell >= 3 && m.stockLevel < 3) pubSub?.publish(new LowStockWarningEvent(m.id))
            }
        }
    }
}

export {MachineSaleSubscriber}
  
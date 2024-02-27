import { LowStockWarningEvent } from "../events/lowStockWarningEvent";
import { MachineSaleEvent } from "../events/machineSaleEvent";
import { IPublishSubscribeService, ISubscriber } from "../interface";
import { Machine } from "../machine";

class MachineSaleSubscriber implements ISubscriber {
    public machines: Machine[];
    private readonly subID: string;
  
    constructor (subID: string, machines: Machine[]) {
      this.machines = machines; 
      this.subID = subID;
    }

    getSubID() {return this.subID}
  
    handle(event: MachineSaleEvent, pubSub?: IPublishSubscribeService): void {
        if(event.type() !== 'sale') return

        for(const m of this.machines) {
            
            if(m.id === event.machineId()) {
                if(m.stockLevel < event.getSoldQuantity()) {
                    console.log(`# Sale event can't occur - not enough stock.`)
                    pubSub?.publish(new LowStockWarningEvent(m.id))
                    return;
                }

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
  
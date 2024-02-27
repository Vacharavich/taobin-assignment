import { LowStockWarningEvent } from "../events/lowStockWarningEvent"
import { MachineRefillEvent } from "../events/machineRefillEvent"
import { StockLevelOkEvent } from "../events/stockLevelOkEvent"
import { IPublishSubscribeService, ISubscriber } from "../interface"
import { Machine } from "../machine"

class MachineStockWarningSubscriber implements ISubscriber {
    public machines: Machine[]
    private readonly subID: string
  
    constructor(subID: string, machines: Machine[]) {
      this.machines = machines
      this.subID = subID
    }

    getSubID() {return this.subID}
  
    handle(event: LowStockWarningEvent | StockLevelOkEvent, pubSub?: IPublishSubscribeService): void {
        if(event.type() === 'stockWarning') {
          for(const m of this.machines) {
            if(m.id === event.machineId()) {
              m.lowStockWarning = true;

              console.log(`# Warning machine ID ${event.machineId()} stock is low\n`)

              // Assume that every time that lowStockWarningEvent occurs, there will be an refill event happen afterward.
              pubSub?.publish(new MachineRefillEvent(5, event.machineId()))
            }
          }
        }

        if(event.type() === 'stockOk') {
          for(const m of this.machines) {
            if(m.id === event.machineId()) {
              m.lowStockWarning = false;

              console.log(`# Machine ID ${event.machineId()} stock is OK level\n`)
            }
          }
        }
    }
}

export {MachineStockWarningSubscriber}
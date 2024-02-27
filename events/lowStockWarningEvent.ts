import { IEvent } from "../interface"

class LowStockWarningEvent implements IEvent {
    constructor(private readonly _machineId: string) {};
  
    machineId(): string {
      return this._machineId
    }
  
    type(): string {
      return 'stockWarning'
    }
}

export {LowStockWarningEvent}
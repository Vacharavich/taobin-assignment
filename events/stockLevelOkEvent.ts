import { IEvent } from "../interface"

class StockLevelOkEvent implements IEvent {
    constructor(private readonly _machineId: string) {};
  
    machineId(): string {
      return this._machineId
    }
  
    type(): string {
      return 'stockOk'
    }
}

export {StockLevelOkEvent}

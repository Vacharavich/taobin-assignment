import { LowStockWarningEvent } from "../events/lowStockWarningEvent"
import { MachineRefillEvent } from "../events/machineRefillEvent"
import { StockLevelOkEvent } from "../events/stockLevelOkEvent"
import { Machine } from "../machine"
import { pubSubService } from "../manager"
import { MachineRefillSubscriber } from "../subscribers/machineRefillSubscriber"
import { MachineStockWarningSubscriber } from "../subscribers/machineStockWarningSubscriber"

describe("Test Stock Warning Subscriber", () => {
    it("Test warning event : machine T-001 lowStockWarning will become true, and also publish refill event", () => {
        const machines: Machine[] = [ new Machine('T-001', 3) ]
        const testStockWarningSub = new MachineStockWarningSubscriber(machines)
        const testPubSub = new pubSubService();

        testPubSub.subscribe(testStockWarningSub);

        const pubSubSpyOn = jest.spyOn(testPubSub, 'publish')

        expect(pubSubSpyOn).not.toHaveBeenCalled()

        testPubSub.publish(new LowStockWarningEvent('T-001'))

        // Expect lowStockwarning change from true to false
        expect(machines[0].lowStockWarning).toEqual(true)

        // Expect 2nd publish as refill event
        expect(pubSubSpyOn).toHaveBeenCalledTimes(2)
        expect(pubSubSpyOn).toHaveBeenCalledWith(new MachineRefillEvent(5, 'T-001'))
    })

    it("Test stock level ok event : machine T-001 after the refill event from low stock warning, lowStockWarning of T-001 machine shold be false", () => {
        const machines: Machine[] = [ new Machine('T-001', 1) ]
        const testStockWarningSub = new MachineStockWarningSubscriber(machines)
        const testRefillSub = new MachineRefillSubscriber(machines);

        const testPubSub = new pubSubService();

        testPubSub.subscribe(testStockWarningSub)
        testPubSub.subscribe(testRefillSub)

        testPubSub.publish(new LowStockWarningEvent('T-001'))

        expect(machines[0].stockLevel).toEqual(6)
        expect(machines[0].lowStockWarning).toEqual(false)
    }) 

    it("Test subscribing after publish event : T-001 and T-002 lowStockWarning should not changed.", () => {
        const machines: Machine[] = [ new Machine('T-001', 2, false), new Machine('T-002', 8, true) ]
        const teststockWarningSub = new MachineStockWarningSubscriber(machines)
        const testPubSub = new pubSubService();

        testPubSub.publish(new LowStockWarningEvent('T-001')) //Change T-001 lowStockWarning should not change from false to true
        testPubSub.publish(new StockLevelOkEvent('T-002')) //Change T-002 lowStockWarning should not change from true to false

        testPubSub.subscribe(teststockWarningSub)
        expect(machines[0].lowStockWarning).toEqual(false)
        expect(machines[1].lowStockWarning).toEqual(true)
    })
})
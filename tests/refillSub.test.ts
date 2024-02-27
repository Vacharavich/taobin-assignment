import { MachineRefillEvent } from "../events/machineRefillEvent"
import { StockLevelOkEvent } from "../events/stockLevelOkEvent"
import { Machine } from "../machine"
import { pubSubService } from "../manager"
import { MachineRefillSubscriber } from "../subscribers/machineRefillSubscriber"

describe("Test Refill Subscriber", () => {
    it("Test refill event : machine T-001 stock should increase by 5, while T-002 stock remains the same.", () => {
        const machines: Machine[] = [ new Machine('T-001'), new Machine('T-002') ]
        const testRefillSub = new MachineRefillSubscriber('refill-test', machines)
        const testPubSub = new pubSubService();

        testPubSub.subscribe(testRefillSub)

        testPubSub.publish(new MachineRefillEvent(5, 'T-001'))

        expect(machines[0].stockLevel).toEqual(15)
        expect(machines[1].stockLevel).toEqual(10)
    })

    it("Test refill event to stock level ok event : Pubsub should call publish 2 times, and one of them should be StockLevelOkEvent.", () => {
        const machines: Machine[] = [ new Machine('T-001', 2)]
        const testRefillSub = new MachineRefillSubscriber('refill-test', machines)
        const testPubSub = new pubSubService();

        testPubSub.subscribe(testRefillSub)

        const pubSubSpyOn = jest.spyOn(testPubSub, 'publish')

        expect(pubSubSpyOn).not.toHaveBeenCalled()

        testPubSub.publish(new MachineRefillEvent(5, 'T-001'))

        expect(pubSubSpyOn).toHaveBeenCalledTimes(2)
        expect(pubSubSpyOn).toHaveBeenCalledWith(new StockLevelOkEvent('T-001'))
    })

    it("Test refill event to not low stock machine : Pubsub should call publish 1 time, StockLevelOkEvent should has not been called.", () => {
        const machines: Machine[] = [ new Machine('T-001')]
        const testRefillSub = new MachineRefillSubscriber('refill-test', machines)
        const testPubSub = new pubSubService();

        testPubSub.subscribe(testRefillSub)

        const pubSubSpyOn = jest.spyOn(testPubSub, 'publish')

        expect(pubSubSpyOn).not.toHaveBeenCalled()

        testPubSub.publish(new MachineRefillEvent(5, 'T-001'))

        expect(pubSubSpyOn).toHaveBeenCalledTimes(1)
        expect(pubSubSpyOn).not.toHaveBeenCalledWith(new StockLevelOkEvent('T-001'))
    })

    it("Test subscribing after publish event : T-001 stock level should remains the same.", () => {
        const machines: Machine[] = [ new Machine('T-001')]
        const testRefillSub = new MachineRefillSubscriber('refill-test', machines)
        const testPubSub = new pubSubService();

        testPubSub.publish(new MachineRefillEvent(5, 'T-001'))

        testPubSub.subscribe(testRefillSub)
        expect(machines[0].stockLevel).toEqual(10)
    })
})
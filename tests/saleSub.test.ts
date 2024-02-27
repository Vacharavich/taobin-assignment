import { LowStockWarningEvent } from "../events/lowStockWarningEvent";
import { MachineSaleEvent } from "../events/machineSaleEvent";
import { Machine } from "../machine";
import { pubSubService } from "../manager";
import { MachineSaleSubscriber } from "../subscribers/machineSaleSubscriber";

describe("Test Sale Subscriber", () => {
    it("Test sale event : machine T-001 stock should reduce by 5, while T-002 stock remains the same.", () => {
        const machines: Machine[] = [ new Machine ('T-001'), new Machine ('T-002') ]
        const testSaleSub = new MachineSaleSubscriber(machines)
        const testPubSub = new pubSubService()
        testPubSub.subscribe(testSaleSub)

        testPubSub.publish(new MachineSaleEvent(5, 'T-001'))
        
        expect(machines[0].stockLevel).toEqual(5)
        expect(machines[1].stockLevel).toEqual(10)
    })

    it("Test sale event to warning stock level event : Pubsub should call publish 2 times, and one of them should be LowStockWarningEvent", () => {
        const machines: Machine[] = [ new Machine ('T-001') ]
        const testSaleSub = new MachineSaleSubscriber(machines)
        const testPubSub = new pubSubService()
        testPubSub.subscribe(testSaleSub)

        const pubSubSpyOn = jest.spyOn(testPubSub, 'publish')

        expect(pubSubSpyOn).not.toHaveBeenCalled()

        testPubSub.publish(new MachineSaleEvent(8, 'T-001'))

        expect(pubSubSpyOn).toHaveBeenCalledTimes(2)
        expect(pubSubSpyOn).toHaveBeenCalledWith(new LowStockWarningEvent('T-001'))
    })

    it("Test sale event with low stock machine : Pubsub should call publish 1 time, LowStockWarningEvent should has not been called", () => {
        const machines: Machine[] = [ new Machine ('T-001', 2) ]
        const testSaleSub = new MachineSaleSubscriber(machines)
        const testPubSub = new pubSubService()
        testPubSub.subscribe(testSaleSub)

        const pubSubSpyOn = jest.spyOn(testPubSub, 'publish')

        expect(pubSubSpyOn).not.toHaveBeenCalled()

        testPubSub.publish(new MachineSaleEvent(1, 'T-001'))

        expect(pubSubSpyOn).toHaveBeenCalledTimes(1)
        expect(pubSubSpyOn).not.toHaveBeenCalledWith(new LowStockWarningEvent('T-001'))
    })

    it("Test subscibing after publish event : T-001 stock level should remains the same.", () => {
        const machines: Machine[] = [ new Machine('T-001') ]
        const testSaleSub = new MachineSaleSubscriber(machines)
        const testPubSub = new pubSubService();

        testPubSub.publish(new MachineSaleEvent(8, 'T-001'))

        testPubSub.subscribe(testSaleSub)
        expect(machines[0].stockLevel).toEqual(10)
    })
})


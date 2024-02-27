import { Machine } from "../machine";
import { pubSubService } from "../manager";
import { MachineSaleSubscriber } from "../subscribers/machineSaleSubscriber";

const machines: Machine[] = [ new Machine ('T-001'), new Machine ('T-002') ]

describe("Test PubSub", () => {    
    it("Test subscribe : pubSub Subscriber should increase by 1", () => {
        const testSaleSub = new MachineSaleSubscriber('sale-test', machines)
        const testPubSub = new pubSubService()

        testPubSub.subscribe(testSaleSub)

        expect(testPubSub.getSubscriberList().size).toEqual(1)
    })

    it("Test subscribe : pubSub should throw error when received handler ID that already appear in subscriberList", () => {
        const duplicatedID = 'duped-sale-test'

        const testSaleSub1 = new MachineSaleSubscriber(duplicatedID, machines)
        const testSaleSub2 = new MachineSaleSubscriber(duplicatedID, machines)

        const testPubSub = new pubSubService()

        testPubSub.subscribe(testSaleSub1)

        expect(testPubSub.getSubscriberList().size).toEqual(1)

        //Throwing Error check
        expect(() => {
            testPubSub.subscribe(testSaleSub2)
        }).toThrow(new Error("DUPLICATED SUBSCRIBER ID"))

        expect(testPubSub.getSubscriberList().size).toEqual(1)

    })

    it("Test unsubscribe : pubSub Subscriber should reduce by 1", () => {
        const testSaleSub1 = new MachineSaleSubscriber('sale-test-1', machines)
        const testSaleSub2 = new MachineSaleSubscriber('sale-test-2', machines)

        const testPubSub = new pubSubService()

        testPubSub.subscribe(testSaleSub1)
        testPubSub.subscribe(testSaleSub2)

        testPubSub.unsubscribe(testSaleSub2.getSubID())

        expect(testPubSub.getSubscriberList().size).toEqual(1)

        expect(testPubSub.getSubscriberList().get(testSaleSub1.getSubID())?.getSubID()).toEqual('sale-test-1')
        expect(testPubSub.getSubscriberList().get(testSaleSub2.getSubID())?.getSubID()).toBeUndefined()
    })
})



import { Machine } from "../machine";
import { pubSubService } from "../manager";
import { MachineSaleSubscriber } from "../subscribers/machineSaleSubscriber";

const machines: Machine[] = [ new Machine ('T-001'), new Machine ('T-002') ]

const testSaleSub = new MachineSaleSubscriber(machines)

describe("Test PubSub", () => {    
    it("Test subscribe : pubSub Subscriber should increase by 1", () => {
        const testPubSub = new pubSubService()
        let pubSubSize = testPubSub.getSubscriberList().size
        testPubSub.subscribe(testSaleSub)

        expect(testPubSub.getSubscriberList().size).toEqual(pubSubSize + 1)
    })

    it("Test unsubscribe : pubSub Subscriber should reduce by 1", () => {
        const testPubSub = new pubSubService()
        testPubSub.subscribe(testSaleSub)
        let pubSubSize = testPubSub.getSubscriberList().size
        testPubSub.unsubscribe(testSaleSub)

        expect(testPubSub.getSubscriberList().size).toEqual(pubSubSize - 1)
    })
})



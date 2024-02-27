import { IEvent, IPublishSubscribeService, ISubscriber } from "./interface"


class pubSubService implements IPublishSubscribeService {
    private _subscriber: Map<string, ISubscriber>
  
    constructor() {
      this._subscriber = new Map<string, ISubscriber>()
      //console.log("# Manager Initiated")
    }
  
    public publish(event: IEvent): void {
      //console.log('#', event.type(), event)
      
      for(const sub of this._subscriber.values()) {
        sub.handle(event, this)
      }
    }
  
    subscribe(handler: ISubscriber): void {
      if(!this._subscriber.has(handler.getSubID())) this._subscriber.set(handler.getSubID(), handler)
      else throw new Error("DUPLICATED SUBSCRIBER ID");
      //console.log(this.getSubscriberList())
    }
  
    unsubscribe(subID: string): void {
      this._subscriber.delete(subID)
      //console.log(this.getSubscriberList())
    }
   
    getSubscriberList(): Map<string, ISubscriber> {
      return this._subscriber
    }
}

export {pubSubService}
import { IEvent, IPublishSubscribeService, ISubscriber } from "./interface"


class pubSubService implements IPublishSubscribeService {
    private _subscriber: Set<ISubscriber>
  
    constructor() {
      this._subscriber = new Set<ISubscriber>()
      //console.log("# Manager Initiated")
    }
  
    public publish(event: IEvent): void {
      //console.log('#', event.type(), event)
      
      for(const sub of this._subscriber) {
        sub.handle(event, this)
      }
    }
  
    subscribe(handler: ISubscriber): void {
      this._subscriber.add(handler)
      //console.log(this.getSubscriberList())
    }
  
    unsubscribe(handler: ISubscriber): void {
      this._subscriber.delete(handler)
      //console.log(this.getSubscriberList())
    }
   
    getSubscriberList(): Set<ISubscriber> {
      return this._subscriber
    }
}

export {pubSubService}
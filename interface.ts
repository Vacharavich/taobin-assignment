interface IEvent {
    type(): string;
    machineId(): string;
}
  
interface ISubscriber {
    getSubID(): string;
    handle(event: IEvent, pubSub?: IPublishSubscribeService): void;
}
  
interface IPublishSubscribeService {
    publish (event: IEvent): void;
    subscribe (handler: ISubscriber): void;
    unsubscribe (subID: string): void;
}

export {IEvent, ISubscriber, IPublishSubscribeService}
  
interface IEvent {
    type(): string;
    machineId(): string;
}
  
interface ISubscriber {
    handle(event: IEvent, pubSub?: IPublishSubscribeService): void;
}
  
interface IPublishSubscribeService {
    publish (event: IEvent): void;
    subscribe (handler: ISubscriber): void;
    unsubscribe (handler: ISubscriber): void;
}

export {IEvent, ISubscriber, IPublishSubscribeService}
  
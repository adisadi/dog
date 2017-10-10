import {Color,Player} from '../game/player';
import { Card } from '../game/cards';

enum EnumMessageType{
    PlayerJoin, //server-> clients
    PlayerCards,//server-> clients
    ExchangeCard, //client-> server
    PlayersTurn, //server->clients
    PossibleMoves, //client->server->client
    PlayerMove, //client->server->clients,
    Win,//server->clients
    Error//server->clients
}

interface IMessageHandler {
    HandleMessage(msg:IMessage ):void;
}

interface IMessage{
    Type:EnumMessageType;
    Payload:any;
}

export class JoinMessage implements IMessage{
    Type:EnumMessageType=EnumMessageType.PlayerJoin
    Payload:any;
    constructor(player:Player){
        this.Payload={
            name:player.name,
            color:player.color
        }
    }
}

export class PlayerCardsMessage implements IMessage{
    Type:EnumMessageType=EnumMessageType.PlayerCards
    Payload:any;
    constructor(player:Player){
        this.Payload={
            hand:player.hand
        }
    }
}

export class ExchangeCardsMessage implements IMessage{
    Type:EnumMessageType=EnumMessageType.PlayerJoin
    Payload:any;
    constructor(name:string,color:Color){
        this.Payload={
            name:name,
            color:color
        }
    }
}

class OrderMessageHandler implements IMessageHandler {
    HandleMessage( msg:IMessage ):void {
      

       // Handle the message.
    }
}

class SomeOtherMessageHandler {
    HandleMessage( msg:IMessage ):void {
       

       // Handle the message.
    }
}

/* class MessageProcessor {
     handlers:Map<string,IMessageHandler>;

    public MessageProcessor() {
       this.handlers = new Map();;
       this.handlers.set(new SomeOtherMessageHandler());
       this.handlers.set(new OrderMessageHandler());
    }

    public void ProcessMessage( IMessage msg ) {
       bool messageWasHandled
       foreach( IMessageHandler handler in handlers ) {
           if ( handler.HandleMessage(msg) ) {
               messageWasHandled = true;
               break;
           }
       }

       if ( !messageWasHandled ) {
          // Do some default processing, throw error, whatever.
       }
    }
} */
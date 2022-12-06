import { Bot } from './../bot';
import { Message } from 'discord.js';

export class ZirucoMessage{
    name?:string
    exec:(message: Message,client:Bot)=>any
    reply?:(message: Message,client:Bot)=>ZirucoMessage
    
    constructor(exec:(message: Message,client:Bot)=>{},reply?:(message: Message,client:Bot)=>ZirucoMessage){
        this.name="";
        this.exec=exec;
        this.reply=reply;
    }
}


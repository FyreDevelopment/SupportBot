import { TextChannel, GuildMember, Message } from "discord.js";
import { client } from "../../../";

const coll = client.db.collection("tickets");

export default class Ticket {
    ticketID: string;
    status: 1 | 2 | 3;
    ticketAuthor: GuildMember;
    ticketChannel?: TextChannel;
    supporters: string[];
    message: Message;

    constructor() {};

    async fetch(inputType: "channel" | "id" | "author", input: string | TextChannel) {
        let ticket;
        switch(inputType) {
            case "channel":
                ticket = await coll.findOne({ ticketChannel: input });
                break;
            case "id":
                ticket = await coll.findOne({ ticketID: input });
                break;
            case "author":
                ticket = await coll.findOne({ ticketAuthor: input });
                break;
        }
        
        if(!ticket) return client.error(`Ticket could not be found with input ${inputType} => ${input}`);

        for(const key of Object.keys(ticket))
            this[key] = ticket[key];

        this.ticketChannel = client.channels.cache.get(ticket.channel) as TextChannel;
        this.ticketAuthor = await client.guilds.cache.get(client.config.guild).members.fetch(ticket.authorID) as GuildMember;
    };

    create() {}
    accept() {}
    reject(){}
    close() {}
    supporter() {}

    log(input: string) {
        
    }
}
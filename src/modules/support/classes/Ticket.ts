import { TextChannel, GuildMember, Message, User } from "discord.js";
import { client } from "../../../";

const coll = client.db.collection("tickets");

export default class Ticket {
    id: string;
    found: boolean;
    status: 1 | 2 | 3;
    author: GuildMember;
    channel?: TextChannel;
    supporters: string[];
    message: Message;

    constructor() {};

    async fetch(inputType: "channel" | "id" | "author" | "message", input: string | TextChannel, check?: boolean) {
        let ticket;
        switch(inputType) {
            case "channel":
                ticket = await coll.findOne({ channelID: input });
                break;
            case "id":
                ticket = await coll.findOne({ id: input });
                break;
            case "author":
                ticket = await coll.findOne({ authorID: input });
                break;
            case "message":
                ticket = await coll.findOne({ message: input });
                break;
        }

        if(!ticket) return this.found = false;
        this.found = true;

        for(const key of Object.keys(ticket))
            this[key] = ticket[key];

        this.channel = client.channels.cache.get(ticket.channel) as TextChannel;
        this.author = await client.guilds.cache.get(client.config.guild).members.fetch(ticket.authorID) as GuildMember;

        return true;
    };

    async create(message: Message, description: string) {
        const attachments = message.attachments.map(x => x),
            fields = [],
            ticketCount = await client.db.collection("tickets").countDocuments({}),
            ticketId = (ticketCount + 1).toString().padStart(5, "0");

        if(attachments.length > 0)
            fields.push({
                name: "Attachments",
                value: attachments.map(x => `[${x.name}](${x.proxyURL})`)
            });

        const msg = await (client.channels.cache.get(client.config.channels.tickets) as TextChannel)
            .send({ 
                embed: {
                    author: {
                        name: `${message.author.tag} - #${ticketId}`,
                        icon_url: message.author.displayAvatarURL()
                    },
                    description,
                    fields,
                    color: 0x18de2f
                }
            });

            await msg.react(client._emojis.yes);
            await msg.react(client._emojis.no);

            coll.insertOne({
                id: ticketId,
                status: 1,
                authorID: message.author.id,
                createdAt: Date.now(),
                message: msg.id,
                attachments
            });
            
            return true;
        }

    accept(acceptor: User) {

    }

    reject(){}
    close(closer: User, msg: Message) {}
    delete(closer: User, msg: Message) {}
    supporter() {}

    log(input: string) {
        const log = `[] ${input}`
        coll.findOneAndUpdate({ id: this.id }, { $push: { logs: log } })
    }
}

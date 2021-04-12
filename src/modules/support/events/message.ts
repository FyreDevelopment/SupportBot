import { TextChannel } from "discord.js";
import Ticket from "../classes/Ticket"

module.exports = {
    name: "message",
    run: async (client, msg) => {
        if(msg.author.bot) return;

        const ticket = new Ticket();

        if(msg.channel.id == "612438538000138240") {
            (msg.channel as TextChannel).updateOverwrite(msg.author, {
                SEND_MESSAGES: false
            });

            await msg.delete();
            await ticket.fetch("author", msg.author.id, true);

            if(ticket.found) return (await msg.channel.send(`${msg.author}, you already have a ticket! If it has not yet been accepted, then wait a few minutes!`)).delete({ timeout: 5000 });
            if(msg.content.length < 25) return (await msg.channel.send(`${msg.author}, your message must contain atleast 25 characters to create a ticket!`)).delete({ timeout: 5000 });

            await ticket.create(msg, msg.content);
            (await msg.channel.send(`${msg.author}, your ticket has been created, a support agent will accept it shortly!`)).delete({ timeout: 5000 });
            
        }
    }
}
import Ticket from "../classes/Ticket"

module.exports = {
    name: "message",
    type: "client",
    run: async (client, msg) => {
        const ticket = new Ticket();

        if(msg.channel.id == "612438538000138240") {
            await msg.delete();
            await ticket.fetch("author", msg.author.id, true);

            if(ticket.found) return (await msg.channel.send(msg.author, `you already have a ticket! If it has not yet been accepted, then wait a few minutes!`)).delete({ timeout: 5000 });
            if(msg.content.length < 25) return (await msg.channel.send(msg.author, `your message must contain atleast 25 characters to create a ticket!`)).delete({ timeout: 5000 });
            
            ticket.create(msg.author, msg.content);
            (await msg.channel.send(msg.author, `your ticket has been created, a support agent will accept it shortly!`)).delete({ timeout: 5000 });
            
        }
    }
}
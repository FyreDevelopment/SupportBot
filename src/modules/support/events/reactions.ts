import { TextChannel } from "discord.js";
import Ticket from "../classes/ticket";

module.exports = {
    name: "raw",
    run: async (client, out) => {
        if(!["MESSAGE_REACTION_ADD"].includes(out.t) || !out.d.guild_id) return;
        const guild = client.guilds.cache.get(out.d.guild_id),
            member = await guild.members.fetch(out.d.user_id);
        
        if(!member || member.user.bot) return;

        const ticket = new Ticket();
        if (!(await ticket.fetch("message", out.d.message_id))) return;
        let tMsg;
        try {
            tMsg = await (client.channels.cache.get(client.config.channels.tickets) as TextChannel).messages.fetch(out.d.message_id);
        } catch { 
            tMsg = null;
        }

        if(!tMsg) return;

        if(out.d.emoji.id === "830151020851363841" || out.d.emoji.id === "831282740892139571") {
            tMsg.reactions.removeAll();
            tMsg.react("❤");
            tMsg.awaitReactions((r, u) => r.emoji.name === "❤" && u.id === out.d.user_id, { max: 1, time: 5 * 1000, errors: ["time"] })
                .then(() => {
                    if(ticket.status === 1) return ticket.delete(member.user, tMsg);
                    else return ticket.close(member.user, tMsg);
                })
                .catch(() => {
                    tMsg.reactions.removeAll();
                    if(out.d.emoji.id === "831282740892139571") return tMsg.react("831282740892139571")
                    if(!ticket.status) tMsg.react("830151021837680721");
                    tMsg.react("830151020851363841");
                });
        }
        
        if(out.d.emoji.id === "830151021837680721" && !ticket.status) {
            ticket.accept(member);
            tMsg.reactions.removeAll();
            tMsg.react("831282740892139571");
        }
    }
};
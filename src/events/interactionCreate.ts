import { GuildMember, MessageEmbed } from "discord.js";

module.exports = {
	name: "raw",
	type: "client",
	run: async (client, out) => {
		if (out.t !== "INTERACTION_CREATE") return;

		const cmd = client.scommands.find(c => c.config.name === out.d.data.name && c.config.slashCommand),
			data = out.d;
			
		if (!cmd) return;
		data.guild = await client.guilds.fetch(data.guild_id);
		data.channel = data.guild.channels.resolve(data.channel_id);
		data.member = new GuildMember(client, data.member, data.guild);
		data.send = async (content, options?) => {
			const data1: { 
				embeds?: MessageEmbed[];
				content?: string | MessageEmbed[];
			} = {};

			if(options) {
				data1.content = content;
				data1.embeds = [options.embed];
			}
			else if(typeof content == "object") data1.embeds = [content.embed];
			else if(typeof content == "string") data1.content = content;

			client.fetch(`https://discord.com/api/v8/interactions/${data.id}/${data.token}/callback`, { 
				method: "POST",
				data: { type: 4, data: data1 },
				headers: { "Content-Type": "application/json" }
			 });

			return data;
		};
		data.delete = timeout =>
			setTimeout(() => {
				client.fetch(`https://discord.com/api/v8/webhooks/${client.user.id}/${data.token}/messages/@original`, {
					method: "DELETE"
				});
			}, timeout);

		cmd.run(data, client);
	}
};

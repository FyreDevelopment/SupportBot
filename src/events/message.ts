module.exports = {
	name: "message",
	type: "client",
	run: async (client, msg) => {
		if (msg.channel.type === "dm") return;
		const prefixes = ["!"];

		prefixes.forEach(async inp => {
			const prefix = msg.content.match(new RegExp(`^<@!?${client.user.id}> `))
				? msg.content.match(new RegExp(`^<@!?${client.user.id}> `))[0]
				: msg.content.toLowerCase().startsWith(inp.toLowerCase())
				? inp
				: null;

			if (!prefix) return;

			const args = msg.content.replace(prefix, "").split(" ").slice(1),
				input = msg.content.replace(prefix, "").split(" ")[0].toLowerCase(),
				cmd = client.commands.get(input) || client.aliases.get(input);

			if (!cmd) return;

			try {
				msg.meperms = perm => msg.channel.send(`⚠ Lack of permissions ${msg.author}! I am missing **${perm}**.`);
				msg.perms = perm => msg.channel.send(`⚠ Lack of permissions ${msg.author}! You are missing **${perm}**.`);
				await cmd.run(client, msg, args);
			} catch (e) {
				msg.reply("an error occured while executing that command! Our development team have been notified.");
				client.users.cache.get("506899274748133376").send({
					embed: {
						description: `${msg.author} | ${cmd.config.name}\n\n${e.stack}`
					}
				});
			}
		});
	}
};

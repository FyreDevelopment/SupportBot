import { readdirSync, existsSync } from "fs";

const modules = readdirSync(`${process.cwd()}/dist/modules/`, {
	withFileTypes: true
})
	.filter(dirent => dirent.isDirectory())
	.map(x => `${process.cwd()}/dist/modules/${x.name}`);

export const loadEvents = async client => {
	client.moduleCount = modules.length;
	modules.forEach(module => {
		const eventsPath = `${module}/events/`;
		if (existsSync(eventsPath))
			readdirSync(eventsPath)
				.filter(x => x.endsWith(".js"))
				.forEach(file => {
					const event = require(`${eventsPath}${file}`);
					client.events.set(event.name + Math.random(), event);
					client.on(event.name, (...args) => event.run(client, ...args));
				});
	});

	readdirSync(`${process.cwd()}/dist/events/`)
		.filter(x => x.endsWith(".js"))
		.forEach(file => {
			const event = require(`${process.cwd()}/dist/events/${file}`);
			client.events.set(event.name + Math.random(), event);
			event.type && event.type !== "process"
				? client.on(event.name, (...args) => event.run(client, ...args))
				: process.on(event.name, (...args) => event.run(client, ...args));
		});

	return true;
};

export const loadCommands = async client => {
	modules.forEach(async module => {
		const commandsPath = `${module}/commands/`;
		if (existsSync(commandsPath))
			readdirSync(commandsPath)
				.filter(x => x.endsWith(".js"))
				.forEach(file => {
					const command = require(`${commandsPath}${file}`);
					client[command.config.slashCommand ? "scommands" : "commands"].set(
						command.config.name,
						command
					);
					command.config.aliases.forEach(alias =>
						client.aliases.set(alias, command)
					);
				});
	});

	return true;
};

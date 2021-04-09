import axios from "axios";
import chalk from "chalk";
import logger from "debug";

import { Client, Collection, MessageEmbed } from "discord.js";
import { connect, Db, MongoClient } from "mongodb";
import { loadEvents, loadCommands } from "./module.controller";

import * as Methods from "../methods";


logger.enable(process.env.DEBUG || "Discord-Bot:*");
const log = logger("Discord-Bot");

export default class Bot extends Client {
	moduleCount: number;
	database: Promise<MongoClient>;
	db: Db;
	
	info = (...args) => log.extend("info")(...args);
	error = (...args) => log.extend("error")(...args);
	debug = (...args) => log.extend("debug")(...args);
	success = (...args) => log.extend("success")(...args); 
	
	readonly config = require("../../config");

	fetch = (url: string, options?: object) =>
		axios(url, options).catch(e =>
			console.log(`${chalk.bgMagenta(` AXIOS `)} ${e}`)
		);

	events = new Collection<string, object>();
	commands = new Collection<string, object>();
	scommands = new Collection<string, object>();
	aliases = new Collection<string, object>();

	Embed = MessageEmbed;

	constructor(options?) {
		super(options);
	}

	async initDatabase() {
		this.debug("Database... connecting");
		const db = await connect(process.env.MONGO_URI as string, {
			useUnifiedTopology: true,
			useNewUrlParser: true
		});
		process.stdout.moveCursor(0, -1);
		process.stdout.clearLine(1);
		this.success("Database... connected");
		return db;
	}

	async loadExtra() {
		Object.keys(Methods).forEach(key => (this[key] = Methods[key]));
		return true;
	}

	async login(token = this.config.token || process.env.TOKEN) {
		await this.loadExtra();
		this.db = (await this.initDatabase()).db(process.env.DB);


		await loadCommands(this);
		await loadEvents(this);
		this.info(`Loading modules (${this.moduleCount})`);
		this.info(`Loaded ! commands (${this.commands.size})`);
		this.info(`Loaded / commands (${this.scommands.size})`);
		this.info(`Loaded events (${this.events.size})`);

		super.login(token).catch(this.error);

		return token as string;
	}
}

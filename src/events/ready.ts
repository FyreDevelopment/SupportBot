module.exports = {
	name: "ready",
	type: "client",
	run: async client => {
		client.success(`Connected as ${client.user.tag}`);
		client.user.setActivity("you.", {
			type: 2
		});
	}
};

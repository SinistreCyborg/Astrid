import Eris from 'eris';
import { readdirSync } from 'fs';
import { Console, fetch as $, APIs } from '..';

export default class extends Eris.Client {

    constructor() {
        super(process.env.TOKEN);

        /**
         * @type {Map<string, Command>}
         */
        this.commands = new Map();
        readdirSync('./commands/').forEach(async (file) => {
            if (!file.endsWith('.js')) return;

            const { default: Command } = await import(`../commands/${file}`);
            const cmd = new Command(this);

            Console.log('CommandLoader', `Loading ${cmd.name} command.`);
            this.commands.set(cmd.name, cmd);

        });

        this.once("ready", this.onReady.bind(this));
        this.on("messageCreate", this.onMessageCreate.bind(this));

    }

    get aliases() {
        return [...this.commands.values()].reduce((a, c) => {
            for (const alias of c.aliases) a.set(alias, c);
            return a;
        }, new Map());
    }

    onReady() {
        Console.success(this.user.username, `Logged in successfully, serving ${this.guilds.size} guilds.`);

        if (this.user.id === '571097569644773455') {
            setInterval(() => {
                $(`https://discordbots.org/api/bots/${this.user.id}/stats`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': process.env.DBL,
                    },
                    body: JSON.stringify({ server_count: this.guilds.size }),
                }).then(() => Console.log('DiscordBotList', 'Updated server count!'));
            }, 30 * 60 * 1000);
        }

    }

    async onMessageCreate(message) {

        if (
            message.author.bot
            || [process.env.PREFIX, `<@${this.user.id}>`].every(i => !message.content.startsWith(i))
        ) return;

        const flags = message.content.split(" ")
            .filter(str => str.startsWith("--"))
            .map(str => str.slice(2));
        
        message.flags = {};
        for (const flag of flags) {
            const parts = flag.split("=");
            message.flags[parts[0]] = parts.pop();
        }

        message.content = message.content.split(" ").filter(str => !str.startsWith("--")).join(" ");
        const params = message.content.startsWith(`<@${this.user.id}>`)
            ? message.content.split(" ").slice(1)
            : message.content.slice(process.env.PREFIX.length).split(" ");

        const command = this.resolveCommand(params[0]);
        if (!command) return;

        if (command.guildOnly && message.channel instanceof PrivateChannel) {
            await message.channel.createMessage(`🚫 \`${command.name}\` must be run in a server.`);
        }

        if (command.ownerOnly && message.author.id !== process.env.OWNER) {
            await message.channel.createMessage(`🚫 \`${command.name}\` is restricted to the owner.`);
        }

        try {
            await command.exec(message, ...params.slice(1));
        } catch (err) {
            message.channel.createMessage(`🚫 ${err || err.message}`);
        }

    }

    resolveCommand(name) {
        return this.commands.get(name) || this.aliases.get(name);
    }

    async hasVoted(id) {

        const { voted } = await $(APIs.DBL(this.user.id, id), {
            headers: { 'Authorization': process.env.DBL }
        }).then(res => res.json());

        return Boolean(voted);

    }

}

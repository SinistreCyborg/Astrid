import Eris from 'eris';
import { readdirSync } from 'fs';
import { Console } from '..';

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

    onReady() {
        Console.success(this.user.username, `Logged in successfully, serving ${this.guilds.size} guilds.`);
    }

    onMessageCreate(message) {

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

        const command = this.client.resolveCommand(params[0]);
        if (!command) return;

        if (command.guildOnly && message.channel instanceof PrivateChannel) {
            return this.err(message, `\`${command.name}\` must be run in a server.`);
        }

        if (command.ownerOnly && message.author.id !== process.env.OWNER) {
            return this.err(message, `\`${command.name}\` is restricted to the owner.`);
        }

        try {
            command.exec(message, ...params.slice(1));
        } catch (err) {
            this.err(message, err || err.message);
        }

    }

    static async err(message, text) {
        await message.channel.createMessage(`\\🚫 ${text}`);
    }

    resolveCommand(name) {
        return this.commands.get(name) || this.aliases.get(name);
    }

}

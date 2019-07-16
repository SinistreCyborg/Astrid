import Eris from 'eris';
import { readdirSync } from 'fs';
import { Console } from '..';

export default class extends Eris.Client {

    constructor() {
        super(process.env.token);

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

    }

}

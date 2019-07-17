import { exec } from 'child_process';
import util from 'util';
import { Command, Util } from '..';

export default class extends Command {

    constructor(client) {
        super(client, {
            name: 'exec',
            description: 'Execute commands in the terminal.',
            category: '🛠 Utility',
            usage: '<command>',
            ownerOnly: true,
        });
    }

    async exec(message, ...code) {

        const timeout = 'timeout' in message.flags ? Number(message.flags.timeout) : 60000;
        const result = await util.promisify(exec)(code.join(' '), { timeout });

        const output = result.stdout ? `**\`OUTPUT\`**${Util.codeBlock('', result.stdout)}` : '';
        const outerr = result.stderr ? `**\`ERROR\`**${Util.codeBlock('', result.stderr)}` : '';

        return message.channel.createMessage([output, outerr].join('\n') || 'Done. There was no output to stdout or stderr.');

    }

}

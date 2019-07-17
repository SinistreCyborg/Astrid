import { Command, Util } from '..';

export default class extends Command {

    constructor(client) {
        super(client, {
            name: 'json',
            description: 'Send JSON without codeblocks to have it beautified.',
            category: '💻 Developer',
            usage: '<search term>',
        });
    }

    async exec(message, ...content) {

        try {

            const res = JSON.stringify(JSON.parse(content.join(' ')), null, 2);
            if (res.length > 2000) return message.channel.createMessage('Output was too long. Here\'s a file instead.', { file: Buffer.from(res), name: 'result.json' });
            return message.channel.createMessage(Util.codeBlock('json', res));

        } catch (err) {
            throw 'Your JSON wasn\'t valid!';
        }

    }

}

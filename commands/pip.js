import { stripIndents } from 'common-tags';
import {
    Command, fetch as $, APIs, Util,
} from '..';

export default class extends Command {

    constructor(client) {
        super(client, {
            name: 'pip',
            description: 'Search for a Python package.',
            category: '📦 Package',
            aliases: ['py', 'pypi'],
            usage: '<package name>',
        });
    }

    async exec(message, term) {
        if (!term) throw 'You must specify a search term...';

        const pkg = await $(APIs.PIP(term))
            .then(res => res.json())
            .then(body => body.info)
            .catch(() => {});

        if (!pkg || typeof pkg === 'string') throw 'Couldn\'t find any relevant results!';
        return message.channel.createMessage({
            embed: {
                color: 0x3073b1,
                author: {
                    name: 'Python Package Index',
                    icon_url: 'https://i.imgur.com/J4YeZUc.png',
                    url: 'https://pypi.org',
                },
                description: stripIndents`
                    [__**${pkg.name}**__](${pkg.home_page}) v${pkg.version}
                    ${pkg.summary}
                `,
                fields: [{
                    name: 'Install',
                    value: Util.codeBlock('', `pip install ${pkg.name}`),
                }],
            },
        });

    }

}

import {
    Command, fetch as $, APIs, Util,
} from '..';

export default class extends Command {

    constructor(client) {
        super(client, {
            name: 'godoc',
            description: 'Search for a Go package.',
            category: '📦 Package',
            aliases: ['go', 'golang'],
            usage: '<package name>',
        });
    }

    async exec(message, term) {
        if (!term) throw 'You must specify a search term...';

        const pkg = await $(APIs.GO(term))
            .then(res => res.json())
            .then(body => (body.results === null ? undefined : body.results[0]));

        if (!pkg) throw 'Couldn\'t find any relevant results!';
        return message.channel.createMessage({
            embed: {
                color: 0x85D5E3,
                author: {
                    name: 'GoDoc',
                    icon_url: 'https://i.imgur.com/Otya2Te.png',
                    url: 'https://godoc.org',
                },
                description: `[__**${pkg.name}**__](https://godoc.org/${pkg.path})\n${pkg.synopsis}`,
                fields: [{ name: 'Install', value: Util.codeBlock('', pkg.path) }],
            },
        });

    }

}

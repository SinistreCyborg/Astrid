import {
    Command, fetch as $, APIs, Util,
} from '..';

export default class extends Command {

    constructor(client) {
        super(client, {
            name: 'yarn',
            description: 'Search for a yarn package.',
            category: '📦 Package',
            aliases: ['npm', 'node'],
            usage: '<package name>',
        });
    }

    async exec(message, term) {
        if (!term) throw 'You must specify a search term...';

        const pkg = await $(APIs.YARN(term))
            .then(res => res.json())
            .then(body => body.results[0].package)
            .catch(() => {});

        if (!pkg) throw 'Couldn\'t find any relevant results!';
        return message.channel.createMessage({
            embed: {
                color: 0x4387B2,
                author: {
                    name: 'Node.js Package',
                    icon_url: 'https://i.imgur.com/NiOCPiG.png',
                    url: 'https://yarnpkg.com/en/packages',
                },
                description: `[__**${pkg.name}**__](https://yarnpkg.com/en/package/${pkg.name}) (${pkg.version})\n${pkg.description}`,
                fields: [{
                    name: 'Install',
                    value: Util.codeBlock('', `yarn add ${pkg.name}`),
                }],
            },
        });

    }

}

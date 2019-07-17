import { stripIndents } from 'common-tags';
import {
    Command, fetch as $, APIs, Util,
} from '..';

export default class extends Command {

    constructor(client) {
        super(client, {
            name: 'elixir',
            description: 'Search for an Elixir/Erlang package.',
            category: '📦 Package',
            aliases: ['ex', 'erl', 'erlang'],
            usage: '<package name>',
        });
    }

    async exec(message, term) {
        if (!term) throw 'You must specify a search term...';

        const pkg = await $(APIs.ELIXIR(term))
            .then(res => res.json())
            .then(body => body[0])
            .catch(() => {});

        if (!pkg || typeof pkg === 'string') throw 'Couldn\'t find any relevant results!';
        return message.channel.createMessage({
            embed: {
                color: 0x320634,
                author: {
                    name: 'Hex.PM',
                    icon_url: 'https://i.imgur.com/X1VsDfq.png',
                    url: 'https://hex.pm',
                },
                description: stripIndents`
                    [__**${pkg.name}**__](${pkg.meta.links.GitHub || pkg.html_url}) v${pkg.releases[0].version}
                    ${pkg.meta.description}
                `,
                fields: [{
                    name: 'Install',
                    value: Util.codeBlock('', `{:${pkg.name}, "~> ${pkg.releases[0].version}"}`),
                }],
            },
        });

    }

}

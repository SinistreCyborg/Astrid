import { stripIndents } from 'common-tags';
import {
    Command, fetch as $, APIs,
} from '..';

export default class extends Command {

    constructor(client) {
        super(client, {
            name: 'dart',
            description: 'Search for a Dart package.',
            category: '📦 Package',
            usage: '<package name>',
        });
    }

    async exec(message, term) {
        if (!term) throw 'You must specify a search term...';

        const pkg = await $(APIs.DART(term))
            .then(res => res.json())
            .then(body => body.latest)
            .catch(() => {});

        if (!pkg || typeof pkg === 'string') throw 'Couldn\'t find any relevant results!';
        return message.channel.createMessage({
            embed: {
                color: 0x69c3f9,
                author: {
                    name: 'Dart Package',
                    icon_url: 'https://i.imgur.com/s8kk7Yl.png',
                    url: 'https://pub.dev',
                },
                description: stripIndents`
                    [__**${pkg.pubspec.name}**__](${pkg.pubspec.homepage}) v${pkg.version}
                    ${pkg.pubspec.description}
                `,
            },
        });

    }

}

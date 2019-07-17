import { stripIndents } from 'common-tags';
import {
    Command, fetch as $, APIs, Util,
} from '..';

export default class extends Command {

    constructor(client) {
        super(client, {
            name: 'gem',
            description: 'Search for a Ruby gem.',
            category: '📦 Package',
            aliases: ['rb', 'ruby'],
            usage: '<package name>',
        });
    }

    async exec(message, term) {
        if (!term) throw 'You must specify a search term...';

        const pkg = await $(APIs.GEM(term))
            .then(res => res.json())
            .catch(() => {});

        if (!pkg || typeof pkg === 'string') throw 'Couldn\'t find any relevant results!';
        const embed = {
            color: 0xd76049,
            fields: [],
            author: {
                name: 'RubyGems',
                icon_url: 'https://i.imgur.com/Gk3RxUo.png',
                url: 'https://rubygems.org',
            },
            description: stripIndents`
                [__**${pkg.name}**__](${pkg.project_uri}) v${pkg.version}
                ${pkg.info}
            `,
        };

        if (pkg.dependencies.development.length && 'deps' in message.flags) {
            embed.fields.push({
                name: 'Dev Dependencies',
                value: pkg.dependencies.development.map(e => `[**${e.name}**](https://rubygems.org/gems/${e.name}) ${e.requirements}`).join('\n'),
                inline: true,
            });
        }

        if (pkg.dependencies.runtime.length && 'deps' in message.flags) {
            embed.fields.push({
                name: 'Runtime Dependencies',
                value: pkg.dependencies.runtime.map(e => `[**${e.name}**](https://rubygems.org/gems/${e.name}) ${e.requirements}`).join('\n'),
                inline: true,
            });
        }

        embed.fields.push({
            name: 'Install',
            value: Util.codeBlock('', `gem install ${pkg.name}`),
        });

        return message.channel.createMessage({ embed });

    }

}

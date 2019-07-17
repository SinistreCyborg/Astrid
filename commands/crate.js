import { stripIndents } from 'common-tags';
import {
    Command, fetch as $, APIs, Util,
} from '..';

export default class extends Command {

    constructor(client) {
        super(client, {
            name: 'crate',
            description: 'Search for a Rust crate.',
            category: '📦 Package',
            aliases: ['rs', 'rust'],
            usage: '<crate name>',
        });
    }

    async exec(message, term) {
        if (!term) throw 'You must specify a search term...';

        const crate = await $(APIs.CRATE(term))
            .then(res => res.json())
            .then(body => body.crate);

        if (!crate) throw 'Couldn\'t find any relevant results!';
        return message.channel.createMessage({
            embed: {
                color: 0xF5C86C,
                author: {
                    name: 'Crates.io',
                    icon_url: 'https://i.imgur.com/wLeOHjE.png',
                    url: 'https://crates.io',
                },
                description: stripIndents`
                    [__**${crate.id}**__](https://crates.io/crates/${crate.id})
                    ${crate.description.trim()}
                    [Repository](${crate.repository.slice(0, -4)}) • [Documentation](${crate.documentation})
                `,
                fields: [{
                    name: 'Install',
                    value: Util.codeBlock('toml', `${crate.id} = "${crate.max_version}"`),
                }],
            },
        });

    }

}

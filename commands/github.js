import {
    Command, fetch as $, APIs, Util,
} from '..';

export default class extends Command {

    constructor(client) {
        super(client, {
            name: 'github',
            description: 'Search for a GitHub repo. Ex: SinistreCyborg/Astrid',
            category: '💻 Developer',
            aliases: ['git', 'repo'],
            usage: '<repo>',
        });
    }

    async exec(message, term) {

        if (!term.includes('/')) throw 'You must specify an owner and a name. Example: `SinistreCyborg/Astrid`.';
        const repo = await $(APIs.GITHUB(term))
            .then(res => res.json());

        if (!repo) throw 'Couldn\'t find any relevant results!';
        const embed = {
            color: 0x88479B,
            author: {
                name: 'GitHub',
                icon_url: 'https://i.imgur.com/9BLxRrq.png',
                url: 'https://github.com',
            },
            description: `[__**${repo.full_name}**__](${repo.html_url})\n${repo.description || ''}`,
            fields: [{
                name: 'Forks',
                value: String(repo.forks),
                inline: true,
            }, {
                name: 'Download',
                value: Util.codeBlock('', repo.clone_url),
            }],
        };

        if (repo.language) {
            embed.fields.unshift({
                name: 'Language',
                value: repo.language,
                inline: true,
            });
        }

        if (repo.license) {
            embed.fields.unshift({
                name: 'License',
                value: `[${repo.license.name}](https://spdx.org/licenses/${repo.license.spdx_id}.html)`,
                inline: true,
            });
        }

        return message.channel.createMessage({ embed });

    }

}

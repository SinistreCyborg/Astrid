import {
    Command, fetch as $, APIs, Util,
} from '..';

export default class extends Command {

    constructor(client) {
        super(client, {
            name: 'brew',
            description: 'Search for Homebrew formulae.',
            category: '💻 Developer',
            usage: '<package name>',
        });
    }

    async exec(message, term) {
        if (!term) throw 'You must specify a search term...';

        const pkg = await $(APIs.BREW)
            .then(res => res.json())
            .then(body => body.find(form => form.full_name.startsWith(term) || form.name === term));

        if (!pkg) throw 'Couldn\'t find any relevant results!';
        return message.channel.createMessage({
            embed: {
                color: 0xF2D19C,
                author: {
                    name: 'Homebrew Formulae',
                    icon_url: 'https://i.imgur.com/XbZfXr3.png',
                    url: 'https://brew.sh',
                },
                description: `[__**${pkg.full_name}**__](${pkg.homepage})\n${pkg.desc}`,
                fields: [{
                    name: 'Install',
                    value: Util.codeBlock('', `brew install ${pkg.name}`),
                }],
            },
        });

    }

}

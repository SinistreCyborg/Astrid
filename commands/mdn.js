import { Command, fetch as $, APIs } from '..';

export default class extends Command {

    constructor(client) {
        super(client, {
            name: 'mdn',
            description: 'Search the Mozilla Developer Network.',
            category: '💻 Developer',
            usage: '<search term>',
        });
    }

    async exec(message, ...term) {

        if (!term.length) throw 'You must specify a search term...';
        const { title, url, excerpt } = await $(APIs.MDN(term.join(' ')))
            .then(res => res.json())
            .then(body => body.documents[0]);

        if (!title) throw 'Couldn\'t find any relevant results!';
        return message.channel.createMessage({
            embed: {
                color: 0x3481EA,
                author: {
                    name: 'Mozilla Developer Network',
                    icon_url: 'https://i.imgur.com/UAxfB25.png',
                    url: 'https://developer.mozilla.org/en-US/',
                },
                description: `[__**${title}**__](${url})\n${excerpt}...`
                    .replace(/<mark>/g, '')
                    .replace(/<\/mark>/g, ''),
            },
        });

    }

}

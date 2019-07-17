import { stripIndents } from 'common-tags';
import {
    Command, fetch as $, APIs, Util,
} from '..';

export default class extends Command {

    constructor(client) {
        super(client, {
            name: 'net',
            description: 'Search for a NuGet package.',
            category: '📦 Package',
            aliases: ['nuget'],
            usage: '<package name>',
        });
    }

    async exec(message, term) {
        if (!term) throw 'You must specify a search term...';

        const pkg = await $(APIs.NET(term))
            .then(res => res.json())
            .then(body => body.data[0])
            .catch(() => {});

        if (!pkg || typeof pkg === 'string') throw 'Couldn\'t find any relevant results!';
        pkg.name = pkg.group_name === pkg.jar_name ? pkg.jar_name : `${pkg.group_name}/${pkg.jar_name}`;

        return message.channel.createMessage({
            embed: {
                color: 0x1b487c,
                author: {
                    name: 'NuGet',
                    icon_url: 'https://i.imgur.com/4jK7jaw.png',
                    url: 'https://www.nuget.org',
                },
                description: stripIndents`
                    [__**${pkg.id}**__](${pkg.projectUrl}) v${pkg.version}
                    ${pkg.summary || pkg.description}
                `,
                fields: [{
                    name: 'Package Manager',
                    value: Util.codeBlock('', `Install-Package ${pkg.id} -Version ${pkg.version}`),
                }, {
                    name: '.NET CLI',
                    value: Util.codeBlock('', `dotnet add package ${pkg.id} --version ${pkg.version}`),
                }, {
                    name: 'PackageReference',
                    value: Util.codeBlock('xml', `<PackageReference Include="${pkg.id}" Version="${pkg.version}"/>`),
                }, {
                    name: 'Paket CLI',
                    value: Util.codeBlock('', `paket add ${pkg.id} --version ${pkg.version}`),
                }],
            },
        });

    }

}

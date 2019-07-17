import { stripIndents, stripIndent } from 'common-tags';
import {
    Command, fetch as $, APIs, Util,
} from '..';

export default class extends Command {

    constructor(client) {
        super(client, {
            name: 'clojure',
            description: 'Search for a Clojure library.',
            category: '📦 Package',
            aliases: ['clj'],
            usage: '<package name>',
        });
    }

    async exec(message, term) {
        if (!term) throw 'You must specify a search term...';

        const pkg = await $(APIs.CLOJURE(term))
            .then(res => res.json())
            .catch(() => {});

        if (!pkg || typeof pkg === 'string') throw 'Couldn\'t find any relevant results!';
        pkg.name = pkg.group_name === pkg.jar_name ? pkg.jar_name : `${pkg.group_name}/${pkg.jar_name}`;

        return message.channel.createMessage({
            embed: {
                color: 0x320634,
                author: {
                    name: 'Clojars',
                    icon_url: 'https://i.imgur.com/ydjEvBl.png',
                    url: 'https://clojars.org',
                },
                description: stripIndents`
                    [__**${pkg.name}**__](${pkg.homepage}) v${pkg.latest_version}
                    ${pkg.description}
                `,
                fields: [{
                    name: 'Leiningen/Boot',
                    value: Util.codeBlock('', `[${pkg.name} "${pkg.latest_version}"]`),
                }, {
                    name: 'Clojure CLI/deps.edn',
                    value: Util.codeBlock('', `${pkg.name} {:mvn/version "${pkg.latest_version}"}`),
                }, {
                    name: 'Gradle',
                    value: Util.codeBlock('', `compile ${pkg.name.replace('/', ':')}:${pkg.latest_version}`),
                }, {
                    name: 'Maven',
                    value: Util.codeBlock('xml', stripIndent`
                        <dependency>
                          <groupId>${pkg.group_name}</groupId>
                          <artifactId>${pkg.jar_name}</artifactId>
                          <version>${pkg.latest_version}</version>
                        </dependency>
                    `),
                }],
            },
        });

    }

}

import { stripIndents } from 'common-tags';
import { Command } from '..';

export default class extends Command {

    constructor(client) {
        super(client, {
            name: 'help',
            description: 'Get a list of my commands, or info about a specific command.',
            category: '🛠 Utility',
            usage: '[command]',
        });
    }

    async exec(message, potential) {

        if (potential) {

            const command = this.client.resolveCommand(potential);
            if (!command) throw 'I don\'t recognize that command. Sorry!';

            return message.channel.createMessage({
                embed: {
                    color: 0xC9B37A,
                    title: `@${this.client.user.username} ${command.name} ${command.usage} ${command.ownerOnly ? '⭐️' : ''}`.trim(),
                    description: command.description,
                },
            });

        }

        const embed = {
            color: 0xC9B37A,
            title: 'My Commands',
            fields: [],
            description: stripIndents`
                **Support Server**: https://discord.gg/JuN5PCt
                **Code Repository**: https://github.com/SinistreCyborg/Astrid
            `,
        };

        this.categories.forEach((category) => {
            embed.fields = [...embed.fields, {
                name: category,
                value: `\`${this.cmdByCategory(category).join('`, `')}\``,
            }];
        });

        return message.channel.createMessage({ embed });

    }

    get categories() {
        const mapped = [...this.client.commands.values()].map(cmd => cmd.category);
        return [...new Set(mapped)];
    }

    cmdByCategory(category) {
        return [...this.client.commands.values()]
            .filter(cmd => cmd.category === category)
            .map(cmd => cmd.name);
    }

}

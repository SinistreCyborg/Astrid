import { Command } from '..';

export default class extends Command {

    constructor(client) {
        super(client, {
            name: 'stats',
            description: 'Check some statistics about me.',
            category: '🛠 Utility',
        });
    }

    async exec(message) {

        return message.channel.createMessage({
            embed: {
                color: 0xC9B37A,
                fields: [{
                    name: 'Memory',
                    value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
                    inline: true,
                }, {
                    name: 'Uptime',
                    value: `${Math.floor(process.uptime())} secs`,
                    inline: true,
                }, {
                    name: 'Node.js',
                    value: process.version,
                    inline: true,
                }, {
                    name: 'Users',
                    value: String(this.client.users.size),
                    inline: true,
                }, {
                    name: 'Channels',
                    value: String([...this.client.guilds.values()]
                        .map(guild => guild.channels.size)
                        .reduce((a, c) => a + c, 0)),
                    inline: true,
                }, {
                    name: 'Servers',
                    value: String(this.client.guilds.size),
                    inline: true,
                }],
            },
        });

    }

}

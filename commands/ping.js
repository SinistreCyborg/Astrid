import { PrivateChannel } from 'eris';
import { Command } from '..';

export default class extends Command {

    constructor(client) {
        super(client, {
            name: 'ping',
            description: 'Check my connection to Discord.',
            category: '🛠 Utility',
        });
    }

    async exec(message) {

        const ping = await message.channel.createMessage('Pinging...');
        return ping.edit(`🏓 Pong! Round-trip took: ${ping.timestamp - message.timestamp}ms. Latency: ${this.getLatency(message)}ms.`);

    }

    getLatency(message) {
        if (message.channel instanceof PrivateChannel) {
            return [...this.client.shards.values()][0].latency;
        }
        return message.channel.guild.shard.latency;
    }

}

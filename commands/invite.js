import { Constants } from 'eris';
import { Command } from '..';

export default class extends Command {

    constructor(client) {
        super(client, {
            name: 'invite',
            description: 'Add me to your Discord server!',
            category: '🛠 Utility',
            requiredPerms: [
                'readMessages',
                'sendMessages',
                'embedLinks',
                'attachFiles',
                'readMessageHistory',
                'addReactions',
            ],
        });
    }

    exec(message) {

        const perms = this.permissions.reduce((x, y) => x + y);
        return message.channel.createMessage(`Add me to your server!\n<https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&permissions=${perms}&scope=bot>`);

    }

    get permissions() {
        return [...new Set(
            [...this.client.commands.values()].map(cmd => cmd.requiredPerms).flat(),
        )].map(perm => Constants.Permissions[perm]);
    }

}

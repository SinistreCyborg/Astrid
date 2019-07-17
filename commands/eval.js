import { inspect } from 'util';
import vm from 'vm';
import { stripIndents } from 'common-tags';
import {
    Command, Util, Stopwatch, Type, fetch as $, APIs,
} from '..';

const zws = String.fromCharCode(8203);
export default class extends Command {

    constructor(client) {
        super(client, {
            name: 'eval',
            description: 'Evaluate JavaScript code.',
            category: '💻 Developer',
            usage: '<code>',
        });
    }

    async exec(message, ...input) {

        if (
            this.client.user.id === '571097569644773455'
            && message.author.id !== process.env.OWNER
            && !(await this.client.hasVoted(message.author.id))
        ) {
            throw stripIndents`
                You must upvote me to use this command.
                https://discordbots.org/bot/${this.client.user.id}
            `;
        }

        if (!input.length) throw 'You didn\'t give me code to run...';
        const {
            success, result, time, type,
        } = await this.eval(message, input.join(' '));

        const footer = Util.codeBlock('ts', type);
        const output = `**${success ? 'Output' : 'err'}**:${Util.codeBlock('js', result)}\n**Type**:${footer}\n${time}`;

        if ('silent' in message.flags) return null;
        if (output.length < 2000) return message.channel.createMessage(output);

        const key = await $(APIs.HASTE, { method: 'POST', body: result })
            .then(res => res.json())
            .then(body => body.key);

        return message.channel.createMessage(stripIndents`
            The output was too long. Here's a Hastebin instead:
            https://hastebin.com/${key}
        `);

    }

    async eval(message, input) {

        let code = input
            .replace(/[“”]/g, '"')
            .replace(/[‘’]/g, "'");

        const stopwatch = new Stopwatch();
        let success;
        let syncTime;
        let asyncTime;
        let result;
        let type;
        let thenable = false;

        try {
            if ('async' in message.flags) code = `(async () => {\n${code}\n})();`;
            // eslint-disable-next-line no-eval
            result = message.author.id === process.env.OWNER ? eval(code) : this.safeEval(code);
            syncTime = stopwatch.toString();
            type = new Type(result);
            if (Util.isThenable(result)) {
                thenable = true;
                stopwatch.restart();
                result = await result;
                asyncTime = stopwatch.toString();
            }
            success = true;
        } catch (err) {
            if (!syncTime) syncTime = stopwatch.toString();
            if (!type) type = new Type(err);
            if (thenable && !asyncTime) asyncTime = stopwatch.toString();
            result = err;
            success = false;
        }

        stopwatch.stop();
        if (typeof result !== 'string') {
            result = inspect(result, {
                depth: 'depth' in message.flags ? parseInt(message.flags.depth, 10) || 0 : 0,
                showHidden: 'showHidden' in message.flags,
            });
        }

        return {
            success,
            type,
            time: this.formatTime(syncTime, asyncTime),
            result: result.replace(/`/g, `\`${zws}`).replace(/@/g, `@${zws}`),
        };

    }

    safeEval(input) {

        const sandbox = {};
        const resultKey = `SAFE_EVAL_${Math.floor(Math.random() * 1000000)}`;
        const clearContext = `(function() {
            Function = undefined;
            const keys = Object.getOwnPropertyNames(this).concat(["constructor"]);
            keys.forEach((key) => {
                const item = this[key];
                if (!item || typeof item.constructor !== "function") return;
                this[key].constructor = undefined;
            });
        })();`;

        sandbox[resultKey] = {};
        const code = [clearContext, resultKey, '=', input].join('');

        vm.runInNewContext(code, sandbox);
        return sandbox[resultKey];

    }

    formatTime(syncTime, asyncTime) {
        return asyncTime ? `⏱ ${asyncTime}<${syncTime}>` : `⏱ ${syncTime}`;
    }

}

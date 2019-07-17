export default class {

    isFunction(input) {
        return typeof input === 'function';
    }

    static codeBlock(lang, code) {
        return `\`\`\`${lang}\n${code}\`\`\``;
    }

    static isThenable(input) {
        if (!input) return false;
        return (input instanceof Promise) || (
            input !== Promise.prototype
            && this.isFunction(input.then)
            && this.isFunction(input.catch)
        );
    }

}

function isFunction(input) {
    return typeof input === 'function';
}

export default class {

    static codeBlock(lang, code) {
        return `\`\`\`${lang}\n${code}\`\`\``;
    }

    static isThenable(input) {
        if (!input) return false;
        return (input instanceof Promise) || (
            input !== Promise.prototype
            && isFunction(input.then)
            && isFunction(input.catch)
        );
    }

}

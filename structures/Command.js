export default class {

    /**
     * @param {Astrid} client
     * @param {object} options
     * @param {string} options.name
     * @param {string} options.description
     * @param {string} options.category
     * @param {string[]} [options.aliases=[]]
     * @param {boolean} [options.guildOnly=false]
     * @param {boolean} [options.ownerOnly=false]
     * @param {string[]} [options.requiredPerms=[]]
     */
    constructor(client, {
        name, description, category,
        aliases = [],
        guildOnly = false,
        ownerOnly = false,
        requiredPerms = [],
    }) {
        Object.assign(this, {
            client,
            name,
            description,
            category,
            aliases,
            guildOnly,
            ownerOnly,
            requiredPerms,
        });
    }

}

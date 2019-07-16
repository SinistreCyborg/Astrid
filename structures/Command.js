export default class {

    /**
     * @param {Astrid} client
     * @param {object} options
     * @param {string} options.name
     * @param {string} options.description
     * @param {string} options.category
     * @param {boolean} [options.guildOnly=false]
     * @param {boolean} [options.ownerOnly=false]
     * @param {string[]} [options.requiredPerms=[]]
     */
    constructor(client, {
        name, description, category,
        guildOnly = false,
        ownerOnly = false,
        requiredPerms = [],
    }) {
        Object.assign(this, {
            client,
            name,
            description,
            category,
            guildOnly,
            ownerOnly,
            requiredPerms,
        });
    }

}

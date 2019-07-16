import Eris from 'eris';

export default class extends Eris.Client {

    constructor() {
        super(process.env.token);
    }

}

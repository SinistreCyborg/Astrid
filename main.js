import Astrid from './structures/Astrid';

/* eslint-disable import/prefer-default-export */
export { default as Command } from './structures/Command';
export { default as Event } from './structures/Event';

new Astrid().connect();

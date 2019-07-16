/* eslint-disable */
import Astrid from './structures/Astrid';

export { default as Command } from './structures/Command';
export { default as Event } from './structures/Event';
export { default as Console } from './structures/Console';
export { default as Util } from './structures/Util';
export * from './structures/Constants';

export { default as fetch } from 'node-fetch';

new Astrid().connect();

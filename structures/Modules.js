/* eslint-disable no-underscore-dangle */
import { performance } from 'perf_hooks';

export class Stopwatch {

    constructor(digits = 2) {
        this.digits = digits;
        this._start = performance.now();
        this._end = null;
    }

    get duration() {
        return this._end ? this._end - this._start : performance.now() - this._start;
    }

    get running() {
        return Boolean(!this._end);
    }

    restart() {
        this._start = performance.now();
        this._end = null;
        return this;
    }

    reset() {
        this._start = performance.now();
        this._end = this._start;
        return this;
    }

    start() {
        if (!this.running) {
            this._start = performance.now() - this.duration;
            this._end = null;
        }
        return this;
    }

    stop() {
        if (this.running) this._end = performance.now();
        return this;
    }

    toString() {
        const time = this.duration;
        if (time >= 1000) return `${(time / 1000).toFixed(this.digits)}s`;
        return time >= 1 ? `${time.toFixed(this.digits)}ms` : `${(time * 1000).toFixed(this.digits)}μs`;
    }

}

const { getPromiseDetails } = process.binding('util');
export class Type {

    constructor(value, parent = null) {
        this.value = value;
        this.is = this.constructor.resolve(value);
        this.parent = parent;
        this.childKeys = new Map();
        this.childValues = new Map();
    }

    get childTypes() {
        if (!this.childValues.size) return '';
        return `<${(this.childKeys.size ? `${this.constructor.list(this.childKeys)}, ` : '') + this.constructor.list(this.childValues)}>`;
    }

    toString() {
        this.check();
        return this.is + this.childTypes;
    }

    addValue(value) {
        const child = new this.constructor(value, this);
        this.childValues.set(child.is, child);
    }

    addEntry([key, value]) {
        const child = new this.constructor(key, this);
        this.childKeys.set(child.is, child);
        this.addValue(value);
    }

    * parents() {
        let current = this;
        while (current = current.parent) yield current; // eslint-disable-line no-cond-assign
    }

    check() {

        if (Object.isFrozen(this)) return;
        const promise = getPromiseDetails(this.value);

        if (typeof this.value === 'object' && this.isCircular()) {
            this.is = `[Circular:${this.is}]`;
        } else if (promise && promise[0]) {
            this.addValue(promise[1]);
        } else if (this.value instanceof Map) {
            this.value.forEach(entry => this.addEntry(entry));
        } else if (Array.isArray(this.value) || this.value instanceof Set) {
            this.value.forEach(value => this.addValue(value));
        } else if (this.is === 'Object') {
            this.is = 'any';
        }

        Object.freeze(this);

    }

    isCircular() {

        // eslint-disable-next-line no-restricted-syntax
        for (const parent of this.parents()) if (parent.value === this.value) return true;
        return false;

    }

    static resolve(value) {
        const type = typeof value;
        switch (type) {
        // eslint-disable-next-line no-nested-ternary
        case 'object':
            if (value === null) return 'null';
            return value.constructor ? value.constructor.name : 'any';
        case 'function': return `${value.constructor.name}(${value.length}-arity)`;
        case 'undefined': return 'void';
        default: return type;
        }
    }

    static list(values) {
        return values.has('any') ? 'any' : [...values.values()].sort().join(' | ');
    }

}

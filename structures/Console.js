import chalk from 'chalk';

function date() {
    const time = new Date();
    return [time.getHours(), time.getMinutes(), time.getSeconds()].map(e => (e < 10 ? `0${e}` : e)).join(':');
}

export default class {

    static log(title, message) {
        return process.stdout.write(`(${chalk.gray(date())}) [${chalk.magenta(title)}]: ${chalk.cyan(message)}\n`);
    }

    static success(title, message) {
        return process.stdout.write(`(${chalk.gray(date())}) [${chalk.magenta(title)}]: ${chalk.green(message)}\n`);
    }

    static warn(title, message) {
        return process.stdout.write(`(${chalk.gray(date())}) [${chalk.magenta(title)}]: ${chalk.yellow(message)}\n`);
    }

    static error(title, message) {
        return process.stdout.write(`(${chalk.gray(date())}) [${chalk.magenta(title)}]: ${chalk.red(message)}\n`);
    }

}

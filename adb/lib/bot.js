"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const log_1 = require("./log");
const util_1 = require("./util");
class Bot {
    constructor(commandPrefix, options) {
        if (!commandPrefix) {
            throw new Error('commandPrefix cannot be null');
        }
        this.commandPrefix = commandPrefix;
        this.client = new discord_js_1.Client(options);
        this.commands = {};
        this.log = log_1.createLogger(this.commandPrefix + 'bot');
        this.mThen = this.mSendThen.bind(this);
        this.mCatch = this.mSendCatch.bind(this);
        this.boostrapClient(this.client);
    }
    /**
     * Registers a command for the bot to react to.
     * @param command The command to register.
     * @returns {boolean} Whether or not the command was added. A command will
     * not be added if a command with the same name already exists.
     *
     * ---
     * ## Command
     * A `Command` is used to define a command that the bot should react to.
     *
     * ### Properties
     * #### `name: string`
     * This is the text that will trigger the command. It shouldn't have the
     * bot's command prefix added as this is done automatically.
     * #### `description?: string`
     * > Optional, defaults to `'No description'`.
     *
     * Provides a description of the command when displayed in the help message.
     *
     * #### `handler: (message: Message, ...args: any[]) => Promise<any>`
     * This is the function that will be called when the command is given to the bot.
     * It will always be passed the `message` that triggered the command as the first argument,
     * then an array of any words provided after the command (arguments).
     *
     * __The handler function should always return a Promise that resolves when the command
     * has been fully processed, or is rejected if an error occurs.__
     *
     * #### `restrictTo?: string[]`
     * > Optional, defaults to `[]`.
     * This is an array of role ids that can be used to restrict who can use the command. Only
     * users with at least one of the roles in the array may use the command. If it is not provided, or empty,
     * then anyone can use the command.
     */
    registerCommand(command) {
        if (this.commands.hasOwnProperty(command.name)) {
            return false;
        }
        if (!command.name) {
            throw new Error('name cannot be null');
        }
        if (!command.description) {
            command.description = 'No description';
        }
        if (!command.handler) {
            command.handler = () => {
                throw new Error(`Command: '${command.name}' has no handler.`);
            };
        }
        if (!command.restrictTo) {
            command.restrictTo = [];
        }
        this.commands[command.name] = command;
        return true;
    }
    mSendThen(value) {
        util_1.safely(() => {
            let send;
            if (Array.isArray(value)) {
                send = 'multiple messages';
            }
            else if (value) {
                send = value.content;
            }
            this.log(`Sent: ${send}`, log_1.LogLevel.Info);
        });
    }
    mSendCatch(error) {
        util_1.safely(() => {
            this.log('An error occurred while sending a message.');
            this.log(error, log_1.LogLevel.Error);
        });
    }
    boostrapClient(client) {
        this.log('Bootstrapping client', log_1.LogLevel.Info);
        this.registerCommand({
            name: 'help',
            description: 'Lists all available commands',
            handler: this.sendHelpMessage,
        });
        client.once('ready', () => this.log('Ready!', log_1.LogLevel.Success));
        client.on('error', (error) => {
            this.log('An error occurred', log_1.LogLevel.Warning);
            this.log(error, log_1.LogLevel.Error);
        });
        client.on('message', (message) => {
            if (message.content.startsWith(this.commandPrefix)) {
                const args = message.content.split(' ');
                args[0] = args[0].substring(this.commandPrefix.length);
                if (this.commands.hasOwnProperty(args[0])) {
                    const cmd = this.commands[args[0]];
                    if (!this.hasPermission(message.member, cmd.restrictTo)) {
                        message.reply(`you do not have permission to use this command.`).then(this.mThen, this.mCatch);
                        return;
                    }
                    try {
                        cmd.handler.call(this, message, args.slice(1)).then(() => {
                            this.log(`Processed '${cmd.name}' from '${message.member.displayName}'`);
                        }, (err) => {
                            throw err;
                        });
                    }
                    catch (error) {
                        this.log(`An error occurred while executing command: '${cmd.name}'`);
                        this.log(error, log_1.LogLevel.Error);
                        message.reply('Something went wrong processing this command.').then(this.mThen, this.mCatch);
                    }
                }
                else {
                    message.reply(`${args[0]} is not a valid command. Try ${this.commandPrefix}help`).then(this.mThen, this.mCatch);
                }
            }
        });
    }
    hasPermission(member, roleIds) {
        if (roleIds.length === 0) {
            return true;
        }
        return roleIds.some((role) => member.roles.has(role));
    }
    sendHelpMessage(message) {
        return new Promise((resolve, reject) => {
            let reply = '```asciidoc\n= Commands =\n';
            const longest = Object.keys(this.commands)
                .map((c) => c.length)
                .reduce((prev, current) => {
                if (current > prev) {
                    return current;
                }
                return prev;
            }, 0) + this.commandPrefix.length;
            for (const cmd in this.commands) {
                if (this.commands.hasOwnProperty(cmd)) {
                    const c = this.commands[cmd];
                    reply += `${util_1.padString(this.commandPrefix + cmd, longest)} :: ${c.description}`;
                    if (c.restrictTo.length > 0) {
                        if (!this.hasPermission(message.member, c.restrictTo)) {
                            reply += ' `you cannot use this command\'';
                        }
                    }
                    reply += '\n';
                }
            }
            reply += '```';
            message.channel.send(reply).then(resolve, reject);
        });
    }
}
exports.Bot = Bot;
//# sourceMappingURL=bot.js.map
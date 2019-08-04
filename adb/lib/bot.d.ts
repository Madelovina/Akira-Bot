import { Client, ClientOptions, Message } from 'discord.js';
export interface Command {
    name: string;
    description?: string;
    handler: (message: Message, ...args: any[]) => Promise<any>;
    restrictTo?: string[];
}
export declare class Bot {
    client: Client;
    private commandPrefix;
    private mThen;
    private mCatch;
    private commands;
    private log;
    constructor(commandPrefix: string, options?: ClientOptions);
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
    registerCommand(command: Command): boolean;
    private mSendThen(value);
    private mSendCatch(error);
    private boostrapClient(client);
    private hasPermission(member, roleIds);
    private sendHelpMessage(message);
}

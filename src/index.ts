// SDK version
export const VERSION = "0.1.0-alpha.7";

// Data in game header
export interface GameHeader {
    // Unique id for the game
    id: string;
    // Version of the game
    version: string;
    // Displayed title
    title: string;
    // Displayed description
    description: string;
    // Small icon
    icon: string;
    preview: string;
    splashart: string;
    boot: string;
}

/**
 * Interface for a local server.
 */
export interface IServer
{    
    /**
     * Register a callback to be notified when the server is ready.
     * @param {Function} callback - Called when ready
     */
    ready(callback: () => void): void;

    /**
     * Stop the server.
     * @param {Function} callback - Called when closed
     */
    close(callback?: (err: any) => void): void;
}

/**
 * Interface for a local file server.
 */
export interface IFileServer extends IServer
{
    /**
     * Get an URL pointing to a resource of this file server.
     * @param {string} path - Path to the resource
     * @returns {string} http://host:port/path URL
     */
    href(path: string): string;

    /**
     * Fetch data at a given path.
     * @param {string} path - Path to get
     * @returns {Promise} Result
     */
    get(path: string): Promise<string>;
}

/**
 * Interface for the game server.
 */
export interface IGameServer extends IFileServer
{
    /**
     * Fetch and load the game header.
     * @returns Result
     */
    gameHeader(): Promise<GameHeader>;
}

/**
 * Interface for your game.
 */
export interface IGame
{
    /**
     * Get a short help message describing the game, how it works, and
     * what inputs/outputs are expected.
     */
    help(): string;

    /**
     * Start execution of the game.
     */
    play(): void;

    /**
     * Pause execution of the game.
     */
    pause(): void;

    /**
     * Stop execution of the game.
     */
    stop(): void;

    /**
     * This function is called on each frame.
     * 
     * This is the function you must bind your AI to.
     * @param {IGame} game - This game instance.
     */
    frame(game: IGame): void;

    /**
     * Read output data from current frame of the game.
     * 
     * This allows your AI to analyze the current frame.
     * @param {string} [key] - Name of output to read.
     * @param {any} [val=undefined] - Default returned value if output is undefined.
     * @return {any} Output value for the current frame.
     */
    output(key: string, val?: any): any;

    /**
     * Write input data to current frame of the game.
     * 
     * This allows your AI to decide what to do for the next frame.
     * @param {string} [key] - Name of input to write.
     * @param {any} [val] - New value for this input.
     */
    input(key: string, val: any): void;
}

/**
 * Player embedding the game on desktop or web.
 */
export interface IPlayer {
    // root HTML element attributed to game
    root: HTMLElement,
    // Server for game files
    gameServer: IGameServer,
    // Called when the game is loaded and ready
    onReady?: () => void,
    // Notify the game is loaded and ready
    ready: () => void,
    /**
     * Send game state to all or a single controller.
     * @param {any} state - Game state
     * @param {number} controllerId - Controller id
     */
    sendState: (state: any, controllerId?: number) => void
    /**
     * Receive input from all or a single controller.
     * @param {number} controllerId - Controller id
     * @returns {any} Input state
     */
    input: (controllerId?: number) => {[controllerId: number]: any} | any
}

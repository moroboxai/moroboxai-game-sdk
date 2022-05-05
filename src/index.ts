// SDK version
export const VERSION = "0.1.0-alpha.10";

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
 * Interface for player or AI controllers.
 */
export interface IController
{
    // Unique controller id
    id: number;

    // If there is a player or AI bound to this controller
    isBound: boolean;

    // Label to display
    label: string;

    /**
     * Send the game state to this controller.
     * @param {any} state - Game state
     */
    sendState(state: any): void

    /**
     * Get controller inputs.
     * @returns {any} Inputs
     */
    inputs(): any;
}

/**
 * Interface for your game.
 */
export interface IGame
{
    // Current game speed multiplier
    speed: number;

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
     * Called when the player has been resized.
     */
    resize(): void;
}

/**
 * Player embedding the game on desktop or web.
 */
export interface IPlayer {
    // Root HTML element attributed to the game
    root: HTMLElement;

    // Server for accessing game files
    gameServer: IGameServer;

    // Get or set the player's width
    width: number;

    // Get or set the player's height
    height: number;

    /**
     * Allow the game to resize the player to desired size.
     * @param {number} width - New width
     * @param {number} height - New height
     */
    resize(width: number, height: number): void;

    /**
     * Must be called by the game when it is loaded and ready.
     */
    ready(): void;

    /**
     * Send the game state to all or a single controller.
     * @param {any} state - Game state
     * @param {number} controllerId - Controller id
     */
    sendState(state: any, controllerId?: number): void

    /**
     * Get a controller by id.
     * @param {number} controllerId - Controller id
     * @returns {IController} Associated controller
     */
    controller(controllerId: number): IController | undefined;
}

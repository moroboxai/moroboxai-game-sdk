// SDK version
export const VERSION = "0.1.0-alpha.23";

// Data in game header
export interface GameHeader {
    // Unique id for the game
    id?: string;
    // Version of the game
    version?: string;
    // Displayed title
    title?: string;
    // Displayed description
    description?: string;
    // Small icon
    icon?: string;
    preview?: string;
    splashart?: string;
    boot?: string;
    // Size of the game
    width?: number;
    height?: number;
}

/**
 * Interface for a local server.
 */
export interface IServer {
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
export interface IFileServer extends IServer {
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
export interface IGameServer extends IFileServer {
    /**
     * Fetch and load the game header.
     * @returns Result
     */
    gameHeader(): Promise<GameHeader>;
}

/**
 * Interface for the possible inputs in games.
 */
export interface IInputs {
    left?: boolean;
    right?: boolean;
    up?: boolean;
    down?: boolean;
}

/**
 * Interface for player or AI controllers.
 */
export interface IController {
    // Unique controller id
    id: number;

    // If there is a player or AI bound to this controller
    isBound: boolean;

    // Label to display
    label: string;

    /**
     * Load an agent to this controller.
     * @param {string} code - code of the agent
     */
    loadAgent(options: {
        // Type of code
        type?: string;
        // Load from code snippet
        code?: string;
        // Load from URL
        url?: string;
    }): Promise<void>;

    /**
     * Unload the agent from this controller.
     */
    unloadAgent(): void;
}

/**
 * Interface for your game.
 */
export interface IGame {
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

    /**
     * Save the state of the game.
     */
    saveState(): object;

    /**
     * Load the state of the game.
     */
    loadState(state: object): void;

    /**
     * Get the state of the game for the agent.
     * This state is used to predict the next input.
     */
    getStateForAgent(): object;

    /**
     * Hook to tick the player from the game.
     * Oftentimes, games will be written using libraries that already provide
     * a way to tick the game at a target FPS.
     * To avoid having two running loops, the player will set this variable,
     * and the game has the responsibility to call it at each tick.
     * @param {number} delta - elapsed time
     */
    ticker: (delta: number) => void;

    /**
     * Tick the game with inputs from the agents.
     * @param {IInputs} inputs - inputs from agents
     * @param {number} delta - elapsed time
     */
    tick(inputs: Array<IInputs>, delta: number): void;
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

    // If the player is resizable
    resizable: boolean;

    // Selected speed multiplier
    speed: number;

    // URL to game header
    url?: string;

    // Game header
    header?: GameHeader;

    /**
     * Allow the game to resize the player to desired size.
     * @param {any} options - New size
     */
    resize(options: { width?: number, height?: number }): void;

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
     * Get a controller.
     * @param {number} controllerId - id of the controller
     */
    getController(controllerId: number): IController | undefined;
}

/**
 * Signature of the boot function your game must export.
 */
export interface IBoot {
    (player: IPlayer): IGame;
}

// SDK version
export const VERSION = "__VERSION__";

// Data in game header
export interface GameHeader {
    // Unique id for the game
    id?: string;
    // Version of the game
    version?: string;
    // Release date
    date?: Date;
    // Displayed title
    title?: string;
    // Displayed description
    description?: string;
    /**
     * Width of the game in pixel.
     *
     * If only the width is specified, the height is computed
     * according to the aspect ratio.
     */
    width?: number;
    /**
     * Height of the game in pixel.
     *
     * If only the height is specified, the width is computed
     * according to the aspect ratio.
     */
    height?: number;
    /**
     * Aspect ratio of the game as w/h.
     *
     * This can't be specified if both width and height are set.
     */
    aspectRatio?: string;
    /**
     * Scale of the game.
     *
     * For a game with a native resolution of 128x128 pixels,
     * supposed to render at 256x256 pixels on the screen, the
     * native scale would be 128/256 = 0.5.
     *
     * This setting is used to keep a consistent scaling for
     * all games.
     */
    scale?: number;
    /**
     * File or function to boot the game.
     */
    boot?: BootLike;
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
export interface IGameServer extends IFileServer {}

/**
 * Interface for the possible inputs in games.
 */
export interface Inputs {
    left?: boolean;
    right?: boolean;
    up?: boolean;
    down?: boolean;
}

/**
 * State of a controller with inputs.
 */
export interface Controller {
    // Label to display
    readonly label: string;
    // If there is a player or agent bound to this controller
    readonly isBound: boolean;
    // If there is no agent bound to this controller
    readonly isPlayer: boolean;
    // If there is an agent bound to this controller
    readonly isAgent: boolean;
    // Inputs for the current frame
    readonly inputs: Inputs;
}

/**
 * Interface for your game.
 *
 * This is the functions your game must implement to be fully compatible
 * with MoroboxAI.
 *
 * Some packages such as piximoroxel8ai provide most of this implementation,
 * so that you can focus on writing the logic of your game.
 */
export interface IGame {
    /**
     * Return an help message about the game.
     *
     * This help message should describe what contains the state
     * passed to agents, so that users can know how to code one.
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
     * Resize the game.
     *
     * This function is called when the player is resized, and the game
     * needs to adapt itself to the new resolution.
     */
    resize(): void;

    /**
     * Save the state of the game.
     *
     * The state returned should be complete enough to come back to it
     * later with the loadState function below.
     */
    saveState(): object;

    /**
     * Load the state of the game.
     *
     * In case of the state being empty, the game must reset itself to
     * its initial state.
     */
    loadState(state: object): void;

    /**
     * Get the state of the game for the agent.
     *
     * Unlike saveState, the state returned here can be whatever may
     * be required for someone to write an agent for your game.
     *
     * It can be the position of the player, of the obstacles, or the
     * enemies, the current score, ...
     */
    getStateForAgent(): object;

    /**
     * Hook registered by the player.
     *
     * Oftentimes, games will be written using libraries that already provide
     * a way to tick the game at a target FPS.
     *
     * To avoid having two running loops, the player expect the game to
     * call this function on every tick.
     */
    ticker?: (delta: number) => void;

    /**
     * Tick the game.
     * @param {Controller} controllers - list of controllers
     * @param {number} delta - elapsed time
     * @param {boolean} render - if the game must render graphics
     */
    tick(controllers: Array<Controller>, delta: number, render: boolean): void;
}

/**
 * Interface of the VM embedding the game.
 *
 * This interface is known, and can be used by the game, to interact
 * with the VM.
 */
export interface IVM {
    // Root HTML element attributed to the game
    root: HTMLElement;

    // Server for accessing game files
    gameServer: IGameServer;

    // Get or set the player's width
    width: number;

    // Get or set the player's height
    height: number;

    // If the player is resizable
    readonly resizable: boolean;

    // Selected speed multiplier
    readonly speed: number;

    // Game header
    readonly header?: GameHeader;

    // Current frame
    readonly frame: number;

    // Current time
    readonly time: number;
}

/**
 * Options passed to the boot function.
 */
export interface BootOptions {
    vm: IVM;
}

/**
 * Signature of the boot function your game must export.
 */
export interface BootFunction {
    (options: BootOptions): Promise<IGame>;
}

/**
 * Interface for a class containing a boot function.
 */
export interface IBootable {
    boot: BootFunction;
}

/**
 * Something that looks like a boot function.
 */
export type BootLike = string | BootFunction | IBootable;

/**
 * Version of the SDK.
 */
export const VERSION: string = '0.1.0-alpha.6';

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
}

/**
 * Interface for your game.
 */
export abstract class AbstractGame
{
    /**
     * Get a short help message describing the game, how it works, and
     * what inputs/outputs are expected.
     */
    public help(): string
    {
        return '';
    }

    /**
     * Start execution of the game.
     */
    abstract play(): void;

    /**
     * Pause execution of the game.
     */
    abstract pause(): void;

    /**
     * Stop execution of the game.
     */
    abstract stop(): void;

    /**
     * This function is called on each frame.
     * 
     * This is the function you must bind your AI to.
     * @param {GameInstance} game - This game instance.
     */
    public frame(game: AbstractGame): void {
    }

    /**
     * Read output data from current frame of the game.
     * 
     * This allows your AI to analyze the current frame.
     * @param {string} [key] - Name of output to read.
     * @param {any} [val=undefined] - Default returned value if output is undefined.
     * @return {any} Output value for the current frame.
     */
    public output(key: string, val?: any): any
    {
        return undefined;
    }

    /**
     * Write input data to current frame of the game.
     * 
     * This allows your AI to decide what to do for the next frame.
     * @param {string} [key] - Name of input to write.
     * @param {any} [val] - New value for this input.
     */
    public input(key: string, val: any): void
    {}
}

/**
 * Interface for the game SDK itself.
 */
export interface IMoroboxAIGameSDK {
    // SDK version
    readonly version: string;

    // File server for game files
    readonly fileServer: IFileServer;

    /**
     * Register a callback to be notified when the SDK is ready.
     * @param {Function} callback Callback
     */
    ready(callback: () => void): void;
}

/**
 * Options passed to the game boot function.
 */
export interface BootOptions {
    // root HTML element attributed to game
    root: HTMLElement,
    // SDK instance
    sdk: IMoroboxAIGameSDK
}

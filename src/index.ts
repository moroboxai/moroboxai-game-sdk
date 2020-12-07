import * as fs from 'fs';
import * as http from 'http';
import * as net from 'net';

/**
 * Version of the SDK.
 */
export const VERSION: string = '0.1.0-alpha.5';

/**
 * Interface for a local file server.
 */
export interface IFileServer
{
    /**
     * Address this file server is listening to.
     * @returns {net.AddressInfo} Address
     */
    readonly address: net.AddressInfo;

    /**
     * Get an URL pointing to a resource of this file server.
     * @param {string} path - Path to the resource
     * @returns {string} http://host:port/path URL
     */
    href(path: string): string;

    /**
     * Register a callback to be notified when the file
     * server is ready.
     * @param {Function} callback - Callback
     */
    ready(callback: () => void): void;

    /**
     * Stop the server.
     */
    close(callback?: (err: any) => void): void;
}

/**
 * Implementation of the local file server.
 */
export class FileServer implements IFileServer
{
    private _server: http.Server;
    private _readyCallback?: () => void;
    private _isReady: boolean = false;

    public get address(): net.AddressInfo {
        return this._server.address() as net.AddressInfo;
    }

    constructor() {
        this._server = http.createServer((req, res) => this._route(req, res));
    }

    /**
     * Start server on a local port.
     * @param {number} port - Port
     */
    public listen(port: number = 0): void {
        this._server.listen(port, '127.0.0.1', () => {
            this._notifyReady();
        });
    }

    public href(path: string): string {
        return `http://${this.address.address}:${this.address.port}/${path}`;
    }

    private _route(req: http.IncomingMessage, res: http.ServerResponse): void {
        if (req.url === undefined) {
            res.writeHead(404);
            res.end();
            return;
        }

        res.end(fs.readFileSync(`./${req.url}`));
    }

    public ready(callback: () => void): void {
        this._readyCallback = callback;
        if (this._isReady) {
            callback();
        }
    }

    private _notifyReady(): void {
        this._isReady = true;
        if (this._readyCallback !== undefined) {
            this._readyCallback();
        }
    }

    public close(callback?: (err: any) => void): void {
        this._server.close(e => {
            this._isReady = false;

            if (callback !== undefined) {
                callback(e);
            }
        });
    }
}

/**
 * 
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

export interface IMoroboxAIGameSDK {
    // SDK version
    readonly version: string;

    // Local file server
    readonly fileServer: IFileServer;

    /**
     * Register a callback to be notified when the SDK is ready.
     * @param {Function} callback Callback
     */
    ready(callback: () => void): void;
}

export abstract class GameSDKBase implements IMoroboxAIGameSDK {
    private _readyCallback?: () => void;
    private _isReady: boolean = false;
    private _fileServer: IFileServer;

    public get version(): string {
        return VERSION;
    }

    public get fileServer(): IFileServer {
        return this._fileServer;
    }

    constructor(fileServer: IFileServer) {
        this._fileServer = fileServer;
        this._fileServer.ready(() => this._notifyReady());
    }

    public ready(callback: () => void): void {
        this._readyCallback = callback;
        if (this._isReady) {
            callback();
        }
    }

    private _notifyReady(): void {
        this._isReady = true;
        if (this._readyCallback !== undefined) {
            this._readyCallback();
        }
    }
}

/**
 * Standalone version of the SDK.
 *
 * This can be used in a standalone Electron application without
 * the need for running MoroboxAI.
 *
 * This setup a local HTTP server to serve static files requested
 * by the game.
 */
class StandaloneGameSDK extends GameSDKBase {
    constructor(options: GameSDKOptions) {
        super(options.fileServer);
    }
}

/**
 * Create a standalone instance of MoroboxAIGameSDK.
 *
 * This allows to build and test MoroboxAI games in a standalone
 * Electron application without the need of MoroboxAI.
 * @param {GameSDKOptions} options - SDK options
 * @returns {IMoroboxAIGameSDK} SDK instance.
 */
export function createStandalone(options: GameSDKOptions): IMoroboxAIGameSDK {
    return new StandaloneGameSDK(options);
}

export interface GameSDKOptions {
    // Local file server
    fileServer: IFileServer
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

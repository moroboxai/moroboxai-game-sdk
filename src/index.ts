import * as fs from 'fs';
import * as http from 'http';
import * as net from 'net';

/**
 * Version of the SDK.
 */
export const VERSION: string = '0.1.0-alpha.6';

/**
 * Simply a wrapper over net.Server for controlling the server.
 *
 * Because there are common tasks such as listening to a port,
 * being notified when ready, closing the server...
 */
export interface IServerWrapper
{
    // public address of the server
    readonly address: net.AddressInfo;

    /**
     * Register a callback to be notified when the AI
     * server is ready.
     * @param {Function} callback - Called when ready
     */
    ready(callback: () => void): void;

    /**
     * Stop the server.
     * @param {Function} callback - Called when closed
     */
    close(callback?: (err: any) => void): void;
}

class ServerWrapper implements IServerWrapper
{
    // server instance
    private _server: net.Server;
    // callback called when server is ready
    private _readyCallback?: () => void;
    // if the server is ready
    private _isReady: boolean = false;

    /**
     * Get the server instance.
     * @returns {net.Server} Server
     */
    protected get server(): net.Server {
        return this._server;
    }

    /**
     * Get the public address of the server.
     * @returns {net.AddressInfo} Address
     */
    public get address(): net.AddressInfo {
        return this._server.address() as net.AddressInfo;
    }

    constructor(server: net.Server) {
        this._server = server;
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
 * Interface for a local file server.
 */
export interface IFileServer extends IServerWrapper
{
    /**
     * Get an URL pointing to a resource of this file server.
     * @param {string} path - Path to the resource
     * @returns {string} http://host:port/path URL
     */
    href(path: string): string;
}

/**
 * Implementation of the local file server.
 */
export class FileServer extends ServerWrapper implements IFileServer
{
    /**
     * Default route for serving local files.
     * @param {http.IncomingMessage} req - Request 
     * @param {http.ServerResponse} res - Response
     */
    public static serveLocalFiles(req: http.IncomingMessage, res: http.ServerResponse): void {
        // invalid URL
        if (req.url === undefined) {
            res.writeHead(404);
            res.end();
            return;
        }

        // check if requested path is a file
        const path = `./${req.url}`;
        fs.stat(path, (e, stats) => {
            if (e || !stats.isFile()) {
                console.error(e);
                res.writeHead(404);
                res.end();
                return;
            }

            // read and return file content
            res.end(fs.readFileSync(path));
        });
    }

    /**
     * Create a local file server.
     * @param {Function} requestListener - Custom route for serving files
     */
    constructor(requestListener?: http.RequestListener | undefined) {
        super(http.createServer(
            requestListener !== undefined ? requestListener : FileServer.serveLocalFiles
        ));
    }

    public href(path: string): string {
        return `http://${this.address.address}:${this.address.port}/${path}`;
    }
}

/**
 * Interface for the local AI server.
 */
export interface IAIServer extends IServerWrapper
{}

/**
 * Implementation of the local AI server.
 */
export class AIServer extends ServerWrapper implements IAIServer
{
    constructor() {
        super(net.createServer(socket => this._handleConnection(socket)));
    }

    private _handleConnection(socket: net.Socket): void {
        console.log('connection');
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

    // Local AI server
    readonly aiServer: IAIServer;

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
    private _aiServer: IAIServer;

    public get version(): string {
        return VERSION;
    }

    public get fileServer(): IFileServer {
        return this._fileServer;
    }

    public get aiServer(): IAIServer {
        return this._aiServer;
    }

    constructor(options: GameSDKOptions) {
        this._fileServer = options.fileServer;
        this._aiServer = options.aiServer;
        // be ready when both servers are ready
        Promise.all([
            new Promise((resolve, _) => {
                this._fileServer.ready(resolve);
            }),
            new Promise((resolve, _) => {
                this._aiServer.ready(resolve);
            })
        ]).then(() => this._notifyReady());
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
        super(options);
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
    fileServer: IFileServer,
    // Local AI server
    aiServer: IAIServer
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

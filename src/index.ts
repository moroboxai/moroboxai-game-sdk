import * as fs from 'fs';
import * as http from 'http';
import * as net from 'net';

/**
 * Version of the SDK.
 */
export const VERSION: string = '0.1.0-alpha.4';

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
    readonly version: string;
    readonly address: net.AddressInfo;

    href(id: string): string;
    ready(callback: () => void): void;
}

export abstract class GameSDKBase implements IMoroboxAIGameSDK {
    private _readyCallback?: () => void;

    public get version(): string {
        return VERSION;
    }

    abstract readonly address: net.AddressInfo;

    public href(id: string): string {
        return `http://${this.address.address}:${this.address.port}/${id}`;
    }

    public ready(callback: () => void): void {
        this._readyCallback = callback;
    }

    protected notifyReady(): void {
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
    private _fileServer: http.Server;

    constructor() {
        super();
        this._fileServer = http.createServer((req, res) => this._route(req, res));
        this._fileServer.listen(0, '127.0.0.1', () => {
            this.notifyReady();
        });
    }

    public get address(): net.AddressInfo {
        return this._fileServer.address() as net.AddressInfo;
    }

    private _route(req: http.IncomingMessage, res: http.ServerResponse): void {
        if (req.url === undefined) {
            res.writeHead(404);
            res.end();
            return;
        }

        res.end(fs.readFileSync(`./${req.url}`));
    }
}

/**
 * Create a standalone instance of MoroboxAIGameSDK.
 *
 * This allows to build and test MoroboxAI games in a standalone
 * Electron application without the need of MoroboxAI.
 * @returns {IMoroboxAIGameSDK} SDK instance.
 */
export function createStandalone(): IMoroboxAIGameSDK {
    return new StandaloneGameSDK();
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

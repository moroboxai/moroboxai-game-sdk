/// <reference types="node" />
import * as net from 'net';
/**
 * Version of the SDK.
 */
export declare const VERSION: string;
/**
 *
 */
export declare abstract class AbstractGame {
    /**
     * Get a short help message describing the game, how it works, and
     * what inputs/outputs are expected.
     */
    abstract help(): string;
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
    frame(game: AbstractGame): void;
    /**
     * Read output data from current frame of the game.
     *
     * This allows your AI to analyze the current frame.
     * @param {string} [key] - Name of output to read.
     * @param {any} [val=undefined] - Default returned value if output is undefined.
     * @return {any} Output value for the current frame.
     */
    abstract output(key: string, val?: any): any;
    /**
     * Write input data to current frame of the game.
     *
     * This allows your AI to decide what to do for the next frame.
     * @param {string} [key] - Name of input to write.
     * @param {any} [val] - New value for this input.
     */
    abstract input(key: string, val: any): void;
}
export interface IMoroboxAIGameSDK {
    readonly version: string;
    readonly address: net.AddressInfo;
    href(id: string): string;
    ready(callback: () => void): void;
}
export declare abstract class GameSDKBase implements IMoroboxAIGameSDK {
    private _readyCallback?;
    get version(): string;
    abstract readonly address: net.AddressInfo;
    href(id: string): string;
    ready(callback: () => void): void;
    protected notifyReady(): void;
}
/**
 * Create a standalone instance of MoroboxAIGameSDK.
 *
 * This allows to build and test MoroboxAI games in a standalone
 * Electron application without the need of MoroboxAI.
 * @returns {IMoroboxAIGameSDK} SDK instance.
 */
export declare function createStandalone(): IMoroboxAIGameSDK;
/**
 * Options passed to the game boot function.
 */
export interface BootOptions {
    root: HTMLElement;
    sdk: IMoroboxAIGameSDK;
}

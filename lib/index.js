"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStandalone = exports.GameSDKBase = exports.AbstractGame = exports.VERSION = void 0;
const fs = require("fs");
const http = require("http");
/**
 * Version of the SDK.
 */
exports.VERSION = '0.1.0-alpha.1';
/**
 *
 */
class AbstractGame {
    /**
     * This function is called on each frame.
     *
     * This is the function you must bind your AI to.
     * @param {GameInstance} game - This game instance.
     */
    frame(game) {
    }
}
exports.AbstractGame = AbstractGame;
class GameSDKBase {
    get version() {
        return exports.VERSION;
    }
    href(id) {
        return `http://${this.address.address}:${this.address.port}/${id}`;
    }
    ready(callback) {
        this._readyCallback = callback;
    }
    notifyReady() {
        if (this._readyCallback !== undefined) {
            this._readyCallback();
        }
    }
}
exports.GameSDKBase = GameSDKBase;
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
    constructor() {
        super();
        this._fileServer = http.createServer((req, res) => this._route(req, res));
        this._fileServer.listen(0, '127.0.0.1', () => {
            this.notifyReady();
        });
    }
    get address() {
        return this._fileServer.address();
    }
    _route(req, res) {
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
function createStandalone() {
    return new StandaloneGameSDK();
}
exports.createStandalone = createStandalone;

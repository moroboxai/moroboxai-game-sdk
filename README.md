# moroboxai-game-sdk

[![NPM version](https://img.shields.io/npm/v/moroboxai-game-sdk.svg)](https://www.npmjs.com/package/moroboxai-game-sdk)
![Node.js CI](https://github.com/moroboxai/moroboxai-game-sdk/workflows/Node.js%20CI/badge.svg)
[![gitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/moroboxai/moroboxai-game-sdk/blob/master/LICENSE)

This package is for you if you want to build a game for [MoroboxAI](https://github.com/moroboxai/moroboxai) and allow others to code their own AI for it.

## Introduction

There are barely any requirements on how you should write your game logic, or what third party libraries you should use; but for your game to interface
correctly with MoroboxAI and AIs written by the community, you have to implement some basic callbacks and functions in your game.

This package is meant to provide a common interface for all MoroboxAI games so that they all provide essential features such as:

  * Showing instructions on how to code an AI for the game.
  * Playing, pausing, and stopping the game.
  * Displaying runtime informations to help coding an AI.
  * Read output data from the current frame.
  * Write input data for the next frame.

This ensure that your game will run correctly on MoroboxAI and that the community will be able to code new AIs for it.

## Install

Using npm:

```bash
npm install moroboxai-game-sdk --save-dev
```

Log installed SDK version to console:

```js
import * from MoroboxAIGameSDK from 'moroboxai-game-sdk';

console.log(`MoroboxAIGameSDK v${MoroboxAIGameSDK.VERSION}`);
```

## Minimal Node.js project

We will setup a simple Node.js project for writing a game that can be run in MoroboxAI.
As **moroboxai-game-sdk** is written using TypeScript, we will also configure the project
to be compiled with TypeScript.

```bash
cd my/game
npm init
```

Install **typescript** and **moroboxai-game-sdk**:

```bash
npm install typescript moroboxai-game-sdk --save-dev
```

_Note: moroboxai-game-sdk is only required in **development** so that typescript knows about
the types. At **runtime**, the SDK will be initialized and provided directly by MoroboxAI, so there
is no need to include it in your game._

Add the following configuration to **package.json**:

```json
"scripts": {
    "build": "tsc"
}
```

Create a **tsconfig.json** file containing:

```json
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es2019",
        "lib": [
            "es2019",
            "es2019.object",
            "dom"
        ],
        "outDir": "./",
        "strict": true
    },
    "files": ["src/game.ts"],
    "exclude": ["node_modules"]
}
```

This will tell TypeScript to compile only **src/game.ts** without unnecessary files from **node_modules**.
Also, your game will be compiled as a **CommonJS** module.

## Write your game

Add a new **src/game.ts** file to the project:

```js
import * as MoroboxAIGameSDK from 'moroboxai-game-sdk';

class Game implements MoroboxAIGameSDK.IGame {
    private _player: MoroboxAIGameSDK.IPlayer;
    
    constructor(player: MoroboxAIGameSDK.IPlayer) {
        this._player = player;

        // start the process of loading assets asynchronously
        setTimeout(() => {
            console.log("assets loaded");

            // notify the game is ready to play
            player.ready();
        }, 1000);
    }

    help(): string {
        return "";
    }

    play(): void {
        console.log("play");
    }

    pause(): void {

    }

    stop(): void {

    }

    resize(): void {

    }    
}

export function boot(player: MoroboxAIGameSDK.IPlayer): MoroboxAIGameSDK.IGame {
    return new Game(player);
}
```

**IPlayer** is a the interface your game must implement to be compatible
with MoroboxAI. The **boot** function is required and must be exported at the **end of the script**.
This will be the entrypoint used by MoroboxAI to boot your game.

## Build

```bash
npm run build
```

This will generate a **game.js** file containing your game exported as a **CommonJS** module:

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.boot = void 0;
class Game {
    constructor(player) {
        this._player = player;
        setTimeout(() => {
            console.log("assets loaded");
            // notify the game is loaded and ready
            player.ready();
        }, 1000);
    }
    help() {
        return "";
    }
    play() {
        console.log("play");
    }
    pause() {
    }
    stop() {
    }
    resize() {
    }
}
function boot(player) {
    return new Game(player);
}
exports.boot = boot;
```

You can see that **moroboxai-game-sdk** has been stripped out and that the **boot** function
is correctly exported at the end.

## Package & distribute

MoroboxAI require your game to be packaged in a **.zip** file along with an **header.json** file containing
some metadata about your game.

Create a **header.json** file next to **game.js**:

```js
{
    "id": "00000000-0000-0000-0000-000000000000",
    "version": "1.0.0",
    "title": "Game",
    "author": "yourname",
    "description": "Some description.",
    "boot": "game.js"
}
```

Create a **.zip** file with both **header.json** and **game.js** files.
You can now copy this **.zip** to MoroboxAI **games** directory.
When launching MoroboxAI, you should now see your game in the main menu:

![alt text](../media/readme_package_moroboxai.png?raw=true)

## Test

There are multiple ways of testing your game in MoroboxAI, but the simplest one is probably to start a local HTTP server to locally run MoroboxAI.

First install [moroboxai-player-web](https://github.com/moroboxai/moroboxai-player-web) and **http-server**:

```bash
npm install moroboxai-player-web http-server --save-dev
```

Then create an `index.html` file:

```html
<html>
 <div id="player"></div> 
  
 <script type="text/javascript" src="node_modules/moroboxai-player-web/lib/umd/moroboxai-player-web.js"></script>
 <script type="text/javascript">
  // Initialize the player on our div
  const player = MoroboxAIPlayer.init({
   element: document.getElementById("player"),
   url: "./",
   width: "256px",
   height: "256px"
  });

  // Will be called when the game is ready
  player.onReady = () => console.log("game is loaded and ready");
 </script>
</html>
```

Open a command prompt and run:

```bash
http-server
```

Now you can access the page on **localhost** and the port opened by **http-server**. You won't see anything as the game is not displaying anything, but you can check the game is correctly loaded in the console. 

## License

This content is released under the [MIT](http://opensource.org/licenses/MIT) License.

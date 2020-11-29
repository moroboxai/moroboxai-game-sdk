# moroboxai-game-sdk

![Node.js CI](https://github.com/moroboxai/moroboxai-game-sdk/workflows/Node.js%20CI/badge.svg)
[![codecov](https://codecov.io/gh/moroboxai/moroboxai-game-sdk/branch/master/graph/badge.svg?token=stc3zjWmdS)](https://codecov.io/gh/moroboxai/moroboxai-game-sdk)

This package is for you if you want to build a game for [MoroboxAI](https://github.com/moroboxai/moroboxai) and allow others to code their own AI for it.
Please take a look at [moroboxai-sdk](https://github.com/moroboxai/moroboxai-sdk) if your goal is to code an AI for an existing game.

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

## Boilerplate

Here is an example of the bare minimum required to write a game for MoroboxAI.

First, you have to create a new NodeJS project with **npm init**.
Answer all the questions, and you will now have a **package.json** file in **my/game** directory:

```bash
cd my/game
npm init
```

The next step is to install **typescript** and **moroboxai-game-sdk** using the following command.
Please not that moroboxai-game-sdk is only required in **development** so that typescript knows about
the types. At **runtime**, the SDK will be initialized and provided directly by MoroboxAI, so there
is no need to include it in our game:

```bash
npm install typescript moroboxai-game-sdk --save-dev
```

Open **package.json** and add the following configuration. Now, running **npm run build** will compile
your game to **lib/game.js**:

```json
{
    ...
    "main": "lib/game.js",
    ...
    "scripts": {
        "build": "tsc"
    },
    ...
}
```

Add the following **tsconfig.json** file to your project. This will tell TypeScript to compile only **src/game.ts**
without unnecessary files from **node_modules**. Also, your game will be compiled as a **CommonJS** module:

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
        "outDir": "./lib",
        "strict": true
    },
    "files": ["src/game.ts"],
    "exclude": ["node_modules"]
}
```

Now, create a new **src/game.ts** file containing the following code.
**MoroboxAIGameSDK.AbstractGame** is a abstract class from the SDK providing multiple
functions required by MoroboxAI to run and manage the lifecycle or our game. The **boot**
function is required and must be exported at the **end of the script**. This will
be the entrypoint used by MoroboxAI to boot our game:

```js
import * as MoroboxAIGameSDK from 'moroboxai-game-sdk';

export class Game extends MoroboxAIGameSDK.AbstractGame
{
    constructor(options: MoroboxAIGameSDK.BootOptions) {
        super();
    }

    public play(): void {
        console.log('play');
    }

    public pause(): void {
        console.log('pause');
    }

    public stop(): void {
        console.log('stop');
    }
}

// entrypoint used by MoroboxAI to boot our game
export function boot(options: MoroboxAIGameSDK.BootOptions) {
    const game = new Game(options);
}
```

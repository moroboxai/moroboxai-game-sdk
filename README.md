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
npm install moroboxai-game-sdk
```

Log installed SDK version to console:

```js
import * from MoroboxAIGameSDK from 'moroboxai-game-sdk';

console.log(`MoroboxAIGameSDK v${MoroboxAIGameSDK.VERSION}`);
```

## Skeleton Game

Here is an example of the bare minimum required to write a game for MoroboxAI.

You have to create a new **Game** class derived from **MoroboxAIGameSDK.AbstractGame** and
export a **boot** function at the end of your script. This **boot** function is the **entrypoint**
used by MoroboxAI to boot your game:

```js
import * as MoroboxAIGameSDK from 'moroboxai-game-sdk';

export class SkeletonGame extends MoroboxAIGameSDK.AbstractGame
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

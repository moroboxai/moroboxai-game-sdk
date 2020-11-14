/**
 * Version of the SDK.
 */
export const VERSION: string = "0.1.0-alpha.1";

/**
 * 
 */
export class GameInstance
{
    /**
     * Get a short help message describing the game, how it works, and
     * what inputs/outputs are expected.
     */
    public help(): string
    {
        return 'no help available';
    }

    /**
     * Start execution of the game.
     */
    public play(): void
    {
        console.warn("play called but not implemented");
    }

    /**
     * Pause execution of the game.
     */
    public pause(): void
    {
        console.warn("stop called but not implemented");
    }

    /**
     * Stop execution of the game.
     */
    public stop(): void
    {
        console.warn("stop called but not implemented");
    }

    /**
     * This function is called on each frame.
     * 
     * This is the function you must bind your AI to.
     * @param {GameInstance} game - This game instance.
     */
    public frame(game: GameInstance): void
    {}

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
        console.warn("output called but not implemented");
    }

    /**
     * Write input data to current frame of the game.
     * 
     * This allows your AI to decide what to do for the next frame.
     * @param {string} [key] - Name of input to write.
     * @param {any} [val] - New value for this input.
     */
    public input(key: string, val: any): void
    {
        console.warn("input called but not implemented");
    }
}
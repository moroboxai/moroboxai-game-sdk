import { expect } from 'chai';
import 'chai';
import * as MoroboxAIGameSDK from '../src/';

const LOCALHOST = '127.0.0.1';

var jsdom = require('jsdom');
global.window = new jsdom.JSDOM().window;
global.document = window.document;
global.HTMLElement = window.HTMLElement;

class MockGame extends MoroboxAIGameSDK.AbstractGame
{
    constructor(options: MoroboxAIGameSDK.BootOptions) {
        super();
    }

    public help(): string {
        return 'MockGame';
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

    public output(key: string, val?: any): any {
        return undefined;
    }

    public input(key: string, val: any): void {
        console.log('input');
    }
}

describe('MoroboxAIGameSDK', function ()
{
    it('should have VERSION', function ()
    {
        expect(MoroboxAIGameSDK.VERSION).to.be.equal('0.1.0-alpha.4');
    });

    describe('StandaloneGameSDK', function()
    {
        describe('constructor', function()
        {
            it('should have version matching MoroboxAIGameSDK.VERSION', function ()
            {
                const sdk = MoroboxAIGameSDK.createStandalone();
                expect(sdk.version).to.be.equal(MoroboxAIGameSDK.VERSION);
            });

            it('should notify when ready', function(done)
            {
                const sdk = MoroboxAIGameSDK.createStandalone();
                sdk.ready(() =>
                {
                    const host = sdk.address.address;
                    const port = sdk.address.port;
                    expect(host).to.be.equal(LOCALHOST);
                    expect(port).to.not.be.equal(0);
                    expect(sdk.href('index')).to.be.equal(`http://${host}:${port}/index`);

                    done();
                });
            });
        });
    });

    describe('MockGame', function()
    {
        it('should run', function()
        {
            const sdk = MoroboxAIGameSDK.createStandalone();
            const game = new MockGame({
                root: document.body,
                sdk
            });
        });
    });
});
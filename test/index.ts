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

describe('IFileServer', function()
{
    it('should notify when ready', function(done)
    {
        const server = new MoroboxAIGameSDK.FileServer();
        // get notified when the server is ready
        server.ready(() => {
            const host = server.address.address;
            const port = server.address.port;
            expect(host).to.be.equal(LOCALHOST);
            expect(port).to.not.be.equal(0);
            expect(server.href('index')).to.be.equal(`http://${host}:${port}/index`);
            // registering after the server is ready must works
            server.ready(() => {
                // stop the server
                server.close(e => done());
            });
        });

        // start the server on random port
        server.listen();
    });
});

describe('MoroboxAIGameSDK', function ()
{
    const fileServer = new MoroboxAIGameSDK.FileServer();
    fileServer.listen();

    it('should have VERSION', function ()
    {
        expect(MoroboxAIGameSDK.VERSION).to.be.equal('0.1.0-alpha.5');
    });

    describe('StandaloneGameSDK', function()
    {
        describe('constructor', function()
        {
            it('should have version matching MoroboxAIGameSDK.VERSION', function ()
            {
                const sdk = MoroboxAIGameSDK.createStandalone({
                    fileServer
                });
                expect(sdk.version).to.be.equal(MoroboxAIGameSDK.VERSION);
            });

            it('should notify when ready', function(done)
            {
                const sdk = MoroboxAIGameSDK.createStandalone({
                    fileServer
                });
                sdk.ready(() =>
                {
                    done();
                });
            });
        });
    });

    describe('MockGame', function()
    {
        it('should run', function()
        {
            const sdk = MoroboxAIGameSDK.createStandalone({
                fileServer
            });
            const game = new MockGame({
                root: document.body,
                sdk
            });
        });
    });

    fileServer.close();
});
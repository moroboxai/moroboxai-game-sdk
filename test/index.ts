import { expect } from 'chai';
import 'chai';
import * as http from 'http';
import * as net from 'net';
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

describe('FileServer', function()
{
    // single instance for all tests
    const server = new MoroboxAIGameSDK.FileServer();

    it('should notify when ready', function(done)
    {
        // get notified when the server is ready
        server.ready(() => {
            // check server address and href result
            const host = server.address.address;
            const port = server.address.port;
            expect(host).to.be.equal(LOCALHOST);
            expect(port).to.not.be.equal(0);
            expect(server.href('')).to.be.equal(`http://${host}:${port}/`);
            expect(server.href('index')).to.be.equal(`http://${host}:${port}/index`);
            // registering after the server is ready must works
            server.ready(() => done());
        });

        // start the server on random port
        server.listen();
    });

    it('should handle invalid request', function()
    {
        // http.IncomingMessage may have a null url
        // test such case here
        const socket = new net.Socket();
        const req = new http.IncomingMessage(socket);
        req.url = undefined;
        const res = new http.ServerResponse(req);

        MoroboxAIGameSDK.FileServer.serveLocalFiles(req, res);
        expect(res.statusCode).to.be.equal(404);
    });

    it('should handle invalid files', function(done)
    {
        // should return 404 when requesting a directory
        http.get(server.href(''), res => {
            expect(res.statusCode).to.be.equal(404);

            // should return 404 when file doesn't exist
            http.get(server.href('invalidfile'), res => {
                expect(res.statusCode).to.be.equal(404);
                done();
            });
        });
    });

    it('should return valid files', function(done)
    {
        // request README.md file
        http.get(server.href('README.md'), res => {
            expect(res.statusCode).to.be.equal(200);
            done();
        });
    });

    // close the server
    server.close();
});

describe('AIServer', function()
{
    it('should notify when ready', function(done)
    {
        const server = new MoroboxAIGameSDK.AIServer();
        // get notified when the server is ready
        server.ready(() => {
            const host = server.address.address;
            const port = server.address.port;
            expect(host).to.be.equal(LOCALHOST);
            expect(port).to.not.be.equal(0);
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
    const aiServer = new MoroboxAIGameSDK.AIServer();
    aiServer.listen();
    const fileServer = new MoroboxAIGameSDK.FileServer();
    fileServer.listen();

    it('should have VERSION', function ()
    {
        expect(MoroboxAIGameSDK.VERSION).to.be.equal('0.1.0-alpha.6');
    });

    describe('StandaloneGameSDK', function()
    {
        describe('constructor', function()
        {
            it('should have version matching MoroboxAIGameSDK.VERSION', function ()
            {
                const sdk = MoroboxAIGameSDK.createStandalone({
                    aiServer,
                    fileServer
                });
                expect(sdk.version).to.be.equal(MoroboxAIGameSDK.VERSION);
            });

            it('should notify when ready', function(done)
            {
                const sdk = MoroboxAIGameSDK.createStandalone({
                    aiServer,
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
                aiServer,
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
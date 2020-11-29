const { expect } = require('chai');
const chai = require('chai');

global.chai = chai;
global.should = chai.should;
global.assert = chai.assert;
global.expect = chai.expect;

const MoroboxAIGameSDK = require('../');
const net = require('net');

const LOCALHOST = '127.0.0.1';

describe('MoroboxAIGameSDK', function ()
{
    it('should have VERSION', function ()
    {
        expect(MoroboxAIGameSDK.VERSION).to.be.equal('0.1.0-alpha.1');
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
});
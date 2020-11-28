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
            const sdk = MoroboxAIGameSDK.createStandalone();

            it('should have version matching VERSION', function ()
            {
                expect(sdk.version).to.be.equal(MoroboxAIGameSDK.VERSION);
            });

            it('should be bound to a local port', function ()
            {
                expect(sdk.address.address).to.be.equal(LOCALHOST);
                expect(sdk.address.port).to.not.be.equal(0);
            });
        });
    });
});
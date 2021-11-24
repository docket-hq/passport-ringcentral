const mocha = require('mocha');
const should = require('should');
const RingcentralStrategy = require('../index').Strategy;

describe( 'passport-cisco-spark', function() {
    describe('module', function() {
        it('should export class', function() {
            RingcentralStrategy.Strategy.should.be.an.instanceOf(Object);
        })
    })
  });

describe('RingcentralStrategy', function() {
    describe('strategy param tests', function () {
        it('should return false for passReqToCallback', function () {
            const strategy = new RingcentralStrategy({
                clientID: 'ABC123',
                clientSecret: 'secret'
            }, function () { });

            strategy._passReqToCallback.should.equal(false);
        });

        it('should return true for passReqToCallback', function () {
            const strategy = new RingcentralStrategy({
                clientID: 'ABC123',
                clientSecret: 'secret',
                passReqToCallback: true
            }, function () { });

            strategy._passReqToCallback.should.equal(true);
        });

        it('should return prod oauth urls', function () {
            const strategy = new RingcentralStrategy({
                clientID: 'ABC123',
                clientSecret: 'secret'
            }, function () { });

            strategy.userAuthorizationURL.should.equal('https://platform.ringcentral.com/restapi/oauth/authorize');
            strategy.accessTokenURL.should.equal('https://platform.ringcentral.com/restapi/oauth/token');
        });

        it('should return options oauth urls', function () {
            const strategy = new RingcentralStrategy({
                clientID: 'ABC123',
                clientSecret: 'secret',
                authorizationURL: 'https://platform.ringcentral.com/restapi/v2/oauth/authorize',
                tokenURL: 'https://platform.ringcentral.com/restapi/v2/oauth/token'
            }, function () { });

            strategy.userAuthorizationURL.should.equal('https://platform.ringcentral.com/restapi/v2/oauth/authorize');
            strategy.accessTokenURL.should.equal('https://platform.ringcentral.com/restapi/v2/oauth/token');
        });
    });
})
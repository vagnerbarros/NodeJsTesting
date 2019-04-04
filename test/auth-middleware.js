const expect = require('chai').expect;
const authMiddleware = require('../middleware/is-auth');
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

describe('Auth Middleware', function() {

    it('should throw an error if no authorization header is present', function(){
        const req = {
            get: function(headName){
                return null;
            }
        }
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Not authenticated.');
    });
    
    it('should throw an error if the authorization header is only one string', function(){
        const req = {
            get: function(headName){
                return 'fasdfa';
            }
        }
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
    });

    it('should yield a userId after decoding the token', function(){
        const req = {
            get: function(headName){
                return 'Bearer 8838839falsdkfajsldkfjalsdkfja.flaksjdlfkasjdlfkasdjflkasjdlfkajsd.jflaksdjflaksdjlfkajsd';
            }
        }
        sinon.stub(jwt, 'verify');
        jwt.verify.returns({ userId: 'abc' });
        authMiddleware(req, {}, () => {});
        expect(req).to.have.property('userId');
        expect(jwt.verify.called).to.be.true;
        jwt.verify.restore();
    });

    it('should throw an error if the token cannot be verified', function(){
        const req = {
            get: function(headName){
                return 'Bearer 8838839falsdkfajsldkfjalsdkfja.flaksjdlfkasjdlfkasdjflkasjdlfkajsd.jflaksdjflaksdjlfkajsd';
            }
        }
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
    });

})
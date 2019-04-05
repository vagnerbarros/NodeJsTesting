const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

describe('Auth Controller - Login', function() {

    before('Connect and Create new User', async function(){
        await mongoose.connect('mongodb://www.anronsoftware.com.br:27017/admin', {user: 'anron', pass: '@n40ns', dbName: 'testes', useNewUrlParser: true})
        const user =  new User({
            email: 'test@test.com',
            password: 'tester',
            name: 'test',
            _id: '5ca760202c87dc5028ef3563',
            posts: []
        });
        let newUser = await user.save();
    });

    it('Should throw an error with code 500 if acessing the database fails', async function(){

        sinon.stub(User, 'findOne');
        User.findOne.throws();

        const req = {
            body: {
                email: 'test@test.com',
                password: 'tester'
            }
        }
        // AuthController.login(req, {}, () => {}).then(result => {
        //     expect(result).to.be.an('error');
        //     expect(result).to.have.property('statusCode', 500);
        //     done();
        // })

        let result = await AuthController.login(req, {}, () => {});
        expect(result).to.be.an('error');
        expect(result).to.have.property('statusCode', 500);

        User.findOne.restore();
    });

    it('should send a response with a valid user status for an existing user', async function(){

        const req = {
            userId: '5ca760202c87dc5028ef3563'
        }
        const res = {
            statusCode: 500,
            userStatus: null,
            status: function(code){
                this.statusCode = code;
                return this;
            },
            json: function(data){
                this.userStatus = data.status;
            }
        }
        await AuthController.getUserStatus(req, res, () => {});
        expect(res.statusCode).to.be.equal(200);
        expect(res.userStatus).to.be.equal('I am new!');
    });

    after('Remove All Users and Disconnect', async function(){

        await User.deleteMany({});
        await mongoose.disconnect();
    })
})
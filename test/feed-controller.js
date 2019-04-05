const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const FeedController = require('../controllers/feed');

describe('Feed Controller', function() {

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

    it('Should add a created post to the posts of the creator', async function(){

        const req = {
            body: {
                title: 'Test Post',
                content: 'A test post'
            },
            file: {
                path: 'abc'
            },
            userId: '5ca760202c87dc5028ef3563'
        }
        const res = {
            status: function(){
                return this;
            },
            json: function(){}
        }

        let result = await FeedController.createPost(req, res, () => {});
        expect(result).to.have.property('posts');
        expect(result.posts).to.have.length(1);

    });

    after('Remove All Users and Disconnect', async function(){

        await User.deleteMany({});
        await mongoose.disconnect();
    })
})
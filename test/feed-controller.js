const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const feedController = require('../controllers/feed');

describe('Feed Controller ', function() {
    before(function(done){
        mongoose
            .connect(
                'mongodb+srv://alexsplatter:aleksivchenko1344@clusternodejscourse-tufbq.mongodb.net/test-messages?retryWrites=true&w=majority',
                { useNewUrlParser: true, useUnifiedTopology: true }
            ).then(result => {
                const user = new User({
                    email: 'test@test.com',
                    password: 'tester',
                    name: 'Test',
                    posts: [],
                    _id: '5c0f66b979af55031b34721a'
                });
                return user.save();
            })
            .then(() => {
                done();
            })
    });

    it('should send a response with a valid user status for an existing user', function(done) {
        const req = { userId: '5c0f66b979af55031b34721a' };
        const res = {
            statusCode: 500,
            userStatus: 'null',
            status: function(code) {
                this.statusCode = code;
                return this;
            },
            json: function(data) {
                this.userStatus = data.status;
            }
        };
        feedController.getStatus(req, res, () => {}).then(() => {
            expect(res.statusCode).to.be.equal(200);
            expect(res.userStatus).to.be.equal('Hello, everyone!');
            done();
        });
    }); 
    
    it('should add a created post to the posts of the creator', function(done) {
        const req = {
            body: {
                title: 'Title',
                content: 'content content'
            },
            file: {
                path:'just a string'
            },
            userId: '5c0f66b979af55031b34721a'
        };

        const res = {
            status: function() {
                return this;
            },
            json: function () {}
        };

        feedController.createPost(req, res, () => {}).then(savedUser => {
            expect(savedUser).to.have.property('posts');
            expect(savedUser.posts).to.have.length(1);
            done();
        })
    });
    
    after(function(done) {
        User.deleteMany({}).then(() => {
            mongoose.disconnect().then(() => {
                done();
            })
        });
    });

    // beforeEach(function() {});
    // afterEach(function() {});
});
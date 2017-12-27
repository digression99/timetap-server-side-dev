const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');
const {User} = require('../models/user');

const {todos, populateTodos, users, populateUsers} = require('./seeds/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todo', () => {

    // why async/await test isn't working?
    it('should create a new todo',  (done) => {
        let text = "test test test";

        request(app)
            .post('/todo')
            .set('x-auth', users[0].tokens[0].token)
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(typeof res.body.todo.createdAt).toBe('number');
            })
            .end( (err, res) => {
                if (err) return done(err);
                Todo.find({text})
                    .then((todo) => {
                        expect(todo.length).toBe(1);
                        expect(todo[0].text).toBe(text);
                        done();
                    })
                    .catch(e => done(e));
                // try {
                //     if (err) return done(err);
                //     let todo = await Todo.find({text});
                //     expect(todo.length).toBe(1);
                //     expect(todo[0].text).toBe(text);
                //     done();
                // } catch (e) {
                //     done(e);
                // }
            });
    });


});

describe('GET /todo/todos', () => {
    it('should get all todos.', (done) => {
        request(app)
            .get('/todo/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1);
            })
            .end(done);
    });
});

describe('GET /todo/:id', () => {
    it('should return todo doc.', (done) => {
        request(app)
            .get(`/todo/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });
});

describe('DELETE /todo/:id', () => {
    it('should remove a todo', (done) => {
        let hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todo/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.findById(hexId)
                    .then((todo) => {
                        expect(todo).toBeFalsy();
                        return done();
                    })
                    .catch(e => done(e));
            });
    });
});

describe('PATCH /todo/:id', () => {
    it('should update the todo', (done) => {
        let id = todos[0]._id.toHexString();
        let body = {
            text : "updated to true.",
            completed : true
        };

        request(app)
            .patch(`/todo/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .send(body)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(body.text);
                expect(res.body.todo.completed).toBe(body.completed);
                expect(typeof res.body.todo.completedAt).toBe('number');
            })
            .end(done);
    });
});

describe('GET /user/profile', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/user/profile')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });
});

describe('POST /user', () => {
    it('should create a user', (done) => {
        let email = "testemail@test.com";
        let password = "123123!";

        request(app)
            .post('/user')
            .send({
                email,
                password
            })
            .expect(res => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end(err => {
                if (err) return done(err);
                User.findOne({email})
                    .then(user => {
                        expect(user).toBeTruthy();
                        expect(user.password).not.toBe(password);
                        done();
                    })
                    .catch(e => done(e));
            });
    });
});

describe('POST /user/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/user/login')
            .send({
                email : users[1].email,
                password : users[1].password
            })
            .expect(200)
            .expect(res => {
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if (err) return done(err);

                User.findById(users[1]._id)
                    .then(user => {
                        expect(user.toObject().tokens[1]).toMatchObject({
                            access : 'auth',
                            token : res.headers['x-auth']
                        });
                        done();
                    })
                    .catch(e => done(e));
            });
    });
});

describe('DELETE /user/logout', () => {
    it('should remove token on logout', (done) => {
        request(app)
            .delete('/user/logout')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);

                User.findById(users[0]._id)
                    .then(user => {
                        expect(user.tokens.length).toBe(0);
                        done();
                    })
                    .catch(e => done(e));
            });
    });
});
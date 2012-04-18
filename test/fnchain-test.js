var should = require('should'),
    FnChain = require('../')

var once;

describe('FnChain', function () {
  beforeEach(function () {
    once = false;
  })
  it('should pass the arguments through the functions chain', function (done) {
    new FnChain([
      function (p1, p2, next) {
        p1.should.be.equal('foo')
        p2.should.be.equal('bar')
        next()
      },
      function (p1, p2, next) {
        p1.should.be.equal('foo')
        p2.should.be.equal('bar')
        next()
      },
      function (p1, p2, next) {
        p1.should.be.equal('foo')
        p2.should.be.equal('bar')
        next()
      }
    ], function (err, p1, p2) {
      once.should.be.false
      once = true
      p1.should.be.equal('foo')
      p2.should.be.equal('bar')
      done(err)
    }).call('foo', 'bar')
  })
  it('should stop if requested', function (done) {
    new FnChain([
      function (p1, p2, next) {
        p1.step = 1
        next()
      },
      function (p1, p2, next) {
        p1.step = 2
        next(null, true)
      },
      function (p1, p2, next) {
        next(new Error('3'))
      }
    ], function (err, p1, p2) {
      once.should.be.false
      once = true
      p1.step.should.be.equal(2)
      done(err)
    }).call({}, {})
  })
  it('should stop on error', function (done) {
    new FnChain([
      function (next) {
        next()
      },
      function (next) {
        next(new Error('2'))
      },
      function (next) {
        next(new Error('3'))
      }
    ], function (err) {
      once.should.be.false
      once = true
      should.exist(err)
      err.message.should.be.equal('2')
      done()
    }).call()
  })
  it('should accept new task on the way', function (done) {
    var chain = new FnChain([
      function (next) {
        chain.addTask(function (next) {
          next(new Error('4'))
        })
        next()
      },
      function (next) {
        chain.addTask(function (next) {
          next(new Error('5'))
        })
        next()
      },
      function (next) {
        next()
      }
    ], function (err) {
      once.should.be.false
      once = true
      should.exist(err)
      err.message.should.be.equal('4')
      done()
    }).call()
  })
})
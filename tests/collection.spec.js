'use strict';

var Collection = require('../src/collection');
var should = require('should');
var arrProto = Array.prototype;


describe('Collection', function () {
    beforeEach(function () {
        this.c = new Collection();
    });
    
    describe('array methods', function () {
        it('should have most array methods on the prototype', function () {
            var omit = ['length', 'constructor', 'toString', 'toLocalString'];
            Object.getOwnPropertyNames(arrProto)
                .filter(function (fn) {
                    return omit.indexOf(fn) < 0;
                })
                .forEach(function (fn) {
                    should.exist(this.c[fn]);
                    this.c[fn].should.be.instanceOf(Function);
                }, this);
        });

        it('should test that an array method works', function () {
            var n = this.c.push(1,2);
            n.should.equal(2);
            this.c.length.should.equal(2);
        });
    });

    describe('._convertToArray', function () {
        it('should convert an object with toArray', function () {
            var obj = {
                toArray: function () {
                    return [1,2,3];
                }
            };
            var arr = this.c._convertToArray(obj);
            arr.should.be.instanceOf(Array);
        });

        it('should convert comma separated to an array', function () {
            var arr = this.c._convertToArray(1,2,3,4);
            arr.should.be.instanceOf(Array);
        });
    });

    describe('.constructor', function () {
        it('should add element to the collection on init', function () {
            var c = new Collection([1,2]);
            c.length.should.equal(2);
        });
    });

    describe('length', function () {
        it('should initalize at length 0', function () {
            var c = new Collection();
            c.length.should.equal(0);
        });

        it('should update the length', function () {
            var c = new Collection();
            c.push(1,2,3);
            c.length.should.equal(3);
            c.pop();
            c.length.should.equal(2);
        });
    });


    describe('.on', function () {
        it('should hear array events', function (done) {
            var c = new Collection();
            c.on('push', function (n) {
                n.should.equal(1);
                done();
            });
            c.push(1);
        });
    });

    describe('.zip', function () {
        it('should zip multiple collections together', function () {
            var c = new Collection([1,2]);
            var c2 = new Collection([3,4]);
            var zipped = Collection.zip(c, c2);

            zipped.should.be.instanceOf(Array);
            zipped.should.includeEql([1,3],[2,4]);
        });
    });

    describe('repr', function () {
        it('should return a collection representation', function () {
            var c = new Collection([1,2,3]);
            c.repr.should.equal('{"0":1,"1":2,"2":3}');
        });

        it('should reset toJSON method', function () {
            var c = new Collection([1,2,3]);
            c.repr.should.equal('{"0":1,"1":2,"2":3}');
            c.json.should.equal('[1,2,3]');
        });
    });

    describe('json', function () {
        it('should return an array representation', function () {
            var c = new Collection([1,2,3]);
            c.json.should.equal('[1,2,3]');
        });
    });

});

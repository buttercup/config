const { CONFIG_KEY_PREFIX, applyConfiguration, configure, encodeValue, objectToKeyList } = require("../../source/buttercup.js");
const Configuration = require("../../source/Configuration.js");

describe("buttercup", function() {
    describe("applyConfiguration", function() {
        beforeEach(function() {
            this.item = {
                deleteAttribute: sinon.spy(),
                getAttributes: sinon.stub().returns({
                    [`${CONFIG_KEY_PREFIX}a`]: "shallow",
                    [`${CONFIG_KEY_PREFIX}b.c`]: "deep",
                    [`${CONFIG_KEY_PREFIX}b.d`]: ["one", "two"],
                    [`${CONFIG_KEY_PREFIX}f.g`]: "test"
                }),
                setAttribute: sinon.spy()
            };
            this.configuration = {
                config: {
                    a: "shallow-overwrite",
                    b: {
                        c: "deep",
                        e: "new",
                        d: ["two"]
                    }
                }
            };
        });

        it("removes items that are no longer present", function() {
            applyConfiguration(this.item, this.configuration);
            expect(this.item.deleteAttribute.calledWithExactly(`${CONFIG_KEY_PREFIX}f.g`)).to.be.true;
            expect(this.item.deleteAttribute.calledOnce).to.be.true;
        });

        it("adds new items", function() {
            applyConfiguration(this.item, this.configuration);
            expect(this.item.setAttribute.calledWithExactly(`${CONFIG_KEY_PREFIX}b.e`, encodeValue("new"))).to.be.true;
        });

        it("overwrites existing item values", function() {
            applyConfiguration(this.item, this.configuration);
            expect(this.item.setAttribute.calledWithExactly(`${CONFIG_KEY_PREFIX}a`, encodeValue("shallow-overwrite"))).to.be.true;
        });
    });

    describe("configure", function() {
        beforeEach(function() {
            this.fakeEntry = {
                getAttributes: () => ({
                    [`${CONFIG_KEY_PREFIX}shallow`]: JSON.stringify(123),
                    [`${CONFIG_KEY_PREFIX}deep.a.b.c`]: JSON.stringify("text"),
                    [`${CONFIG_KEY_PREFIX}deep.a.d`]: JSON.stringify(null)
                })
            };
        });

        it("returns a Configuration instance", function() {
            const config = configure(this.fakeEntry);
            expect(config).to.be.an.instanceof(Configuration);
        });

        describe("returned Configuration instance", function() {
            beforeEach(function() {
                this.config = configure(this.fakeEntry);
            });

            it("contains recorded shallow properties", function() {
                expect(this.config.get("shallow")).to.equal(123);
            });

            it("contains recorded deep properties", function() {
                expect(this.config.get("deep.a.b.c")).to.equal("text");
                expect(this.config.get("deep.a.d")).to.be.null;
            });
        });
    });

    describe("objectToKeyList", function() {
        it("outputs simple items", function() {
            const processed = objectToKeyList({
                a: 1
            });
            expect(processed).to.deep.equal({
                a: 1
            });
        });

        it("outputs deep items", function() {
            const processed = objectToKeyList({
                a: {
                    b: {
                        c: 2
                    }
                }
            });
            expect(processed).to.deep.equal({
                "a.b.c": 2
            });
        });

        it("outputs multiple items", function() {
            const processed = objectToKeyList({
                a: {
                    b: {
                        c: 2,
                        d: "three"
                    },
                    e: "four"
                }
            });
            expect(processed).to.deep.equal({
                "a.b.c": 2,
                "a.b.d": "three",
                "a.e": "four"
            });
        });

        it("outputs arrays without change", function() {
            const processed = objectToKeyList({
                a: {
                    b: {
                        c: [1, 2, 3]
                    }
                }
            });
            expect(processed).to.deep.equal({
                "a.b.c": [1, 2, 3]
            });
        });

        it("outputs arrays with deep values", function() {
            const processed = objectToKeyList({
                a: {
                    b: {
                        c: [1, {
                            d: 2,
                            e: 3
                        }]
                    }
                }
            });
            expect(processed).to.deep.equal({
                "a.b.c": [1, {
                    d: 2,
                    e: 3
                }]
            });
        });

        it("escapes keys", function() {
            const processed = objectToKeyList({
                "a.b": 1
            });
            expect(processed).to.deep.equal({
                "a\\\\.b": 1
            });
        });
    });
});

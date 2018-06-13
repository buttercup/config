const { applyConfiguration, encodeValue, objectToKeyList } = require("../../source/buttercup.js");

describe("buttercup", function() {
    describe("applyConfiguration", function() {
        beforeEach(function() {
            this.item = {
                deleteAttribute: sinon.spy(),
                getAttributes: sinon.stub().returns({
                    "BCUP_CONFIG_VALUE_a": "shallow",
                    "BCUP_CONFIG_VALUE_b.c": "deep",
                    "BCUP_CONFIG_VALUE_b.d.0": "one",
                    "BCUP_CONFIG_VALUE_b.d.1": "two"
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
            expect(this.item.deleteAttribute.calledWithExactly("BCUP_CONFIG_VALUE_b.d.1")).to.be.true;
            expect(this.item.deleteAttribute.calledOnce).to.be.true;
        });

        it("adds new items", function() {
            applyConfiguration(this.item, this.configuration);
            expect(this.item.setAttribute.calledWithExactly("BCUP_CONFIG_VALUE_b.e", encodeValue("new"))).to.be.true;
        });

        it("overwrites existing item values", function() {
            applyConfiguration(this.item, this.configuration);
            expect(this.item.setAttribute.calledWithExactly("BCUP_CONFIG_VALUE_a", encodeValue("shallow-overwrite"))).to.be.true;
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

        it("outputs arrays", function() {
            const processed = objectToKeyList({
                a: {
                    b: {
                        c: [1, 2, 3]
                    }
                }
            });
            expect(processed).to.deep.equal({
                "a.b.c.0": 1,
                "a.b.c.1": 2,
                "a.b.c.2": 3
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
                "a.b.c.0": 1,
                "a.b.c.1.d": 2,
                "a.b.c.1.e": 3
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

const { objectToKeyList } = require("../../source/buttercup.js");

describe("buttercup", function() {
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

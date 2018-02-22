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
    });
});

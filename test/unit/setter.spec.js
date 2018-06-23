const { keyToComponents, setDeep } = require("../../source/setter.js");

describe("setter", function() {
    describe("keyToComponents", function() {
        it("splits keys by periods", function() {
            expect(keyToComponents("a.b.c")).to.deep.equal(["a", "b", "c"]);
        });

        it("ignores escaped periods", function() {
            expect(keyToComponents("a.b\\.c")).to.deep.equal(["a", "b.c"]);
        });
    });

    describe("setDeep", function() {
        it("sets deep values", function() {
            const obj = {};
            setDeep(obj, "a.b.c", 123);
            expect(obj).to.deep.equal({a:{b:{c: 123}}});
        });
    });
});

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

        it("sets indexed array values", function() {
            const obj = {};
            setDeep(obj, "a.0", 1);
            setDeep(obj, "a.2", 3);
            expect(obj).to.deep.equal({a:[1, undefined, 3]});
        });

        it("sets generically-indexed array values", function() {
            const obj = {};
            setDeep(obj, "a._", 1);
            setDeep(obj, "a._", 3);
            expect(obj).to.deep.equal({a:[1, 3]});
        });

        it("sets deep generic arrays", function() {
            const obj = {};
            setDeep(obj, "a._._", 1);
            setDeep(obj, "a._._", 3);
            expect(obj).to.deep.equal({
                a: [ [1], [3] ]
            });
        });

        it("throws if an array index is used at the start of a key", function() {
            const obj = {};
            expect(() => {
                setDeep(obj, "_.a", true);
            }).to.throw(/key.+array.+index/i);
        });
    });
});

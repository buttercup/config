const { createConfig } = require("../../source/config.js");

describe("config", function() {
    describe("createConfig", function() {
        it("merges onto template", function() {
            const output = createConfig({ a: true }, { a: false });
            expect(output.a).to.be.true;
        });
    });
});

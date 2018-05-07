const { CONFIG_KEY_PREFIX, configure } = require("../../source/buttercup.js");
const Configuration = require("../../source/Configuration.js");

describe("buttercup", function() {
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
    });
});

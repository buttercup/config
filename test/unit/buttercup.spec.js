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
});

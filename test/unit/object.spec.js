const { applyConfiguration, configure } = require("../../source/object.js");
const Configuration = require("../../source/Configuration.js");

describe("buttercup", function() {
    describe("applyConfiguration", function() {
        beforeEach(function() {
            this.item = {
                a: {
                    b: 123,
                    c: {
                        d: ["one", "two"]
                    }
                },
                c: {
                    d: false
                }
            };
            this.configMock = {
                config: {
                    a: "shallow-overwrite",
                    c: {
                        e: true
                    }
                }
            };
        });

        it("overwrites items", function() {
            applyConfiguration(this.item, this.configMock);
            expect(this.item.a).to.equal("shallow-overwrite");
        });

        it("merges items", function() {
            applyConfiguration(this.item, this.configMock);
            expect(this.item.c).to.deep.equal({
                d: false,
                e: true
            });
        })
    });

    describe("configure", function() {
        it("returns a Configuration instance", function() {
            const config = configure({});
            expect(config).to.be.an.instanceof(Configuration);
        });

        it("configures the target", function() {
            const target = {};
            const config = configure(target);
            config.set("a.b.c", 123);
            config.apply();
            expect(target).to.have.nested.property("a.b.c", 123);
        });
    });
});

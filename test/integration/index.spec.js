const { Archive } = require("buttercup");
const { configure } = require("../../source/index.js");

describe("@buttercup/config", function() {
    describe("configure", function() {
        beforeEach(function() {
            const archive = new Archive();
            const group = archive.createGroup("test");
            const entry = group.createEntry("test");
            this.configurables = [archive, group, entry];
        });

        it("can configure and write properties", function() {
            this.configurables.forEach(target => {
                let config = configure(target);
                config.set("a.b.c", "some value");
                config.apply();
                config = configure(target);
                expect(config.get("a.b.c")).to.equal("some value");
                expect(config.get("a.d.c")).to.be.undefined;
            });
        });

        // it("can configure items using templates", function() {
        //     const getTemplate = () => ({
        //         a: {
        //             b: "val",
        //             c: [0, 1, 2]
        //         }
        //     });
        //     this.configurables.forEach(target => {
        //         let config = configure(target, getTemplate());
        //         config.set("a.d", "test");
        //         const arr = config.get("a.c");
        //         console.log(arr);
        //         config.set("a.c", arr);
        //         config.apply();
        //         console.log(target._getWestley().getDataset());
        //         config = configure(target, getTemplate());
        //         expect(config.get("a.b")).to.equal("val");
        //         expect(config.get("a.d")).to.equal("test");
        //         expect(config.get("a.c")).to.deep.equal([0, 1, 2, 3]);
        //     });
        // });
    });
});

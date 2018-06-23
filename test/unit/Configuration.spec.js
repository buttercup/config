const Configuration = require("../../source/Configuration.js");

describe("Configuration", function() {
    it("can be instantiated", function() {
        expect(() => {
            new Configuration();
        }).to.not.throw();
    });

    it("merges the initial value and the template", function() {
        const instance = new Configuration(
            { a: { b: { c: [1, 2, 3]}, d: 10}},
            { a: { b: { c: [4]}, d: 9 }}
        );
        expect(instance.config).to.deep.equal({
            a: {
                b: {
                    c: [4, 1, 2, 3]
                },
                d: 10
            }
        });
    });

    describe("export", function() {
        beforeEach(function() {
            this.object = { a: true };
            this.instance = new Configuration(this.object);
        });

        it("exports the same object structure", function() {
            expect(this.instance.export()).to.deep.equal(this.object);
        });

        it("exports a different object", function() {
            expect(this.instance.export()).to.not.equal(this.object);
        });
    });

    describe("get", function() {
        beforeEach(function() {
            this.basicInstance = new Configuration({
                a: 1,
                b: {
                    c: false
                }
            });
        });

        it("gets shallow values", function() {
            expect(this.basicInstance.get("a")).to.equal(1);
        });

        it("gets deep values", function() {
            expect(this.basicInstance.get("b.c")).to.equal(false);
        });

        it("returns undefined if shallow value doesn't exist", function() {
            expect(this.basicInstance.get("d")).to.equal(undefined);
        });

        it("returns undefined if deep value doesn't exist", function() {
            expect(this.basicInstance.get("d.e.f")).to.equal(undefined);
        });

        it("returns the default value if the key doesn't exist", function() {
            expect(this.basicInstance.get("d.e.f", 1987)).to.equal(1987);
        });
    });

    describe("set", function() {
        beforeEach(function() {
            this.instance = new Configuration();
        });

        it("sets shallow values", function() {
            this.instance.set("basic", true);
            expect(this.instance.config).to.have.property("basic", true);
        });

        it("sets deep values", function() {
            this.instance.set("some.deep.property", 123);
            expect(this.instance.config).to.deep.equal({
                some: {
                    deep: {
                        property: 123
                    }
                }
            });
        });

        it("sets object indexes for numbers", function() {
            this.instance.set("root.0", 456);
            expect(this.instance.config).to.deep.equal({
                root: { "0": 456 }
            });
        });

        it("sets array values", function() {
            this.instance.set("root", [1, 2, 3]);
            expect(this.instance.config).to.deep.equal({
                root: [1, 2, 3]
            });
        });

        it("sets object values", function() {
            this.instance.set("root", {a: true});
            expect(this.instance.config).to.deep.equal({
                root: {
                    a: true
                }
            });
        });

        it("emits events for set items", function() {
            sinon.spy(this.instance, "emit");
            this.instance.set("basic.key", "value");
            expect(this.instance.emit.calledOnce).to.be.true;
            expect(this.instance.emit.calledWithExactly("set", "basic.key", "value")).to.be.true;
        });

        it("emits multiple events for object values", function() {
            sinon.spy(this.instance, "emit");
            this.instance.set("basic.key", { a: 1, b: { c: 2 } });
            expect(this.instance.emit.calledTwice).to.be.true;
            expect(this.instance.emit.calledWithExactly("set", "basic.key.a", 1)).to.be.true;
            expect(this.instance.emit.calledWithExactly("set", "basic.key.b.c", 2)).to.be.true;
        });
    });
});

import TypeIt from "../src/TypeIt.js";

let instance;
let args;

beforeEach(() => {
  document.body.innerHTML = `
    <div>
      <span id="element"></span>
    </div>
  `;

  args = [
    "#element",
    {
      speed: 1,
      strings: ["ABC", "EFG"]
    }
  ];

  instance = new TypeIt(...args);
});

test("Initial queue only contains startDelay pause.", () => {
  args[1].strings = [];
  instance = new TypeIt(...args);
  expect(instance.getQueue().getItems()).toMatchSnapshot();
});

test("Returns an object with expected properties.", () => {
  expect(Object.keys(instance).sort()).toMatchSnapshot();
});

test("Defines hard-coded string correctly.", () => {
  document.body.innerHTML = `
    <div>
      <span id="element">Hard-coded string.</span>
    </div>
  `;

  let instance = new TypeIt("#element", {
    strings: ["My string."]
  });

  expect(instance.getOptions().strings).toEqual([
    "Hard-coded string.",
    "My string."
  ]);
});

test("Will not begin until explicitly called.", () => {
  document.body.innerHTML = `<div>'
      <span id="element"></span>
    </div>`;

  const instance = new TypeIt("#element", {
    strings: "hello!"
  });

  expect(instance.is("started")).toBe(false);

  instance.go();

  expect(instance.is("started")).toBe(true);
});

test("Clears out remnants of previous instances correctly.", () => {
  document.body.innerHTML = `
    <div>
      <span id="element">
        Previous string.
      </span>
    </div>
  `;

  let instance = new TypeIt("#element", {
    strings: "My string."
  });

  expect(!instance.getOptions().strings[0].includes("ti-cursor")).toEqual(true);
});

test("Typing doesn't end with a break tag.", () => {
  document.body.innerHTML = `<div>'
    <span id="element"></span>
  </div>`;

  const element = document.querySelector("#element");
  new TypeIt("#element", {
    strings: ["One string.", "Two string", "Three string."]
  }).go();

  expect(element.innerHTML.endsWith("<br>")).not.toBe(true);
});

describe("go()", () => {
  test("Attaches cursor correctly.", () => {
    expect(document.querySelector(".ti-cursor")).toBeNull();
    instance.go();
    expect(document.querySelector(".ti-cursor")).not.toBeNull();
  });

  test("Does not attach cursor when none should exist.", () => {
    args[1].cursor = false;
    instance = new TypeIt(...args);
    expect(document.querySelector(".ti-cursor")).toBeNull();
    instance.go();
    expect(document.querySelector(".ti-cursor")).toBeNull();
  });
});

describe("empty()", () => {
  test("Should empty out element when called with no cursor.", async () => {
    args[1].cursor = false;
    instance = new TypeIt(...args);
    element.innerHTML = "existing text";

    await new Promise(resolve => {
      args[1].afterComplete = function() {
        return resolve();
      };

      const instance = new TypeIt(...args);

      instance.empty().go();
    });

    expect(element.childNodes).toHaveLength(0);
  });

  describe("addSplitPause()", () => {
    test("Adds even split pause around strings.", () => {
      args[1].strings = [];
      instance = new TypeIt(...args);
      expect(instance.getQueue().getItems()).toMatchSnapshot();
    });

    test("Adds different even split pause around strings.", () => {
      args[1].strings = ["ABC", "EFG"];
      args[1].nextStringDelay = 1000;

      instance = new TypeIt(...args);

      expect(instance.getQueue().getItems()).toMatchSnapshot();
    });

    test("Adds split pause around strings when value is array.", () => {
      args[1].strings = ["ABC", "EFG"];
      args[1].nextStringDelay = [100, 500];

      instance = new TypeIt(...args);

      expect(instance.getQueue().getItems()).toMatchSnapshot();
    });

    test("Inserts split pause around multiple strings.", () => {
      args[1].strings = ["A", "B", "C", "D", "E"];

      instance = new TypeIt(...args);

      expect(instance.getQueue().getItems()).toMatchSnapshot();
    });
  });

  test("Should leave cursor alone when it empties element.", async () => {
    element.innerHTML = "existing text";

    await new Promise(resolve => {
      args[1].afterComplete = function() {
        return resolve();
      };

      const instance = new TypeIt(...args);

      instance.empty().go();
    });

    expect(element.childNodes).toHaveLength(1);
  });
});

describe("reset()", () => {
  test("Successfully resets when called.", () => {
    document.body.innerHTML = `<div>'
        <span id="element"></span>
      </div>`;

    let instance = new TypeIt("#element", {
      strings: "This is my string!"
    }).go();

    instance.destroy();

    expect(instance.is("destroyed")).toBe(true);

    instance = instance.reset();

    //-- Ensure the arguments that define these properties were passed.
    expect(instance.getOptions()).toMatchSnapshot();
    expect(instance.is("completed")).toBe(false);
    expect(instance.is("destroyed")).toBe(false);
  });
});

describe("destroy()", () => {
  test("Destroys instances successfully.", () => {
    document.body.innerHTML = `<div>'
      <span id="element"></span>
    </div>`;

    const instance = new TypeIt("#element", {
      strings: "This is my string!"
    }).go();

    expect(instance.is("destroyed")).toBe(false);

    instance.destroy();

    expect(document.body.querySelector(".ti-cursor")).toEqual(null);
  });
});

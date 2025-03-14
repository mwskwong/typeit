import repositionCursor from "../../src/helpers/repositionCursor";
import { walkElementNodes } from "../../src/helpers/chunkStrings";
import expandTextNodes from "../../src/helpers/expandTextNodes";

let element, allCharacters;

beforeEach(() => {
  setHTML`<span id="el">12345<i class="ti-cursor">|</i></span>`;

  element = expandTextNodes(document.querySelector("#el"));

  allCharacters = walkElementNodes(element, true);
});

test("Does not move cursor when stepsToMove is zero.", () => {
  repositionCursor(element, allCharacters, 0);

  expect(document.body.innerHTML).toMatchSnapshot();
});

test("Moves cursor three steps back.", () => {
  repositionCursor(element, allCharacters, 3);

  expect(document.body.innerHTML).toMatchSnapshot();
});

test("Moves cursor three back and two forward.", () => {
  repositionCursor(element, allCharacters, 3);

  repositionCursor(element, allCharacters, 1);

  expect(document.body.innerHTML).toMatchSnapshot();
});

test("Stops moving when at end of string.", () => {
  repositionCursor(element, allCharacters, -100);

  expect(document.body.innerHTML).toMatchSnapshot();
});

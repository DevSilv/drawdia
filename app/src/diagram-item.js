/*

diagramNode -> elem -> onclick   -> startSelection - - - - - - - - - - - - - <---|
                                 -> processSelection - - - - - - - - - <---|     |
                                 -> startDragging- - - - - - - - <---|     |     |
                                 -> processDragging- - - - <---|     |     |     |
                    -> classList -> ["diagramNode"]- <---|     |     |     |     |
                                                         |     |     |     |     |
diagramLink -> elem -> onclick   -> startSelection - - - | - - | - - | - - | <---|
                                 -> processSelection - - | - - | - - | <---|     | The same ones
                                 -> startDragging- - - - | - - |-<---|     | The same ones
                                 -> processDragging- - - | <---|     | The same ones
			        -> classList -> ["diagramLink"]- <---|     | The same ones
			                                             | Different ones

*/

// Set accessor behavior on "elem" is unwanted
// Possibility of changing "elem" (inherited or not) is unwanted
// Possibility of inheriting "elem" is wanted

/**
 * Option 1 (object literal + Object.create)
 * 	Possibility of setting "elem": yes
 * 	Possibility of changing "elem" (inherited or not): yes
 * 	Possibility of inheriting "elem": yes
 */
const Option1diagramItemPrototype = {
	elem:
		(() => {
			const elem = document.createElement("div");
			elem.addEventListener("onclick", event => { });
			return elem;
		})()
};
const option1DiagramItem1 = Object.create(Option1diagramItemPrototype);
const option1DiagramItem2 = Object.create(Option1diagramItemPrototype);

/**
 * Option 2 (closure + object literal + Object.create)
 * 	Possibility of setting "elem": no (because of the closure)
 * 	Possibility of changing "elem" (inherited or not): yes
 * 	Possibility of inheriting "elem": no (because of the closure)
 */
const Option2diagramItemPrototype
	= (() => {
		const elem = document.createElement("div");
		elem.addEventListener("onclick", event => { });

		return {
			getElem: () => elem
		};
	})();
const option2DiagramItem1 = Object.create(Option2diagramItemPrototype);
const option2DiagramItem2 = Object.create(Option2diagramItemPrototype);

/**
 * Option 3 (constructor function)
 * 	Possibility of setting "elem": yes
 * 	Possibility of changing "elem" (inherited or not): yes
 * 	Possibility of inheriting "elem": yes
 */
const Option3DiagramItemConstructor
	= function () {
		this.elem
			= (() => {
				const elem = document.createElement("div");
				elem.addEventListener("onclick", event => { });
				return elem;
			})();
	};
const option3DiagramItem1 = new Option3DiagramItemConstructor();
const option3DiagramItem2 = new Option3DiagramItemConstructor();

/**
 * Option 4 (?factory function?)
 * 	Possibility of setting "elem": no (because of the closure)
 * 	Possibility of changing "elem" (inherited or not): yes
 * 	Possibility of inheriting "elem": no (because of the closure)
 */
const Option4CreateDiagramItem
	= () => {
		const elem = document.createElement("div");
		elem.addEventListener("onclick", event => { });

		return {
			getElem: () => elem
		};
	};
const option4DiagramItem1 = Option4CreateDiagramItem();
const option4DiagramItem2 = Option4CreateDiagramItem();

/**
 * Option 5 (constructor function)
 * 	Possibility of setting "elem": no (because of the closure)
 * 	Possibility of changing "elem" (inherited or not): yes
 * 	Possibility of inheriting "elem": no (because of the closure)
 */
// Defining ? (what?)
const Option5CreateDiagramItemConstructor
	= function () {
		const elem = document.createElement("div");
		elem.addEventListener("onclick", event => { });

		this.getElem = () => elem
	};
// Creating instances of ? (what?)
const option5DiagramItem1 = new Option5CreateDiagramItemConstructor();
const option5DiagramItem2 = new Option5CreateDiagramItemConstructor();
// Inheriting from ? (what?)

// Creating instances of inherited ? (what?)


// Solution 1: implement somehow a protected field for "elem" in option 2 or 4 (more intuitive)
// Solution 2: do not make "elem" inherited, making the type of an item be handled through arguments (less intuitive)
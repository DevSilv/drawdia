## Reminders for me

### The `Event` interface

- `event.offsetX` (experimental as of 2020 May 28) — per MDN, "(...) the offset in the X coordinate of the mouse pointer between that event and the padding edge of the target node"
- `event.clientX` - per MDN, "(...) the horizontal coordinate within the application's client area at which the event occurred (as opposed to the coordinate within the page)"
- `event.pageX` (experimental as of 2020 May 28) — per MDN, "(...) the X (horizontal) coordinate (in pixels) at which the mouse was clicked, relative to the left edge of the entire document. This includes any portion of the document not currently visible"

### The `HTMLElement` interface

- `HTMLElement.offsetLeft` — per MDN, "(...) the number of pixels that the upper left corner of the current element is offset to the left within the HTMLElement.offsetParent node"
- `HTMLElement.offsetParent` — per MDN, "(...) a reference to the element which is the closest (nearest in the containment hierarchy) positioned ancestor element"

### The `Element` interface

- `Element.getBoundingClientRect()` — per MDN, "(...) the size of an element and its position relative to the viewport"

## Style

### Code clarity

To keep the code clear:

- For function, methods and operators, I try to separate usage of them of usage of the values that they produce. So, instead of this:

	```JavaScript
	const fooElem = bar.getFoo().getElem();
	```

	I prefer doing:

	```JavaScript
	const foo = bar.getFoo();
	const fooElem = foo.getElem();
	```

	And, another example; instead of this:

	```JavaScript
	const x = foo.bar(y / z);
	```

	I prefer doing:

	```JavaScript
	const yDividedByZ = y / z;
	const x = foo.bar(yDividedByZ);
	```

	I do this even when there will be only one usage of the additional variables created (i.e., in the above example, the variable `foo` will be used only once, in this place).

- For objects and properties, I do the same as to methods – i.e., try to separate their invokations and their usage – only in case I think it will benefit with more consistent abstraction layers. So, instead of this:

	```JavaScript
	function calculateFooLength(xyz){
		const fooStart = xyz.start;
		const fooLength = Foo.bar().end - fooStart;
		return fooLength;
	}
	```

	I prefer introducing new variable `fooEnd` and doing:

	```JavaScript
	const fooStart = Baz.bar().start;
	const fooEnd = Foo.bar().end;
	const fooLength = fooEnd - fooStart; // More consistent abstraction than earlier
	```

	In the latter piece of code, in my opinion, abstraction layers are more consistent. And again, similar as in the case of functions and methods, I do this even when there will be only one usage of the additional variables created (i.e., in the above example, the variable `fooEnd` will be used only once, in this place).

### Naming

#### Names of boolean variables and functions returning boolean result

I have a problem with naming boolean variables and functions returning boolean.

On one hand, in general, they should have different names - to avoid confusion in case the result of the invokation of such a function is stored in a variable. I assume that they should have different names even in case one managed to avoid at all the conflicts at the semantic level of the code (in turn, this is on the assumption that I want the code that I'm writing to be unambiguous (= intuitive) for humans, not machines).

On the other hand, the only convention of naming functions returning boolean that I can recall is, for example, `isItemSelected` for a function that is to return the result of a comparison if a given number is greater or not (than some other number).

Then, I have a problem with intuitively naming boolean variables in case the result of the invokation of such a function is stored in a variable. This is not to say that such a variable will/need to exist anywhere in the code I'm writing now or in the future. But, this **is** to say that I assume such a **possibility** (but I'm not sure whether or not I'm breaking here the YAGNI principle). Intuitively, a variable for storing the result of the invokation of a function named `isItemSelected` could be named `itemSelected` (nearly the same name, just without the fragment `is`). But that seems to be confusing assuming somewhere (anywhere!) in the code there could be a variable named `selectedItem` that is to store not the result of a verification of an item to be selected, but a selected item - **not a boolean, but an object**. Considering this confusing is on the assumption that `itemSelected` and `selectedItem` may be used interchangeably (speaking differently, it is equivalent to the assumption that it is intuitive for one to use them interchangeably **indepdendently** of whether one is aware or not if there exist any method returning a boolean result, which result could/need to be stored in a variable).

If the last assumptions is false, maybe it would be intuitive enough just follow the aforementioned convention. But, as I find the last assumption true, I decided to try to name such variables another way. I name them starting with the fragment `is`, but slightly changing the further part of the name comparing to the name of the function. For some examples, see particular boolean variables in the source code.

Since I'm deciding independently for every variable what shall be its name, I'm not sure whether I follow or not any (new) convention doing so. I hope that this would be intuitive enough. If it will happen to turn out not to be so in the future, it will need to be changed.

## Architecture

### The state of a diagram

The state of a diagram is maintained internally to it.

One might ask why this is not done externally. The reason of such a decision is, I decided that it would be more intuitive to have the state handled externally ONLY if it would be intuitive for all of its properties to be handled externally, ASSUMING there are multiple diagrams on a page, AND there is only one mouse (= cursor) available at a time. Such an architecture prevents from maintaining two states at a time for a diagram, what seemed to me less intuitive and more complex than maintaining one state.

Currently, there are the following properties:

1. the state of dragging an item;
2. the state of rotating an item;
3. the state of resizing an item;
4. the state of selection of items;
5. the state of the diagram = what items it includes.

And:

1. In case of the state of dragging an item, it seems to me unintuitive to preserve it across diagrams since it would demand to leave a diagram in the middle of a click (i.e., after the "mousedown" event is fired, and before the "mouseup" event is fired). What follows, it seems to me more intuitive to reset this state for a diagram in case the diagram is "left" by the user (that is, generally, lost the focus).
2. In case of the state of rotating an item, it seems to me unintuitive to preserve it across diagrams for the same reason as in the case of the state of dragging an item.
3. In case of the state of resizing an item, it seems to me unintuitive to preserve it across diagrams for the same reason as in the case of the state of dragging an item.
4. In case of the state of selection of item, it could be preserved across diagrams. It seems equally intuitive to me to have it either preserved or not.
5. In case of the state of the diagram, it could, and even: it should, be preserved across diagrams (one diagram is not "cleared" of items when going to another one).

So, in conclusion: in case of the properties number 1, 2 and 3, it seems to me unintuitive to preserve the state, and in case of the properties number 4 and 5 it seems to me intuitive enough. Including what I've written above, I decided to maintain the state internally to a diagram.

### Creating "state objects"

I create "state objects" (the objects for the state of dragging, the state of rotation, and so on) using static methods (e.g., someClass.create()). One may ask: why not with the `new` operator? I thought that static methods would be more intuitive in this case since I'm using closures with those functions.

## Miscellaneous notes

- I'm using objects because I give up using modules, and classes seemed to me to unintuitive used instead of modules.
- "DiagramNode" because "Node" already exists; so, as a consequence, for consistency, all of the other diagram "entities" have to be named with the prefix "Diagram".

## Sources

- https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
- https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent
- https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
- https://developer.mozilla.org/en-US/docs/Web/API/Event/type
- https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
- https://developer.mozilla.org/en-US/docs/Web/CSS/transform-origin
- https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotate
- https://developer.mozilla.org/en-US/docs/Web/API/Element
- https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
- https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetLeft
- https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetParent
- https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/offsetX
- https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientX
- https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/pageX
- https://html.spec.whatwg.org/multipage/dnd.html#drag-and-drop-processing-model
- https://stackoverflow.com/a/10429969
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/asin
- https://thenewcode.com/1124/Rotating-Elements-To-Mouse-and-Touch-Locations-Using-JavaScript
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/atan2
- https://stackoverflow.com/questions/7664229/optimize-js-jquery-performance-getboundingclientrect-and-eliminating-layout-re
- https://drafts.csswg.org/css-values-3/#angle-value
- https://jsfiddle.net/faLn24v0/52/ (mine)

### Sources to be read yet

- On reflow, JavaScript performance and website performance:
	- https://developers.google.com/speed/docs/insights/browser-reflow
	- https://kellegous.com/j/2013/01/26/layout-performance/
	- https://gist.github.com/paulirish/5d52fb081b3570c81e3a#more-on-forced-layout
	- https://web.archive.org/web/20110331152919/http://gent.ilcore.com/2011/03/how-not-to-trigger-layout-in-webkit.html
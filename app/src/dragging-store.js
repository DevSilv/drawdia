class DraggingStore {
	static create() {
		let item = undefined;
		const shift = {
			horizontal: 0,
			vertical: 0
		};

		return {
			getItem: () => item,
			startDragging:
				(dragStartClientPosition, itemToDrag, elemToDropOnto) =>
					dragStartClientPosition
					&& itemToDrag
					&& elemToDropOnto
					&& (() => {
						const elemToDropOntoBoundingClientRect
							= elemToDropOnto.getBoundingClientRect();
						const elemToDropOntoClientPosition = {
							x: elemToDropOntoBoundingClientRect.left,
							y: elemToDropOntoBoundingClientRect.top
						};

						const elemToDrag = itemToDrag.getElem();
						const elemToDragComputedStyle
							= getComputedStyle(elemToDrag);
						const elemToDragParentElemRelativePosition = {
							x: Number.parseFloat(elemToDragComputedStyle.left),
							y: Number.parseFloat(elemToDragComputedStyle.top)
						};

						shift.horizontal
							= elemToDragParentElemRelativePosition.x
							+ elemToDropOntoClientPosition.x
							- dragStartClientPosition.x;
						shift.vertical
							= elemToDragParentElemRelativePosition.y
							+ elemToDropOntoClientPosition.y
							- dragStartClientPosition.y;

						item = itemToDrag;
					})(),
			processDragOver:
				event =>
					event
					&& (() => {
						// For why an invokation of the "preventDefault()"
						//	method is needed here, see
						//	https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#droptargets
						event.preventDefault();
					})(),
			processDragEnter:
				event =>
					event
					&& (() => {
						// For why an invokation of the "preventDefault()"
						//	method is needed here, see
						//	https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#droptargets
						event.preventDefault();
					})(),
			endDragging:
				(elemToDropOnto, dragEndClientPosition) =>
					elemToDropOnto
					&& dragEndClientPosition
					&& (() => {
						const elemToDropOntoBoundingClientRect
							= elemToDropOnto.getBoundingClientRect();
						const elemToDropOntoClientPosition = {
							x: elemToDropOntoBoundingClientRect.left,
							y: elemToDropOntoBoundingClientRect.top
						};

						const dropClientPosition = {
							x:
								dragEndClientPosition.x
								+ shift.horizontal
								- elemToDropOntoClientPosition.x,
							y:
								dragEndClientPosition.y
								+ shift.vertical
								- elemToDropOntoClientPosition.y
						};

						const elem = item.getElem();
						elem.style.left = `${dropClientPosition.x}px`;
						elem.style.top = `${dropClientPosition.y}px`;

						// The below appending child is not necessary
						//	for dragging to work per se. But, it is done
						//	to change the order at which elements are rendered
						//	so that, after dropping, the element just dropped is
						//	always on top (the default order is
						//	that of the creation of the elements, not the order
						//	of dropping them).
						elemToDropOnto.appendChild(elem);
					})()
		};
	}
}
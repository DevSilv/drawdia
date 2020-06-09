class DraggingStore {
	static create() {
		let item = undefined;
		const cursorShift = { width: 0, height: 0 };

		return {
			getItem: () => item,
			startDragging:
				(dragStartPosition, itemToDrag) =>
					dragStartPosition
					&& itemToDrag
					&& (() => {
						const elemToDrag = itemToDrag.getElem();

						const elemToDragPosition = {
							x: elemToDrag.getBoundingClientRect().left,
							y: elemToDrag.getBoundingClientRect().top
						};
						const newCursorShift = {
							width: dragStartPosition.x - elemToDragPosition.x,
							height: dragStartPosition.y - elemToDragPosition.y
						};
						cursorShift.width = newCursorShift.width;
						cursorShift.height = newCursorShift.height;

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
				(elemToDropOnto, draggingEndPosition) =>
					elemToDropOnto
					&& draggingEndPosition
					&& (() => {
						const dropPosition = {
							x:
								draggingEndPosition.x
								- elemToDropOnto.offsetLeft
								- cursorShift.width,
							y:
								draggingEndPosition.y
								- elemToDropOnto.offsetTop
								- cursorShift.height
						};
						const elem = item.getElem();
						elem.style.left = `${dropPosition.x}px`;
						elem.style.top = `${dropPosition.y}px`;
						// The below is to change the order at which elements
						//	are rendered so that after dropping the element
						//	just dropped is always on top (the default order
						//	is that of the creation of the elements)
						elemToDropOnto.appendChild(elem);
					})()
		};
	}
}
class SelectionStore {
	static create() {
		const dragSelection = {
			selector: { elem: undefined },
			startCursorPosition: { x: undefined, y: undefined }
		};
		const selectedElemsList = [];

		return {
			dragSelection: {
				isDragSelectionPerformed:
					() => dragSelection.selector.elem !== undefined,
				startDragSelection:
					(dragSelectionArea, cursorPosition) =>
						dragSelectionArea
						&& cursorPosition
						&& (() => {
							const dragSelectionAreaPosition = {
								x: dragSelectionArea.offsetLeft,
								y: dragSelectionArea.offsetTop
							};
							const dragSelectionStartPosition = {
								x:
									cursorPosition.x
									- dragSelectionAreaPosition.x,
								y:
									cursorPosition.y
									- dragSelectionAreaPosition.y
							};
							const dragSelector
								= DragSelector.create(
									dragSelectionStartPosition
								);
							const dragSelectorElem = dragSelector.getElem();
							dragSelection.selector.elem = dragSelectorElem;
							dragSelection.startCursorPosition = cursorPosition;

							dragSelectionArea.appendChild(dragSelectorElem);
						})(),
				processDragSelection:
					(
						state,
						currentCursorPosition,
						dragSelectionArea,
						eventType
					) =>
						state
						&& currentCursorPosition
						&& dragSelectionArea
						&& eventType
						&& (() => {
							// (1/4) Move the drag selector element
							//	to the current position of the cursor
							const dragSelectionAreaPosition = {
								x: dragSelectionArea.offsetLeft,
								y: dragSelectionArea.offsetTop
							};
							const newDragSelectorElemPosition = {
								x: currentCursorPosition.x
									> dragSelection.startCursorPosition.x
									? dragSelection.startCursorPosition.x
									: currentCursorPosition.x,
								y: currentCursorPosition.y
									> dragSelection.startCursorPosition.y
									? dragSelection.startCursorPosition.y
									: currentCursorPosition.y
							};
							const newDragSelectorElemRelativePosition = {
								x:
									newDragSelectorElemPosition.x
									- dragSelectionAreaPosition.x,
								y:
									newDragSelectorElemPosition.y
									- dragSelectionAreaPosition.y
							};
							dragSelection.selector.elem.style.left
								= `${newDragSelectorElemRelativePosition.x}px`;
							dragSelection.selector.elem.style.top
								= `${newDragSelectorElemRelativePosition.y}px`;

							// (2/4) Resize the drag selector element
							//	to the position that the cursor was in
							//	when dragging was started
							const newDragSelectorElemSize = {
								width:
									Math.abs(
										currentCursorPosition.x
										- dragSelection.startCursorPosition.x
									),
								height:
									Math.abs(
										currentCursorPosition.y
										- dragSelection.startCursorPosition.y
									)
							};
							dragSelection.selector.elem.style.width
								= `${newDragSelectorElemSize.width}px`;
							dragSelection.selector.elem.style.height
								= `${newDragSelectorElemSize.height}px`;

							state.itemsList.forEach(
								item => {
									const elem = item.getElem();
									const elemPosition = {
										x: elem.getBoundingClientRect().left,
										y: elem.getBoundingClientRect().top
									};
									const toBeSelected
										= Utils.isPositionBetween(
											elemPosition,
											dragSelection.startCursorPosition,
											currentCursorPosition
										);
									const selected
										= selectedElemsList.find(
											x => x.elem === elem
										)
										!== undefined;
									if (toBeSelected && !selected) {
										// (3/4) Mark as selected all
										//	the elements that are marked
										//	as not selected, but are now
										//	within the area of the drag selector
										//	element
										selectedElemsList.push({
											elem: elem, selectionType: eventType
										});
										elem.classList.add("selected");
									} else if (!toBeSelected && selected) {
										// (4/4) Mark as not selected all
										//	the elements that are marked
										//	as selected, but are not
										//	within the area of the drag selector
										//	element anymore
										const elemIndex
											= selectedElemsList.findIndex(
												x => x.elem === elem
											);
										selectedElemsList.splice(elemIndex, 1);
										elem.classList.remove("selected");
									}
								}
							);
						})(),
				endDragSelection:
					() => {
						dragSelection.selector.elem.remove();

						dragSelection.selector.elem = undefined;
					}
			}
		};
	}
}
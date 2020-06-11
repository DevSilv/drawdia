class DiagramArea {
	static create(state, parentElem) {
		if (!state || !parentElem) {
			return undefined;
		}

		const elem
			= (() => {
				const elem = document.createElement("div");

				elem.classList.add("diagram-area");

				elem.addEventListener(
					"mousemove",
					event => {
						// Process rotation
						const rotationPerformed
							= state.rotationStore.isRotationPerformed();
						if (rotationPerformed) {
							const cursorClientPosition = {
								x: event.clientX,
								y: event.clientY
							};
							state.rotationStore.processRotation(
								cursorClientPosition
							);
						}

						// Process "drag selection"
						const dragSelectionPerformed
							= state.selectionStore.dragSelection
								.isDragSelectionPerformed();
						if (dragSelectionPerformed) {
							const cursorClientPosition = {
								x: event.clientX,
								y: event.clientY
							};
							const dragSelectionArea = event.currentTarget;
							const eventType = event.type;
							state.selectionStore.dragSelection
								.processDragSelection(
									state,
									cursorClientPosition,
									dragSelectionArea,
									eventType
								);
						}
					}
				);

				elem.addEventListener(
					"mouseup",
					() => {
						// Handle rotation
						const rotationPerformed
							= state.rotationStore.isRotationPerformed();
						if (rotationPerformed) {
							state.rotationStore.endRotation();
						}

						// Handle "drag selection"
						const dragSelectionPerformed
							= state.selectionStore.dragSelection
								.isDragSelectionPerformed();
						if (dragSelectionPerformed) {
							state.selectionStore.dragSelection
								.endDragSelection();
						}
					}
				);

				elem.addEventListener(
					"mousedown",
					event => {
						// Handle selection generally
						state.itemsList.forEach(
							item => {
								const isItemSelected = item.isSelected();
								if (isItemSelected
									&& item !== event.target
									&& item !== event.target.parentElement) {
									item.unselect();
								}
							}
						);

						const diagramAreaClickedDirectly
							= event.target === event.currentTarget;
						if (diagramAreaClickedDirectly) {
							// "Drag selection" enabled only if the "mousedown"
							//	event happened on the diagram area element
							//	directly, so that it be possible to drag
							//	elements instead of simultaneously
							//	"drag-selecting"

							// Handle "drag selection"
							const dragSelectionArea = event.currentTarget;
							const cursorClientPosition = {
								x: event.clientX,
								y: event.clientY
							};
							state.selectionStore.dragSelection
								.startDragSelection(
									dragSelectionArea, cursorClientPosition
								);
						}
					}
				);

				elem.addEventListener(
					"drop",
					event => {
						// Handle dragging (drop)

						const cursorClientPosition = {
							x: event.clientX,
							y: event.clientY
						};

						const elemToDropOnto = event.currentTarget;

						state.draggingStore.endDragging(
							elemToDropOnto, cursorClientPosition
						);

						// Handle selection after dragging

						const draggedItem = state.draggingStore.getItem();
						draggedItem.select();
					}
				);

				elem.addEventListener(
					"mousemove",
					event => {
						// Handle resizing
						const resizingPerformed
							= state.resizingStore.isResizingPerformed();
						if (resizingPerformed) {
							const cursorClientPosition = {
								x: event.clientX,
								y: event.clientY
							};
							state.resizingStore.processResizing(
								cursorClientPosition
							);
						}
					}
				);

				elem.addEventListener(
					"mouseup",
					() => {
						// Handle resizing
						const resizingPerformed
							= state.resizingStore.isResizingPerformed();
						if (resizingPerformed) {
							state.resizingStore.endResizing();
						}
					}
				);

				elem.addEventListener(
					"dragover",
					event => state.draggingStore.processDragOver(event)
				);

				elem.addEventListener(
					"dragenter",
					event => state.draggingStore.processDragEnter(event)
				);

				return elem;
			})();

		parentElem.appendChild(elem);

		return { getElem: () => elem };
	}
}
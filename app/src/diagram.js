class Diagram {
	static createWithin(parentElem) {
		if (!parentElem) {
			return undefined;
		}

		const state = {
			draggingStore: DraggingStore.create(),
			rotationStore: RotationStore.create(),
			resizingStore: ResizingStore.create(),
			selectionStore: SelectionStore.create(),
			itemsList: []
		};

		const diagramArea = DiagramArea.create(state, parentElem);
		const diagramAreaElem = diagramArea.getElem();

		const enableAllDisabledDiagramItemsButton
			= EnableAllDisabledDiagramItemsButton.create(
				event => {
					const confirmed
						= confirm(
							"Enable all disabled items? This will " +
							"display all disabled items in the places " +
							"that they were before disabling."
						);

					if (confirmed) {
						state.itemsList.forEach(
							item => {
								const itemEnabled = item.isEnabled();
								if (!itemEnabled) {
									item.enable();
								}
							}
						);

						disableAllCurrentDiagramItemsButtonElem.disabled
							= false;

						event.currentTarget.disabled = true;
					}
				},
				parentElem
			);
		const enableAllDisabledDiagramItemsButtonElem
			= enableAllDisabledDiagramItemsButton.getElem();

		const disableAllCurrentDiagramItemsButton
			= DisableAllCurrentDiagramItemsButton.create(
				event => {
					const confirmed
						= confirm(
							"Disable all currently enabled items? The " +
							"items will not be displayed any more. Under " +
							"certain conditions they could later be " +
							"enabled."
						);

					if (confirmed) {
						state.itemsList.forEach(
							item => {
								const itemEnabled = item.isEnabled();
								if (itemEnabled) {
									item.disable();
								}
							}
						);

						if (state.itemsList.length !== 0) {
							enableAllDisabledDiagramItemsButtonElem.disabled
								= false;
						}

						event.currentTarget.disabled = true;
					}
				},
				parentElem
			);
		var disableAllCurrentDiagramItemsButtonElem
			= disableAllCurrentDiagramItemsButton.getElem();

		const handleDiagramItemDraggingStarting
			= event => {
				// The following "if" is to prevent dragging and rotation
				//	at the same time
				const rotationPerformed
					= state.rotationStore.isRotationPerformed();
				if (!rotationPerformed) {
					// Handle dragging

					/**
					 * @todo The below computing of positions seems to be
					 *	inadequate if the element to drag is rotated; find out
					 *	a better way; either, think what else may add up
					 *	to inadequacy of computing the positions
					 */

					const cursorClientPosition = {
						x: event.clientX,
						y: event.clientY
					};
					const itemToDragElem = event.currentTarget;
					const itemToDrag
						= state.itemsList.find(
							item => {
								const elem = item.getElem();
								return elem === itemToDragElem;
							}
						);
					state.draggingStore.startDragging(
						cursorClientPosition, itemToDrag, diagramAreaElem
					);
				}
			};

		const handleDiagramItemSelection
			= event => {
				// Handle selection
				const clickedItemElem = event.currentTarget;
				const clickedItem
					= state.itemsList.find(
						item => {
							const elem = item.getElem();
							return elem === clickedItemElem;
						}
					);
				const clickedItemSelected = clickedItem.isSelected();
				if (!clickedItemSelected) {
					clickedItem.select();
				}
			};

		AddDiagramNodeButton.createAndInit(
			parentElem,
			() => {
				const diagramNode
					= DiagramNode.create(
						diagramAreaElem,
						event => { handleDiagramItemDraggingStarting(event); },
						event => { handleDiagramItemSelection(event); }
					);

				state.itemsList.push(diagramNode);

				const disableAllCurrentDiagramItemsButtonElem
					= disableAllCurrentDiagramItemsButton.getElem();
				disableAllCurrentDiagramItemsButtonElem.disabled = false;
			}
		);

		AddDiagramLinkButton.createAndInit(
			parentElem,
			() => {
				const diagramLink
					= DiagramLink.create(
						state,
						diagramAreaElem,
						event => { handleDiagramItemDraggingStarting(event); },
						event => { handleDiagramItemSelection(event); }
					);

				state.itemsList.push(diagramLink);

				const disableAllCurrentDiagramItemsButtonElem
					= disableAllCurrentDiagramItemsButton.getElem();
				disableAllCurrentDiagramItemsButtonElem.disabled = false;
			}
		);
	}
}
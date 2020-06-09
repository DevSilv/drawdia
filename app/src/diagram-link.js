class DiagramLink {
	static type = "diagramLink";

	static create(state, parentElem, handleDraggingStarting, handleSelection) {
		if (!state
			|| !parentElem
			|| !handleDraggingStarting
			|| !handleSelection) {
			return undefined;
		}

		const elem
			= (() => {
				class EndPoint {
					static create(state) {
						if (!state) {
							return undefined;
						}

						const elem
							= (() => {
								const elem = document.createElement("div");

								elem.classList.add("diagram-link__end-point");

								elem.addEventListener(
									"mousedown",
									event => {
										// Handle rotation and resizing
										// The below is needed in order
										//	to prevent the "dragstart" event
										//	from firing, in order not to allow
										//	rotation/resizing and dragging
										//	at the same time; for some details
										//	on why I think that the handler
										//	for the "mousedown" event is
										//	an appropriate function for that,
										//	see for example
										//	https://html.spec.whatwg.org/multipage/dnd.html#dnd
										//	(look for the word "mousedown").
										event.preventDefault();

										// Handle rotation
										const elemToRotate
											= event.currentTarget.parentElement;
										const pressedElem = event.currentTarget;
										state.rotationStore.startRotation(
											elemToRotate, pressedElem
										);

										// Handle resizing
										const cursorClientPosition = {
											x: event.clientX,
											y: event.clientY
										};
										const elemToResize
											= event.currentTarget.parentElement;
										state.resizingStore.startResizing(
											cursorClientPosition, elemToResize
										);
									}
								);

								return elem;
							})();

						return { getElem: () => elem };
					}
				}

				const elem = document.createElement("div");

				elem.classList.add("diagram-link");

				elem.style.transformOrigin = "left";

				elem.draggable = true;

				const endPoint = EndPoint.create(state);
				const endPointElem = endPoint.getElem();
				elem.appendChild(endPointElem);

				elem.addEventListener(
					"dragstart", event => { handleDraggingStarting(event); }
				);

				elem.addEventListener(
					"click", event => { handleSelection(event); }
				);

				return elem;
			})();

		parentElem.appendChild(elem);

		let enabled = true;

		let oldDisplay = undefined;

		let selected = false;

		return {
			getElem: () => elem,
			isEnabled: () => enabled,
			enable:
				() => {
					elem.style.display = `${oldDisplay}`;
					enabled = true;
				},
			disable:
				() => {
					oldDisplay = getComputedStyle(elem).display;
					elem.style.display = "none";
					enabled = false;
				},
			isSelected: () => selected,
			select:
				() => {
					elem.classList.add("selected");
					selected = true;
				},
			unselect:
				() => {
					elem.classList.remove("selected");
					selected = false;
				}
		};
	}
}
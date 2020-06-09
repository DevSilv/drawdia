class DiagramNode {
	static type = "diagramNode";

	static create(parentElem, handleDraggingStarting, handleSelection) {
		if (!parentElem || !handleDraggingStarting || !handleSelection) {
			return undefined;
		}

		const elem
			= (() => {
				class Content {
					static create() {
						const elem = (() => {
							const elem = document.createElement("div");

							elem.classList.add("diagram-node__content");

							elem.rows = 1;
							elem.cols = 1;
							elem.contentEditable = true;

							return elem;
						})();

						return { getElem: () => elem };
					}
				}

				const elem = document.createElement("div");

				elem.classList.add("diagram-node");

				elem.draggable = true;

				const content = Content.create();
				const contentElem = content.getElem();
				elem.appendChild(contentElem);

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
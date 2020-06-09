class DragSelector {
	static create(startPosition) {
		const elem
			= (() => {
				const elem = document.createElement("div");

				elem.classList.add("drag-selector");

				elem.style.left = `${startPosition.x}px`;
				elem.style.top = `${startPosition.y}px`;

				return elem;
			})();

		return { getElem: () => elem };
	}
}
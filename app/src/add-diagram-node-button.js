class AddDiagramNodeButton {
	static createAndInit(parentElem, handleClicking) {
		if (!parentElem || !handleClicking) {
			return undefined;
		}

		const elem
			= (() => {
				const elem = document.createElement("button");

				elem.classList.add("add-diagram-node-button");

				elem.textContent = "Create node";

				elem.addEventListener("click", () => { handleClicking(); });

				return elem;
			})();

		parentElem.appendChild(elem);

		return { getElem: () => elem };
	}
}
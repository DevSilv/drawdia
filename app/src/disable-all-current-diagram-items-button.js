class DisableAllCurrentDiagramItemsButton {
	static create(handleClick, parentElem) {
		if (!handleClick || !parentElem) {
			return undefined;
		}

		const elem
			= (() => {
				const elem = document.createElement("button");

				elem.classList.add("disable-all-current-diagram-items-button");

				elem.textContent = "Disable all currently enabled items";
				elem.disabled = true;

				elem.addEventListener("click", handleClick);

				return elem;
			})();

		parentElem.appendChild(elem);

		return { getElem: () => elem };
	}
}
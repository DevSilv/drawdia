class EnableAllDisabledDiagramItemsButton {
	static create(handleClick, parentElem) {
		if (!handleClick || !parentElem) {
			return undefined;
		}

		const elem
			= (() => {
				const elem = document.createElement("button");

				elem.classList.add("enable-all-disabled-diagram-items-button");

				elem.textContent = "Enable all disabled items";
				elem.disabled = true;

				elem.addEventListener("click", handleClick);

				return elem;
			})();

		parentElem.appendChild(elem);

		return { getElem: () => elem };
	}
}
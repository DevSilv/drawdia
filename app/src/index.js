document.addEventListener(
	"DOMContentLoaded",
	() => {
		/**
		 * @todo Why doesn't it work without the wrapper of a function?
		 * (document.body === null)
		 */
		Diagram.createWithin(document.body);
	}
);
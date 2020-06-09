class ResizingStore {
	static create() {
		let resizingPerformed = false;
		let elem = undefined;
		const cursorMoveStartPosition = {
			x: undefined,
			y: undefined
		};

		return {
			isResizingPerformed: () => resizingPerformed,
			startResizing:
				(cursorPosition, elemToResize) =>
					cursorPosition
					&& elemToResize
					&& (() => {
						elem = elemToResize;

						cursorMoveStartPosition.x = cursorPosition.x;
						cursorMoveStartPosition.y = cursorPosition.y;

						// Assigning the result of invokation
						//	of the "getComputedStyle" method happens here
						//	in order that the "elem.style.width" property
						//	be not empty, and this is to avoid doing
						//	that on every mouse move in the "processResizing"
						//	method (the "getComputedStyle" method is
						//	most probably reflow-causing)
						const elemComputedStyle = getComputedStyle(elem);
						elem.style.width = elemComputedStyle.width;

						resizingPerformed = true;
					})(),
			processResizing:
				cursorMoveEndPosition =>
					cursorMoveEndPosition
					&& (() => {
						const currentElemLength
							= Number.parseFloat(elem.style.width);

						const newElemLength
							= Utils.calculateEuclideanDistanceBetween(
								cursorMoveStartPosition,
								{
									x:
										currentElemLength
										+ cursorMoveEndPosition.x,
									y:
										cursorMoveEndPosition.y
								}
							);

						elem.style.width = `${newElemLength}px`;

						cursorMoveStartPosition.x = cursorMoveEndPosition.x;
						cursorMoveStartPosition.y = cursorMoveEndPosition.y;
					})(),
			endResizing:
				() => {
					elem = undefined;

					cursorMoveStartPosition.x = undefined;
					cursorMoveStartPosition.y = undefined;

					resizingPerformed = false;
				}
		};
	}
}
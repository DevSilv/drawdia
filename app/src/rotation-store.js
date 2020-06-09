class RotationStore {
	static create() {
		let rotationPerformed = false;
		let rotatedElem = undefined;
		let pressedElem = undefined;
		// Bug - weird angle jumps while rotating (e.g. from 70deg to 160deg
		//	in the interval of only few miliseconds), which make the act
		//	of rotation no longer possibe to rely on. The bug is probably caused
		//	by having all the computations being done every mouse move. I wonder
		//	why?
		// It seems that it was caused by something called "reflow". I have not
		//	yet checked thoroughly what it is. But I have decided to do it
		//	already, since it helps to move "reflow-heavy" operations
		//	- if I can characterize the invokations of the functions
		//	"getBoundingClientRect()" and "getComputedStyle()" to be such -
		//	from the "process" method (intended to be invoked
		//	within the "mousemove" event handler) to the "init" method,
		//	. Therefore, I needed to introduce
		//	the following new fields, "rotatedElemSize"
		//	and "rotatedElemTransformOriginClientPosition". I should not forget
		//	to update them during resizing.
		// More on that to read - see the README
		const rotatedElemSize = { width: undefined, height: undefined };
		const rotatedElemTransformOriginClientPosition = {
			x: undefined, y: undefined
		};

		return {
			isRotationPerformed: () => rotationPerformed,
			startRotation:
				(re, pe) =>
					re
					&& pe
					&& (() => {
						rotationPerformed = true;
						rotatedElem = re;
						pressedElem = pe;

						const rotatedElemComputedStyle
							= getComputedStyle(rotatedElem);
						rotatedElemSize.width
							= Number.parseFloat(rotatedElemComputedStyle.width);
						rotatedElemSize.height
							= Number.parseFloat(
								rotatedElemComputedStyle.height
							);

						const rotatedElemBoundingClientRect
							= rotatedElem.getBoundingClientRect();
						const rotatedElemTransformOriginClientX
							= rotatedElemBoundingClientRect.left
							+ rotatedElemSize.width;
						const rotatedElemTransformOriginClientY
							= rotatedElemBoundingClientRect.top
							+ rotatedElemSize.height / 2;
						rotatedElemTransformOriginClientPosition.x
							= rotatedElemTransformOriginClientX;
						rotatedElemTransformOriginClientPosition.y
							= rotatedElemTransformOriginClientY;

						pressedElem.classList.add("highlighted");
					})(),
			processRotation:
				cursorClientPosition =>
					cursorClientPosition
					&& (() => {
						const rotatedElemTransformOriginDistanceToCursorX
							= cursorClientPosition.x
							- rotatedElemTransformOriginClientPosition.x;
						const rotatedElemTransformOriginDistanceToCursorY
							= cursorClientPosition.y
							- rotatedElemTransformOriginClientPosition.y;
						const angleRad
							= Math.atan2(
								rotatedElemTransformOriginDistanceToCursorY,
								rotatedElemTransformOriginDistanceToCursorX
							);
						const angleDeg = Utils.convertRadToDeg(angleRad);

						rotatedElem.style.transform = `rotate(${angleDeg}deg)`;
					})(),
			endRotation:
				() => {
					pressedElem.classList.remove("highlighted");

					rotationPerformed = false;
					rotatedElem = undefined;
					pressedElem = undefined;
				}
		};
	}
}
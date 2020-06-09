class Utils {
	static createGuideLineElemsPair(position, color) {
		if (!position || !color) {
			return undefined;
		}

		const createElem
			= (size, position, color) => {
				if (!size || !position || !color) {
					return undefined;
				}

				const elem = document.createElement("div");

				elem.style.backgroundColor = `${color}`;
				elem.style.position = "absolute";
				elem.style.width = `${size.width}`;
				elem.style.height = `${size.height}`;
				elem.style.top = `${position.y}`;
				elem.style.left = `${position.x}`;

				return elem;
			};

		return [
			createElem(
				{ width: "100vw", height: "1px" },
				{ x: "0", y: position.y + "px" },
				color
			),
			createElem(
				{ width: "1px", height: "100vh" },
				{ x: position.x + "px", y: "0" },
				color
			)
		];
	}

	static calculateAngleDeg(oppositeSide, hypotenuse) {
		if (oppositeSide < 0 || hypotenuse <= 0 || oppositeSide > hypotenuse) {
			return undefined;
		}

		let angleDeg = undefined;

		const sinRad = oppositeSide / hypotenuse;
		const angleRad = Math.asin(sinRad);
		angleDeg = angleRad / Math.PI * 180;

		return angleDeg;
	}

	static calculateAngleFromCosineRule(side1, side2, sideOppositeToAngle) {
		if (side1 === undefined
			|| side1 === null
			|| side2 === undefined
			|| side2 === null
			|| sideOppositeToAngle === undefined
			|| sideOppositeToAngle === null) {
			return undefined;
		}

		const angleRad
			= Math.acos(
				(
					Math.pow(side1, 2)
					+ Math.pow(side2, 2)
					- Math.pow(sideOppositeToAngle, 2)
				)
				/ (2 * side1 * side2)
			);

		return angleRad;
	}

	static convertDegToRad(angleDeg) {
		if (angleDeg === undefined || angleDeg === null) {
			return undefined;
		}

		const angleRad = angleDeg / 180 * Math.PI;

		return angleRad;
	}

	static convertRadToDeg(angleRad) {
		if (angleRad === undefined || angleRad === null) {
			return undefined;
		}

		const angleDeg = angleRad * 180 / Math.PI;

		return angleDeg;
	}

	static calculateEuclideanDistanceBetween(position1, position2) {
		if (position1 === undefined || position1 === null
			|| position2 === undefined || position2 === null) {
			return undefined;
		}

		const distance
			= Math.sqrt(
				Math.pow(position1.x - position2.x, 2)
				+ Math.pow(position1.y - position2.y, 2)
			);

		return distance;
	}

	static isNumberBetween(n, n1, n2) {
		if (n === undefined || n === null
			|| n1 === undefined || n1 === null
			|| n2 === undefined || n2 === null) {
			return undefined;
		}

		let isBetween = undefined;

		isBetween
			= Math.abs(n1 - n2) > Math.abs(n - n1)
			&& Math.abs(n1 - n2) > Math.abs(n - n2);

		return isBetween;
	}

	static isPositionBetween(position, position1, position2) {
		if (position === undefined || position === null
			|| position1 === undefined || position1 === null
			|| position2 === undefined || position2 === null) {
			return undefined;
		}

		let isBetween = undefined;

		isBetween
			= Utils.isNumberBetween(position.x, position1.x, position2.x)
			&& Utils.isNumberBetween(position.y, position1.y, position2.y);

		return isBetween;
	}
}
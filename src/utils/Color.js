const Color = {
	invertColor: (hex, bw) => {
		if (hex.indexOf('#') === 0) hex = hex.slice(1);

		if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];

		if (hex.length !== 6) throw new Error('Invalid HEX color.');

		let r = parseInt(hex.slice(0, 2), 16);
		let g = parseInt(hex.slice(2, 4), 16);
		let b = parseInt(hex.slice(4, 6), 16);

		if (bw)
			// http://stackoverflow.com/a/3943023/112731
			return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF';

		r = (255 - r).toString(16);
		g = (255 - g).toString(16);
		b = (255 - b).toString(16);

		const padZero = str => {
			return (new Array(2).join('0') + str).slice(-2);
		};

		return `#${padZero(r)}${padZero(g)}${padZero(b)}`;
	},
};

export default Color;

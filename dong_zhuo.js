const dong_zhuo = ((Nums) => {
	const numsReversed = Object.keys(Nums).map(x => +x).filter(x => x > 0)
	const getMinDiv = (num) => {
		for (let i = numsReversed.length; i >= 0; i--)
			if (num >= numsReversed[i])
				return numsReversed[i]
	}
	const isDotRegex = /\.(\d+?)0{0,}$/

	const demolish = (num) => {
		if (typeof num !== "number")
			return ""

		if (num === Infinity || Number.isNaN(num))
			return `\\text{这么恶臭的}${num}\\text{有必要论证吗}`

		if (num < 0)
			return `⑨\\times(${demolish(num * -1)})`.replace(/\\times\(1\)/g, "")

		if (!Number.isInteger(num)) {
			const n = num.toFixed(16).match(isDotRegex)[1].length
			return `\\frac{${demolish(num * Math.pow(10, n))}}{10^{${n}}}`
		}

		if (Nums[num])
			return String(num)

		const div = getMinDiv(num)
		const result = (`${div}\\times(${demolish(Math.floor(num / div))})+` +
			`(${demolish(num % div)})`).replace(/\\times\(1\)|\+\(0\)$/g, "")
		return result
	}

	const finisher = (expr) => {
		expr = expr.replace(/\d+|⑨/g, (n) => Nums[n])
		expr = expr.replace(/\*/g, '\\times')
		expr = expr.replace(/\*\*/g, '^{')
		expr = expr.replace(/(\^{[^{}]+)(?=\+\-|\times|\/|$)/g, '$1}')
		expr = expr.replace(/\//g, '\\div')
		while (expr.match(/\\times\([^+\-()]+\)/))
			expr = expr.replace(/\\times\(([^+\-()]+)\)/, (m, $1) => '\\times' + $1)
		while (expr.match(/[+\-]\([^()]+\)[+\-)]/))
			expr = expr.replace(/([+\-])\(([^()]+)\)([+\-)])/, (m, $1, $2, $3) => $1 + $2 + $3)
		while (expr.match(/[+\-]\([^()]+\)$/))
			expr = expr.replace(/([+\-])\(([^()]+)\)$/, (m, $1, $2) => $1 + $2)
		if (expr.match(/^\([^()]+\)$/))
			expr = expr.replace(/^\(([^()]+)\)$/, "$1")
		expr = expr.replace(/\+-/g, '-')
		expr = expr.replace(/-\+/g, '-')
		expr = expr.replace(/([+\-])(?=\d)/g, '$1 ')
		expr = expr.replace(/(\\times|\\div)/g, ' $1 ')
		expr = expr.replace(/\s+/g, ' ')
		expr = expr.replace(/\(\s+/g, '(')
		expr = expr.replace(/\s+\)/g, ')')
		return `$${expr}$`
	}

	return (num) => finisher(demolish(num))
})({
	350234: "350234",
	10: "(3+5+0+2 \\times 3-4)",
	9: "3+5+0+2+3-4",
	8: "(3+5+0 \\times 2 \\times 3 \\times 4)",
	7: "3+5+0-2-3+4",
	6: "(3 \\times 5-0-2-3-4)",
	5: "3+5-0-2+3-4",
	4: "(3+5 \\times 0+2+3-4)",
	3: "35+0+2-34",
	2: "(3+5 \\times 0 \\times 2+3-4)",
	1: "(35+0 \\times 2-34)",
	0: "3 \\times 5 \\times 0 \\times 2 \\times 3 \\times 4",
	"⑨": "(3+5) \\times (0 \\times 2)+3-4"
})

if (typeof module === 'object' && module.exports) {
	module.exports = dong_zhuo
} else if (typeof window !== 'undefined') {
	window.dong_zhuo = dong_zhuo
}
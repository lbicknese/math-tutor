// Ordinarily, you'd generate this data from markdown files in your
// repo, or fetch them from a database of some kind. But in order to
// avoid unnecessary dependencies in the starter template, and in the
// service of obviousness, we're just going to leave it here.

// This file is called `_posts.js` rather than `posts.js`, because
// we don't want to create an `/blog/posts` route — the leading
// underscore tells Sapper not to do that.
import Chance from 'chance'
import { Decimal } from 'decimal.js'

const chance = new Chance()

const posts = [
	{
		title: 'Add and Subtract Decimals',
		slug: 'add-and-subtract-decimals',
		html: `
			
		`,
		generate: () => {
			const x = new Decimal(chance.floating({ fixed: 3, min: -1000, max: 1000 }))
			const y = new Decimal(chance.floating({ fixed: 3, min: -1000, max: 1000 }))
			const o = chance.pickone(['+', '-']) // '*', '/'
			let a
			if (o === '+') {
				a = x.plus(y)
			} else if (o === '-') {
				a = x.minus(y)
			} else if (o === '*') {
				a = x.times(y).toDecimalPlaces(3)
			} else {
				a = x.dividedBy(y).toDecimalPlaces(3)
			}
			return {
				id: chance.guid(),
				prompt: `${x} ${o} ${y}`,
				answer: a.toString()
			}
		}
	},

	{
		title: 'Add and Subtract Fractions',
		slug: 'add-and-subtract-fractions',
		html: `
			
		`,
		generate: () => {
			const xNum = new Decimal(chance.integer({ min: 1, max: 50 }))
			const xDen = new Decimal(chance.integer({ min: 1, max: 50 }))
			const yNum = new Decimal(chance.integer({ min: 1, max: 50 }))
			const yDen = new Decimal(chance.integer({ min: 1, max: 50 }))
			const o = chance.pickone(['+', '-']) // '*', '/'
			let a
			if (o === '+') {
				a = xNum.dividedBy(xDen).plus(yNum.dividedBy(yDen)).toDecimalPlaces(3)
			} else if (o === '-') {
				a = xNum.dividedBy(xDen).minus(yNum.dividedBy(yDen)).toDecimalPlaces(3)
			} else if (o === '*') {
				a = xNum.dividedBy(xDen).times(yNum.dividedBy(yDen)).toDecimalPlaces(3)
			} else {
				a = xNum.dividedBy(xDen).dividedBy(yNum.dividedBy(yDen)).toDecimalPlaces(3)
			}
			return {
				id: chance.guid(),
				prompt: `${xNum}/${xDen} ${o} ${yNum}/${yDen}`,
				answer: a.toString()
			}
		}
	},

	// {
	// 	title: 'Compare Fractions',
	// 	slug: 'compare-fractions',
	// 	html: `
			
	// 	`
	// },

	{
		title: 'Order Fractions',
		slug: 'order-fractions',
		html: `
			
		`,
		generate: () => {
			const xNum = new Decimal(chance.integer({ min: 1, max: 50 }))
			const xDen = new Decimal(chance.integer({ min: 1, max: 50 }))
			const yNum = new Decimal(chance.integer({ min: 1, max: 50 }))
			const yDen = new Decimal(chance.integer({ min: 1, max: 50 }))
			const zNum = new Decimal(chance.integer({ min: 1, max: 50 }))
			const zDen = new Decimal(chance.integer({ min: 1, max: 50 }))
			const values = [[xNum, xDen], [yNum, yDen], [zNum, zDen]]
			const a = [...values].sort((a, b) => {
				const aVal = a[0].dividedBy(a[1])
				const bVal = b[0].dividedBy(b[1])
				if (aVal - bVal > 0) {
					return 1
				} else if (aVal - bVal < 0) {
					return -1
				}
				return 0
			})
			return {
				id: chance.guid(),
				prompt: values.map(v => `${v[0]}/${v[1]}`).join(', '),
				answer: a.map(v => `${v[0]}/${v[1]}`).join(', ')
			}
		}
	}
];

posts.forEach(post => {
	post.html = post.html.replace(/^\t{3}/gm, '');
});

export default posts;

const rp = require('request-promise')
const cheerio = require('cheerio')

rp('https://dota2.gamepedia.com/Abaddon')
	.then( html => {
		process.stdout.write('loading')
		let $ = cheerio.load(html)
		let attributes = [];
		$('table.evenrowsgray > tbody > tr > td').map( (i, obj) => {
			process.stdout.write('.')
			attributes.push($(obj).text().replace("\n", "").replace("%", ""))
		})
		$('table.oddrowsgray > tbody > tr > td').map( (i, obj) => {
			process.stdout.write('.')
			attributes.push($(obj).text().replace("\n", "").replace("%", ""))
		})
		console.log('\n')
		attributes.map((attr, i) => {
			console.log(i, attr)
		})
		console.log($('table.evenrowsgray > tbody > tr > td').text())
	})
	.catch( err => console.log(err))

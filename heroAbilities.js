const rp = require('request-promise')
const cheerio = require('cheerio')

rp('https://dota2.gamepedia.com/Abaddon')
	.then( html => {
		let $ = cheerio.load(html)
		$('#Abilities:parent').next('p').next('div > div > div').eq(1)
		// console.log($("a[title='Abilities']").eq(0).text())
	})
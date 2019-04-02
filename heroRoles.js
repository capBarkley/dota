const rp = require('request-promise')
const cheerio = require('cheerio')

rp('https://dota2.gamepedia.com/Abaddon')
	.then( html => {
		let $ = cheerio.load(html)
		let  roles = [];
		$("a[title='Role']").map( (i, obj) => {
			roles.push($(obj).text())
		})
		console.log(roles);
	})
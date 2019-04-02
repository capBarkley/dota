const rp = require('request-promise')
const request = require('request')
const cheerio = require('cheerio')
const express = require('express')
const app = express()
const port = 3000

let heroes = []

rp('https://dota2.gamepedia.com/Heroes')
	.then( html => {
		let $ = cheerio.load(html)
		let heroesData = []
		$('tbody > tr > td > div > div > a').map( (index, element) => {
			let hero = {}
			hero.id = index
			hero.name = element.attribs.title
			hero.url = `https://dota2.gamepedia.com${element.attribs.href}`
			heroesData.push(hero)
		})
		process.stdout.write('loading')
		getHeroPA(heroesData)
	})
	.catch( err => console.log(err))

const getHeroPA = heroesData => {
	let i = 0
	const next = () => {
		if (i < heroesData.length) {
			rp(heroesData[i].url)
				.then( html => {
					process.stdout.write('.')
					let $ = cheerio.load(html)
					let attributes = []
					$('table.evenrowsgray > tbody > tr > td').map( (i, obj) => {
						process.stdout.write('.')
						attributes.push($(obj).text().replace("\n", "").replace("%", ""))
					})
					$('table.oddrowsgray > tbody > tr > td').map( (i, obj) => {
						process.stdout.write('.')
						attributes.push($(obj).text().replace("\n", "").replace("%", ""))
					})

					let  roles = []
					$("a[title='Role']").map( (i, obj) => {
						roles.push($(obj).text())
					})

					heroes[i] = {
						id: heroesData[i].id,
						name: heroesData[i].name,
						url: heroesData[i].url,
						imgUrl: $('.infobox > tbody > tr > td > a > img').attr('src'),
						primaryAttribute: $('#primaryAttribute > a').attr('title'),
						health: Number(attributes[1]),
						healthReg: Number(attributes[5]),
						mana: Number(attributes[13]),
						manaReg: Number(attributes[17]),
						armor: Number(attributes[25]),
						attackSpeed: Number(attributes[29]),
						damage: attributes[37],
						moveSpeed: Number(attributes[40]),
						attackRange: (attributes[43] <= 300) ? 'melee' : 'range',
						roles: roles
					}
					++i
					return next()
				})
		} else {
			printData();
		}
	}
	return next()
}

const printData = () => {
	app.get('/', (req, res) => res.send(JSON.stringify(heroes)))

	app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}
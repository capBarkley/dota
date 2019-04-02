const rp = require('request-promise');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

let heroes = [];

rp('https://dota2.gamepedia.com/Heroes')
	.then( html => {
		let $ = cheerio.load(html);
		let heroesData = [];
		$('tbody > tr > td > div > div > a').map( (index, element) => {
			let hero = {};
			hero.id = index;
			hero.name = element.attribs.title;
			hero.url = `https://dota2.gamepedia.com${element.attribs.href}`;
			heroesData.push(hero);
		})
		process.stdout.write('loading');
		getHeroPA(heroesData);
	})
	.catch( err => console.log(err));

const getHeroPA = heroesData => {
	let i = 0;
	const next = () => {
		if (i < heroesData.length) {
			rp(heroesData[i].url)
				.then( html => {
					process.stdout.write('.');
					let $ = cheerio.load(html);
					heroes[i].id = heroesData[i].id;
					heroes[i].name = heroesData[i].name;
					heroes[i].url = heroesData[i].url;
					heroes[i].primaryAttribute = $('#primaryAttribute > a').attr('title');
					++i;
					return next();
				})
		} else {
			printData();
		}
	}
	return next();
}

const printData = () => {
	console.log(heroes);
}
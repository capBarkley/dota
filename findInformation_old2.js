const rp = require('request-promise');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

//Hero attributes
// rp('https://dota2.gamepedia.com/Abaddon')
// 	.then( html => {
// 		let $ = cheerio.load(html);
// 		let attributes = [];
// 		$('table.evenrowsgray > tbody > tr > td').map( (i, obj) => {
// 			attributes.push($(obj).text().replace("\n", "").replace("%", ""));
// 		})
// 		console.log(attributes);
// 		console.log($('table.evenrowsgray > tbody > tr > td').text());
// 	})
// 	.catch( err => console.log(err));

//Creating a hero list
let heroes = [];

const consoleHeroes = () => {
	console.log(heroes);
}

rp('https://dota2.gamepedia.com/Heroes')
	.then( html => {
		console.log('Starting first then...');
		let $ = cheerio.load(html);
		$('tbody > tr > td > div > div > a').map( (index, element) => {
			let hero = {};
			hero.id = index;
			hero.name = element.attribs.title;
			hero.url = `https://dota2.gamepedia.com${element.attribs.href}`;
			heroes.push(hero);
		})
		console.log("First then ends");
		return heroes;
	})
	.then( result => {
		heroes = [];
		console.log('Starting second then...');
		result.map( element => {
			let hero = {};
			request(element.url, (error, response, body) => {
				let $ = cheerio.load(body);
				hero.id = element.id;
				hero.name = element.name;
				hero.url = element.url;
				hero.primaryAttribute = $('#primaryAttribute > a').attr('title');
				heroes.push(hero);
			})
		})
		return heroes;
		console.log("Second then ends");
	})
	.then( result => console.log(result))
	.catch( err => console.log(err));

// setTimeout( consoleHeroes, 10000);
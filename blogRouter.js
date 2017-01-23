const express = require('express');
const router = express.Router();

const {BlogPosts} = require('./models');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

BlogPosts.create('The Only Book', 'Everything', 'Matthew Brando', Date.now());
BlogPosts.create('The Jungle Book', 'A kid and animals', 'Some person', Date.now());

function checkFields(requestBody, requiredFields){
	for(let i = 0; i <requiredFields.length; i++){
		const field = requiredFields[i];
		if(!(field in requestBody)){
			const message = `\`${field}\` property missing in request.`;
			console.error(message);
			return res.status(400).send(message);
		}
	}
}

router.get('/', (req, res) => {
	res.json(BlogPosts.get());
});

router.get('/:id', (req, res) => {
	res.json(BlogPosts.get(req.params.id));
});

router.post('/', jsonParser, (req, res) => {
	checkFields(req.body, ['title', 'content', 'author']);
	res.status(201).json(BlogPosts.create(
		req.body.title,
		req.body.content,
		req.body.author,
		req.body.publishDate || null
	));
});

router.delete('/:id', (req, res) => {
	BlogPosts.delete(req.params.id);
	console.log(`Deleted blog post with ID of \`${req.params.id}\``);
	res.status(204).end();
});

router.put('/:id', jsonParser, (req, res) => {
	checkFields(req.body, ['title', 'content', 'author']);
	if(req.params.id !== req.body.id){
		const message = `Path id \`${req.params.id}\` and request body id`
		 `\`${req.body.id}\` must be the same.`;
		console.error(message);
		res.status(400).send(message);
	}
	res.status(200).json(BlogPosts.update({
		id: req.body.id,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: req.body.publishDate || null
	}));
});

module.exports = router;
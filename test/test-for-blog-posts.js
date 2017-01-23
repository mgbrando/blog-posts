const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Blog Posts', function(){

	before(function(){ return runServer(); });
	after(function(){ return closeServer(); });

	it('should retrieve blog posts on GET with no parameters', function(){
		return chai.request(app)
				.get('/blog-posts')
				.then(function(res){
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.be.a('array');

					res.body.length.should.be.at.least(1);

					const expectedKeys = ['title', 'content', 'author', 'publishDate'];
					res.body.forEach(function(recipe){
						recipe.should.be.a('object');
						recipe.should.include.keys(expectedKeys);
					});
				});
	});

	it('should get a blog post on GET with an id parameter', function(){
		return chai.request(app)
				.get('/blog-posts')
				.then(function(res){
					return chai.request(app)
						.get(`/blog-posts/${res.body[0].id}`)
						.then(function(res){
							res.should.have.status(200);
							res.should.be.json;
							res.body.should.be.a('object');
							res.body.should.include.keys('title', 'content', 'author', 'publishDate');
							res.body.id.should.not.be.null;
						});
				});
	});

	it('should create a blog post on POST with a publishDate given', function(){
		const newBlogPost = {title: "Chicken Soup for the Soul", content: "Feel good stuff.", author: "Nice Person", publishDate: Date.now()};
		return chai.request(app)
				.post('/blog-posts')
				.send(newBlogPost)
				.then(function(res){
					res.should.have.status(201);
					res.should.be.json;
					res.body.should.be.a('object');
					res.body.should.include.keys('id', 'title', 'content', 'author', 'publishDate');
					res.body.id.should.not.be.null;
					res.body.should.deep.equal(Object.assign(newBlogPost, {id: res.body.id}));
				});
	});

	it('should create a blog post on POST without a publishDate given', function(){
		const newBlogPost = {title: "Chicken Soup for the Soul", content: "Feel good stuff.", author: "Nice Person"};
		return chai.request(app)
				.post('/blog-posts')
				.send(newBlogPost)
				.then(function(res){
					res.should.have.status(201);
					res.should.be.json;
					res.body.should.be.a('object');
					res.body.should.include.keys('id', 'title', 'content', 'author', 'publishDate');
					res.body.id.should.not.be.null;
				});
	});

	it('should delete a blog post on DELETE', function(){
		return chai.request(app)
				.get('/blog-posts')
				.then(function(res){
					return chai.request(app)
							.delete(`/blog-posts/${res.body[0].id}`)
							.then(function(res){
								res.should.have.status(204);
							});
				});
	});

	it('should update a blog post on PUT', function(){
		const updatedBlogPost = {title: "Chicken Soup for the Soul", content: "Feel good stuff.", author: "Nice Person", publishDate: Date.now()};
		return chai.request(app)
				get('/blog-posts')
				.then(function(res){
					updatedBlogPost.id = res.body[0].id;
					return chai.request(app)
							.put(`/blog-posts/${updatedBlogPost.id}`)
							.send(updatedBlogPost)
							.then(function(res){
								res.should.have.status(200);
								res.should.be.json;
								res.should.be.a('object');
								res.should.deep.equal(updatedBlogPost);
							});
				});
	});
});
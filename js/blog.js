$(function() {

	Parse.$ = jQuery;

	// Replace this line with the one on your Quickstart Guide Page
    Parse.initialize("GhgXD1GnKrVFcp8tyfZuEIS70GTVYQX0YAj8dVoP", "bNpSjkh7g1ntEO2JPeVTS9VsMGSn3fVzJWVNu3eo");
	

	var Blog = Parse.Object.extend("Blog"),
		Blogs = Parse.Collection.extend({
			model: Blog,
            query: (new Parse.Query(Blog)).descending('createdAt')
		}),
		BlogsView = Parse.View.extend({
			template: Handlebars.compile($('#blogs-tpl').html()),
			render: function() { 
				var collection = { blog: this.collection.toJSON() };
				this.$el.html(this.template(collection));
			}
		});
		blogs = new Blogs();

		blogs.fetch({
			success: function(blogs) {
				var blogsView = new BlogsView({ collection: blogs });
				blogsView.render();
				$('.main-container').html(blogsView.el);
			},
			error: function(blogs, error) {
				console.log(error);
			}
		});

});
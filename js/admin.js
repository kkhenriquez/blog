$(function() {

	Parse.$ = jQuery;

	// Replace this line with the one on your Quickstart Guide Page
    Parse.initialize("GhgXD1GnKrVFcp8tyfZuEIS70GTVYQX0YAj8dVoP", "bNpSjkh7g1ntEO2JPeVTS9VsMGSn3fVzJWVNu3eo");
  
  
  var LoginView = Parse.View.extend({
    template: Handlebars.compile($('#login-tpl').html()),
    events: {
      'submit .form-signin': 'login'
    },
    login: function(e) {
      
      //prevent default
      e.preventDefault();
      
      //Get data
      var data = $(e.target).serializeArray(),
          username = data[0].value,
          password = data[1].value;
      
      //Call parse login
      Parse.User.logIn(username, password, {
        //If matches
        success: function(user) {
          blogRouter.navigate('admin', { trigger: true });
        },
        //error
        error: function(user, error) {
          console.log(error);
        }
      });
    },
    render: function(){
      this.$el.html(this.template());
    }
  }),
      WelcomeView = Parse.View.extend({
        template: Handlebars.compile($('#welcome-tpl').html()),
        events: {
          'click .add-blog': 'add'
        },
        add: function(){
          blogRouter.navigate('add', { trigger: true });
        },
        //Estar pendiente aqui
        render: function(){
          var attributes = this.model.toJSON();
          this.$el.html(this.template(attributes));
        }
      }),
      AddBlogView = Parse.View.extend({
        template: Handlebars.compile($('#add-tpl').html()),
        events: {
          'submit .form-add': 'submit'
        },
        
        submit: function(e){
          //Prevent default submit event
          e.preventDefault();
          
          var data = $(e.target).serializeArray(),
              blog = new Blog();
          
          blog.create(data[0].value, data[1].value);
        },
        render: function(){
          this.$el.html(this.template());
        }
      });
  
  var Blog = Parse.Object.extend('Blog', {
    create: function(title, content) {
      this.save({
        'title': title,
        'content': content,
        'author': Parse.User.current(),
        'authorName': Parse.User.current().get('username'),
        'time': new Date().toDateString()
      }, {
        success: function(blog) {
          alert('You added a new blog: ' + blog.get('title'));
        },
        error: function(blog, error) {
          console.log(blog);
          console.log(error);
        }
      });
    }
  });
  
  var Blogs = Parse.Collection.extend({
    model: Blog
  }),
      BlogsAdminView = Parse.View.extend({
        template: Handlebars.compile($('#blogs-admin-tpl').html()),
        render: function() {
          var collection = { blog: this.collection.toJSON() };
          this.$el.html(this.template(collection));
        }
      });
  
  var BlogRouter = Parse.Router.extend({
    
    //Here you can defined shared variables
    initialize: function(options){
      this.blogs = new Blogs();
    },
    
    //This runs when we start the router. Just leave it forn now
    start: function(){
      Parse.history.start({pushState: true});
      this.navigate('admin', { trigger: true });
    },
      
      //This is where you map functions to urls
      //Just add '{{URL pattern}}': '{{function name}}'
    routes: {
      'admin': 'admin',
      'login': 'login',
      'add': 'add',
      'edit/:url': 'edit'
    },
        
    admin: function() {
        
        //This is the current user in Parse
        var currentUser = Parse.User.current();
        
        if ( !currentUser ) {
          //This is how you can do url redirect in JS
          blog.Router.navigate('login', {trigger: true});
          
        } else {
          var welcomeView = new WelcomeView({model: currentUser});
          welcomeView.render();
          $('.main-container').html(welcomeView.el);
          
          //We change it to this.blogs so it stores the content for other views
          //Remember to define it in BlogRouter.initialize()
          this.blogs.fetch({
            success: function(blogs) {
              var blogsAdminView = new BlogsAdminView({ collection: blogs });
              blogsAdminView.render();
              $('.main-container').append(blogsAdminView.el);
            },
            error: function(blogs,error) {
              console.log(error);
            }
          });
        }
      },
    login: function() {
        var loginView = new LoginView();
        loginView.render();
        $('.main-container').html(loginView.el);
      },
    add: function() {
      var addBlogView = new AddBlogView();
      addBlogView.render();
      $('main-container').html(addBlogView.el);
    },
    edit: function(url) {}
      
    }),
      blogRouter = new BlogRouter();
  
  blogRouter.start();

});
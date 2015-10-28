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
          var welcomeView = new WelcomeView({model: user});
          welcomeView.render();
          $('.main-container').html(welcomeView.el);
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
          var addBlogView = new AddBlogView();
          addBlogView.render();
          $('.main-container').html(addBlogView.el)
        },
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
  
  var loginView = new LoginView();
  loginView.render();
  $('.main-container').html(loginView.el);
  
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
  
  

});
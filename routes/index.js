//var url = require('url');
var crypto = require('crypto'),
    User = require('../models/user.js'),
    Comment = require('../models/comment.js'),
    moment = require('moment');
moment.locale("zh-CN");

module.exports = function(app) {
  /*app.use(function(req,res,next){
  	var href = url.parse(req.url).href
  	if(href.search(/login/i)>0 || href.search(/reg/i)>0)
  	{
  	  if (req.session.user) {
        req.flash('error', '已登录!'); 
        res.redirect('back');
      }
  	}
  	else
  	{
  	  if (!req.session.user) {
        req.flash('error', '未登录!'); 
        res.redirect('/login');
      }
  	}
  	next();
  });*/
  app.get('/', function (req, res) {
    res.render('index', {
      title: '首页',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
  app.get('/login', function (req, res) {
    console.log(req.cookies.user);
    res.render('login', {
      title: '登录',
      user: req.cookies.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString() 
    });
  });
  app.post('/login', function (req, res) {
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');    
    User.get(req.body.username, function (err, user) {
      if (!user) {
        req.flash('error', '用户不存在!'); 
        return res.redirect('/login');
      }
      if (user.password != password) {
        req.flash('error', '密码错误!'); 
        return res.redirect('/login');
      }
      if(req.body.rember=='on')
      {
        res.cookie('user', {name : req.body.username, pass : req.body.password}, { maxAge: 1000 * 60 * 60 * 24 });       
      }
      req.session.user = user;
      req.flash('success', '登陆成功!');
      res.redirect('/');
    });
  });
  app.get('/reg', function (req, res) {
    res.render('register', {
      title: '注册',
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });
  app.post('/reg', function (req, res) {
    var name = req.body.username,
      password = req.body.password,
      password_re = req.body.password2;
      iconName = "default"+req.body.icon+".jpg";
      if (password_re != password) {
        req.flash('error', '两次输入的密码不一致!'); 
        return res.redirect('/reg');
      }
      var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
      var newUser = new User({
          name: name,
          password: password,
          email: req.body.email,
          icon: iconName
      });
      User.get(newUser.name, function (err, user) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/reg');
        }
        if (user) {
          req.flash('error', '用户已存在!');
          return res.redirect('/reg');
        }
        newUser.save(function (err, user) {
          if (err) {
            req.flash('error', err);
            return res.redirect('/reg');
          }
          req.flash('success', '注册成功!');
          res.redirect('/login');
        });
      });
  });
  app.get('/logout', function (req, res) {
    req.session.user = null;
    req.flash('success', '登出成功!');
    res.redirect('/');
  });
  app.get('/userCenter', function (req, res) {
    res.render('userCenter', {
      title: '个人中心',
      user: req.session.user
    });
  });
  app.post('/updateInfo', function (req, res) {
    var password = req.body.password,
        password_re = req.body.password2;
      if (password_re != password) {
        req.flash('error', '两次输入的密码不一致!'); 
        return res.redirect('/userCenter');
      }
      var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
      console.log(1);
      User.get(req.session.user.name, function (err, user) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/userCenter');
        }
        if (user) {
            var updateUser = new User({
              name: user.name,
              password: password,
              email: req.body.email,
              icon: user.icon
            });
            updateUser.update(function (err, user) {
              if (err) {
                req.flash('error', err);
                return res.redirect('/userCenter');
              }
              req.session.user = updateUser;
              req.flash('success', '修改成功!');
              res.redirect('/userCenter');
            });
        }
      });
  });
  app.get('/chat', function (req, res) { 
    Comment.getAll(function (err, comments) {
      if (err) {
        comments = [];
      } 
      for(var i in comments) {
        comments[i].day = moment(comments[i].day).fromNow();
        if(comments[i].reply.length>0) {
          for(var j in comments[i].reply) {
            comments[i].reply[j].day = moment(comments[i].reply[j].day).fromNow();
          }
        }
      }
      res.render('chat', {
        title: '留言',
        user: req.session.user,
        comments: comments,
        success: req.flash('success').toString(),
        error: req.flash('error').toString() 
      });
    });
  });
  app.post('/chat', function (req, res) {
    var reviewer = req.session.user,
        day = new Date(),
        content = req.body.content;
        replyId = req.body.replyId;
    if (content.length>200) {
        req.flash('error', '评论内容不能超过200个字符'); 
        return res.redirect('/chat');
    };
    var newComment = new Comment(reviewer,day,content);
    if(!replyId) {
      newComment.addComment(function (err) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/chat');
        }
        res.redirect('/chat');
      });
    }
    else {
      newComment.addReply(replyId,function (err) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/chat');
        }
        res.redirect('/chat');
      });
    }
  });
  app.get('/about', function (req, res) {
    res.render('about', {
      title: '关于',
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString() 
    });
  });

  //本路由用于测试
  app.get('/test', function (req, res) {
    /*User.get("zybbyzaa", function (err, user) {
      if (err) {
          console.log(err);
      }
      if (user) {
        var updateUser = new User({
          name: user.name,
          password: user.password,
          email: "zyb@111.com",
          icon: user.iconName
        });
        updateUser.update(function (err, user) {
          if (err) {
            console.log(err);
          }
          console.log("success update");
        });
      }
    });*/
    res.render('test', {
        title: '留言'
    });
  });
  app.post('/test', function (req, res) {
    /*User.get("zybbyzaa", function (err, user) {
      if (err) {
          console.log(err);
      }
      if (user) {
        var updateUser = new User({
          name: user.name,
          password: user.password,
          email: "zyb@111.com",
          icon: user.iconName
        });
        updateUser.update(function (err, user) {
          if (err) {
            console.log(err);
          }
          console.log("success update");
        });
      }
    });*/
    res.render('test', {
        title: '留言',
        type: req.body.type
    });
  });
};
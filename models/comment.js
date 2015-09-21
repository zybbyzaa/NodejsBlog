var mongodb = require('./db');
var ObjectID = require('mongodb').ObjectID;

function Comment(reviewer, day, content) {
  this.reviewer = reviewer;
  this.day = day;
  this.content = content;
  this.reply = [];
}

module.exports = Comment;

Comment.prototype.addComment = function(callback) {
	//要存入数据库的用户文档
  	var comment = {
      	reviewer: this.reviewer,
      	day: this.day,
      	content: this.content,
      	reply: this.reply
  	};
	//打开数据库
  	mongodb.open(function (err, db) {
	    if (err) {
	      return callback(err);
	    }
		//读取 comment 集合
	    db.collection('comment', function (err, collection) {
	      	if (err) {
	        	mongodb.close();
	        	return callback(err);//错误，返回 err 信息
	      	}
	      	//将数据插入 comment 集合
		    collection.insert(comment, {
		      	safe: true
		    }, function (err, comment) {
		        mongodb.close();
		        if (err) {
		          return callback(err);//错误，返回 err 信息
		        }
		        callback(null, comment[0]);//成功！err 为 null，并返回存储后的评论文档
		    });
	    });
  	});
};

Comment.prototype.addReply = function(_id,callback) {
	//要存入数据库的用户文档
  	var comment = {
      	reviewer: this.reviewer,
      	day: this.day,
      	content: this.content,
  	};
	//打开数据库
  	mongodb.open(function (err, db) {
	    if (err) {
	      return callback(err);
	    }
		//读取 comment 集合
	    db.collection('comment', function (err, collection) {
	      	if (err) {
	        	mongodb.close();
	        	return callback(err);//错误，返回 err 信息
	      	}
	      	//将数据插入 comment 集合
	      	console.log(this._id);
		    collection.update({
		    	"_id" : new ObjectID(_id)
		    }, {
		      	$push: {"reply": comment}
		    }, function (err, comment) {
		        mongodb.close();
		        if (err) {
		          return callback(err);//错误，返回 err 信息
		        }
		        callback(null, comment[0]);//成功！err 为 null，并返回存储后的评论文档
		    });
	    });
  	});
};

//读取文章及其相关信息
Comment.getAll = function(callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 comment 集合
    db.collection('comment', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //查询所有评论
      collection.find({}).sort({
        day: -1
      }).toArray(function (err, docs) {
        mongodb.close();
        if (err) {
          return callback(err);//失败！返回 err
        }
        callback(null, docs);//成功！以数组形式返回查询的结果
      });
    });
  });
};
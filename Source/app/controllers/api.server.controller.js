/*
 * @Author: Ngo Hung Phuc
 * @Date:   2016-11-18 20:06:26
 * @Last Modified by:   Ngo Hung Phuc
 * @Last Modified time: 2016-11-27 22:25:54
 */

var User = require('../models/user.server.model');
var Question = require('../models/question.server.model');
var Answer = require('../models/answer.server.model');
var bcrypt = require('bcrypt-nodejs');


exports.QuestionIndex = function (req, res) {
    var limitItemOnePage = 10;
    var currentPage = req.params.pageRequest || 1;
    //pagination
    Question.countQuestion({}, function (err, totalItem) {
        var numberOfPage = Math.ceil(totalItem / limitItemOnePage);
        Question.getQuestionPaginate(limitItemOnePage, currentPage,
            function (err, questions) {
                if (err) res.json({msg: err});
                else res.json({questions: questions, pages: numberOfPage});
            });
    });
};
exports.QuestionDetail = function (req, res) {
    var id = req.params.id;
    Question.getQuestionDetail(id, function (err, questionDetail) {
        if (err) res.json({found: false, msg: "Not Found"});
        else {
            Answer.getAnswerViaQuestion(id, function (err, answers) {
                if (err) res.json({success: false, msg: "Error"});
                else {
                    res.json({
                        found: true,
                        msg: "Found",
                        questionDetail: questionDetail,
                        answers: answers
                    });
                }
            });
        }
        ;
    });
};
exports.Register = function (req, res) {
    User.checkAccountExists(req.body.UsernameRegis, function (err, account) {
        User.checkEmailExists(req.body.EmailRegis, function (err, email) {
            if (err) throw err;
            if (account != null && email != null) {
                res.json({foundBoth: true});
            }
            if (account != null) {
                if (email == null) res.json({foundAccount: true});
            }
            if (email != null) {
                if (account == null) res.json({foundEmail: true});
            }
            else {
                var hashPassword = User.generateHash(req.body.PasswordRegis);
                var newUser = [{
                    'Account': req.body.UsernameRegis,
                    'Password': hashPassword,
                    'Email': req.body.EmailRegis,
                    'Level': 2
                }];

                User.createUser(newUser, function (err) {
                    if (err) throw err;
                    res.json({success: true, url: '/'});
                });
            }
        });
    });
};
exports.Login = function (req, res) {
    var username = req.body.UsernameLogin;
    var password = req.body.PasswordLogin;
    var existAccount= User.checkAccountExists(username, function (err, user) {
        if (user == null) {
            res.json({login: false});
            return;
        }
        var AuthUser = User.validPassword(password, user.Password);
        if (!AuthUser) {
            res.json({login: false});
        }
        else {
            userSession = user.Account;
            res.json({login: true,url:'/',userSession:userSession});
        }
    });

};

exports.Logout = function (req, res) {
    req.session.destroy();
    return res.redirect('/');
};

//Api for mobile
exports.QuestionIndexMobile = function (req, res) {
    Question.questionMobileIndex(function (err, questions) {
        if (err)
            return res.status(500).send();
        else
            res.send(questions);
    });
};

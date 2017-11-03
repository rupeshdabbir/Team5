/* eslint-disable */
'use strict';

let db;
const express = require('express');
const moment = require('moment');
const router = express.Router();
const mongo = require('../mongo');
const uid = require('uid2');
const XLSX = require('xlsx');

// Collections
const DATA_COLLECTION = 'userdetails';
const SURVEY_DATA_COLLECTION = 'surveydata';
const USER_SURVEY_TAKEN = 'surveytakendata';


mongo.connect((_db) => {
    db = _db;
});

router.get('/data', (req, res) => {
    db.collection(DATA_COLLECTION).find({}).toArray(function(err, docs) {
        if (err) {
            handleError(res, err.message, 'Failed to get user data.');
        } else {
            res.status(200).json(docs);
        }
    });
});

// GET for questions being taken
router.get('/questions', (req, res) => {
    db.collection(SURVEY_DATA_COLLECTION).find({}).toArray(function(err, docs) {
        if (err) {
            handleError(res, err.message, 'Failed to get questions.');
        } else {
            res.status(200).json(docs);
        }
    });
});

// GET for questions being taken
router.get('/questions/:id', (req, res) => {
    var qid = req.params.id;
    db.collection(SURVEY_DATA_COLLECTION).find({"_id": {$eq: qid}}).toArray(function(err, docs) {
        if (err) {
            handleError(res, err.message, 'Failed to get questions.');
        } else {
            res.status(200).json(docs);
        }
    });
});

// POST for surveyTaken
router.post('/surveyTaken', (req, res) => {
    console.log('inside Survey taken');
    console.log(req.body);

    const surveyId = req.body.answers.surveyId;
    const result = {};
    result[surveyId] = req.body;

    db.collection(USER_SURVEY_TAKEN).insertOne(result, function(err, doc) {
        if (err) {
            handleError(res, err.message, 'Failed to POST survey taken data.');
        } else {
            res.status(201).json(doc);
        }
    });

});


router.post('/getAllSurveys', (req, res) => {

    if(!req.body || req.body.length == 0) {
        res.status(400).send('Need teacher name');
        return;
    }
    db.collection(SURVEY_DATA_COLLECTION).find({}).toArray(function(err, docs) {
        if(err){
            console.log(err);
            res.status(500).send(err);
        } else {
            // console.log("Found the following records");
            // console.dir(docs);
            res.status(200).json(docs);
        }
    });
});

router.post('/updateSurvey', (req, res) => {

    if(!req.body || req.body.length == 0 || req.body._id) {
        res.status(400).send('Invalid survey id');
        return ;
    }

});

router.post('deleteSurvey', (req, res) => {
    if(!req.body || req.body.length == 0 || req.body._id) {
        res.status(400).send('Invalid survey id');
        return ;
    }

    db.collection(SURVEY_DATA_COLLECTION).deleteOne({ _id : req.body._id }, function(err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(201).send(result);
        }
    });
});

router.get('/download/:surveyKey', (req, res) => {
    console.log('key ' + req.params.surveyKey);
    if (!req.params.surveyKey) {
        res.status(400).send('Invalid Survey key');
    }
   /* db.collection(USER_SURVEY_TAKEN).find({'key': req.params.surveyKey}).toArray(function(err, docs) {
        if (err) {
            res.status(400).send(err);
        } else if (docs == null || docs.length == 0) {
            res.status(204).send('No Results Found!!');
        } else {
            res.status(200).json(docs);
        }
    });*/
   const data = [{
       "firstName": "Sid",
       "lastName": "Malkireddy",
       "surveyId": "1234",
       "teacherName": "Iron Man",
       "questions": [{
           "qid": 1,
           "competency": "Motivate",
           "question": "Think about how you remembered and followed directions today. What is a strategy you used to do this well?",
           "questiontype": "text",
           "answer": null
       }, {
           "qid": 2,
           "competency": "Motivate",
           "question": "I feel excited by the work in this project",
           "questiontype": "slider",
           "responseoptions": "Never, On Occasion, Some of the time, All of the time",
           "answer": "NOne of the time"
       }, {
           "qid": 3,
           "competency": "Motivate",
           "question": "What is the one thing you’d like to know about our research topic?",
           "questiontype": "text",
           "answer": "Hello "
       }, {
           "qid": 4,
           "competency": "Engage",
           "question": "We learned about a complicated community problem today. How confident are you that you can understand this challenge?",
           "questiontype": "text",
           "answer": null
       }, {
           "qid": 5,
           "competency": "Engage",
           "question": "I feel eager to participate in the activities we’re doing as part of this project",
           "questiontype": "slider",
           "responseoptions": "Not at all eager, slightly eager, somewhat eager, quite eager, extremely eager",
           "answer": null
       }, {
           "qid": 6,
           "competency": "Create",
           "question": "I am capable of learning anything",
           "questiontype": "boolean",
           "answer": "No"
       }, {
           "qid": 7,
           "competency": "Create",
           "question": "I am interested in the problems we’re exploring as part of this project",
           "questiontype": "slider",
           "responseoptions": "Never, On Occasion, Some of the time, All of the time",
           "answer": "None of the time"
       }, {
           "qid": 8,
           "competency": "Teachback",
           "question": "How confident are you that you can meet the presentation goals of this project ",
           "questiontype": "text",
           "responseoptions": "Not at all confident, slightly confident, somewhat confident,  quite confident , extremely confident",
           "answer": "Hello "
       }, {
           "qid": 9,
           "competency": "Reflect",
           "question": "Describe one way you effectively worked with your group",
           "questiontype": "text",
           "answer": null
       }]
   },
       {
           "firstName": "Sid",
           "lastName": "Someone",
           "surveyId": "1234",
           "teacherName": "Iron Man",
           "questions": [{
               "qid": 1,
               "competency": "Motivate",
               "question": "Think about how you remembered and followed directions today. What is a strategy you used to do this well?",
               "questiontype": "text",
               "answer": null
           }, {
               "qid": 2,
               "competency": "Motivate",
               "question": "I feel excited by the work in this project",
               "questiontype": "slider",
               "responseoptions": "Never, On Occasion, Some of the time, All of the time",
               "answer": "NOne of the time"
           }, {
               "qid": 3,
               "competency": "Motivate",
               "question": "What is the one thing you’d like to know about our research topic?",
               "questiontype": "text",
               "answer": "Hello "
           }, {
               "qid": 4,
               "competency": "Engage",
               "question": "We learned about a complicated community problem today. How confident are you that you can understand this challenge?",
               "questiontype": "text",
               "answer": null
           }, {
               "qid": 5,
               "competency": "Engage",
               "question": "I feel eager to participate in the activities we’re doing as part of this project",
               "questiontype": "slider",
               "responseoptions": "Not at all eager, slightly eager, somewhat eager, quite eager, extremely eager",
               "answer": null
           }, {
               "qid": 6,
               "competency": "Create",
               "question": "I am capable of learning anything",
               "questiontype": "boolean",
               "answer": "No"
           }, {
               "qid": 7,
               "competency": "Create",
               "question": "I am interested in the problems we’re exploring as part of this project",
               "questiontype": "slider",
               "responseoptions": "Never, On Occasion, Some of the time, All of the time",
               "answer": "None of the time"
           }, {
               "qid": 8,
               "competency": "Teachback",
               "question": "How confident are you that you can meet the presentation goals of this project ",
               "questiontype": "text",
               "responseoptions": "Not at all confident, slightly confident, somewhat confident,  quite confident , extremely confident",
               "answer": "Hello "
           }, {
               "qid": 9,
               "competency": "Reflect",
               "question": "Describe one way you effectively worked with your group",
               "questiontype": "text",
               "answer": null
           }]
       }
   ]
    res.status(200).json(data);
});

router.post('/postExcelData', (req, res) => {

    console.log('<<-- POST EXCEL DATA ->>');
    if(!req.body || req.body.length == 0) {
        resp.status(400).send('Invalid Survey Data');
        return;
        // handleError(res, 'Excel Parsing error', 'Size is either zero or undefined', 400);
    }
    const key = uid(5);
    let survey = {};
    survey._id = key;
    survey = Object.assign(survey, req.body);
    survey.isSurveyEnabled = survey.isSurveyEnabled ? survey.isSurveyEnabled : false;
    survey.postedOn =  moment().format('LLL');

    /*res.status(201).json(survey);*/
    db.collection(SURVEY_DATA_COLLECTION).insertOne(survey, function(err, doc) {
        if (err) {
            console.log(err);
            //handleError(res, err.message, 'Failed to POST survey taken data.');
            res.status(400).send(err);
        } else {
            res.status(201).json(survey);
        }
    });
});


router.get('/surveyResults/:surveyKey', (req, res) => {

   console.log('survey Key' + req.params.surveyKey);

    if(!req.params.surveyKey) {
        res.status(400).send('Invalid Survey Key');
    }
    db.collection().find({}).toArray(function(err, docs) {
        if (err) {
            console.log(err);
            res.status(400).send(err);
        } else {
            res.status(200).json(docs);
        }
    });
});

module.exports = router;

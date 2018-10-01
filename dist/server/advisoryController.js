const express = require('express');
const bodyParser = require('body-parser');
var router =  express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const Advisory = require('./advisory');


router.post("/Advisor", (req, res,next) => {
    console.log(req.body);
    Advisory.create(req.body).then(function(advisory){
        res.status(200).send(advisory);
    }).catch(next);
 });

router.put( '/Advisor/:name', (req,res,next) =>{
    console.log(req.params.name);
    var assestAllocations = req.body.assetAllocations;
    console.log(assestAllocations);
    var totalPercent =  parseFloat(req.body.cashHoldingPercentage);
    for( i=0; i< assestAllocations.length; i++){
        console.log(assestAllocations[i].percentage);
        totalPercent += parseFloat(assestAllocations[i].percentage);
    }
    console.log("total percent:" + totalPercent);
    if( totalPercent > 100.0){
       return res.status(400).send({errorCode: 'allocation.percentage.total.invalid'});
    }

    Advisory.findOneAndUpdate({name:req.params.name}, req.body, {new: true}, function (err, adv) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        console.log('updating..' + JSON.stringify(adv));
        if(!adv){
            Advisory.create(req.body).then(function(err, advisory){
            return res.status(200).send(advisory);
        }).catch(next);
        }
        else
            res.status(200).send(adv);
    });
});

router.get('/advisors', (req,res,next) =>{
    console.log('get all advisors..');
    var pageNo = parseInt(req.query.pageNumber) || 1;
    var perPage = parseInt(req.query.pageSize) || 10;
    if(pageNo <= 0 ) {
        response = {"error" : true,"message" : "invalid page number, should start with 1"};
        return res.json(response)
    }

    var query = {}
    query.skip= perPage * (pageNo - 1);
    query.limit = perPage;

    Advisory.count({},function(err,totalCount) {
    if(err) {
          return res.send( {"error" : true,"message" : "Error fetching data"});
    }

    Advisory.find({},{},query,function(err,data) {
        if(err) {
            response = {"error" : true,"message" : "Error fetching data"};
        } else {
            var totalPages = Math.ceil(totalCount / perPage);
            var noOfElements =  totalCount - query.skip;
            response = {"page" : data,"numberOfPages": totalPages, "pageNumber": pageNo, 
                "pageSize": perPage,
                "totalNumberOfElements":noOfElements
            };
        }
        res.json(response);
     });
    

    });
});




module.exports = router;
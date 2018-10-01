let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

let Advisor= require('../advisory');

chai.use(chaiHttp);

//Get Api validation test
describe('/GET advisors', () => {
    it('it should GET all the advisors', (done) => {
      chai.request(server)
          .get('/api/advisors?pageNumber=1&pageSize=10')
          .set('Accept', 'application/json')
          .end((err, res) => {
                res.should.have.status(200);
                //console.log(res.body);
                res.should.be.json;
                res.body.numberOfPages.should.equal(4);
            done();
          });
    });

    it('it should GET invalid url', (done) => {
        chai.request(server)
            .get('/api/advisors').
            set('Accept', 'application/json')
          .end((err, res) => {
                //console.log(res.body.error);
                res.should.have.status(200);                
            done();
          });
    });

});


// Put  Api  validation
describe('/PUT /Advisor/:name', () => {
    it('it should create/UPDATE a advisor given the name', (done) => {
        let advisor = new Advisor(
            {
                "name":"example_model_12",
                "description":"example model with tech stocks",
                "cashHoldingPercentage":15,
                "driftPercentage":18,
                "createdOn":"2017-03-01",
                "modelType":"TAXABLE",
                "rebalanceFrequency":"QUARTERLY",
                "assetAllocations":[
                   {
                      "symbol":"AAPL",
                      "percentage":35
                   },
                   {
                      "symbol":"GOOG",
                      "percentage":20
                   },
                   {
                      "symbol":"IBM",
                      "percentage":15
                   },
                   {
                      "symbol":"FB",
                      "percentage":25
                   }
                ]
             }
            )
        advisor.save((err, adv) => {
              chai.request(server)
              .put('/api/Advisor/' + advisor.name)
              .send(advisor)
              .set('Accept', 'application/json')
              .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(400);
                    res.body.should.have.property('errorCode');                   
                done();
              });
        });
    });

    it('it should fail to create a advisor given the name', (done) => {
        let advisor = new Advisor(
            {
                //"name":"example_model_12",
                "description":"example model with tech stocks",
                "cashHoldingPercentage":5,
                "driftPercentage":18,
                "createdOn":"2017-03-01",
                "modelType":"TAXABLE",
                "rebalanceFrequency":"QUARTERLY",
                "assetAllocations":[
                   {
                      "symbol":"AAPL",
                      "percentage":35
                   },
                   {
                      "symbol":"GOOG",
                      "percentage":20
                   },
                   {
                      "symbol":"IBM",
                      "percentage":15
                   },
                   {
                      "symbol":"FB",
                      "percentage":25
                   }
                ]
             }
            )
        advisor.save((err, adv) => {
              chai.request(server)
              .put('/api/Advisor/' + 'example_model_120')
              .send(advisor)
              .set('Accept', 'application/json')
              .end((err, res) => {
                    console.log(res.body);
                    res.should.have.status(422);
                    //res.body.should.have.property('errorCode');                   
                done();
              });
        });
    });
});



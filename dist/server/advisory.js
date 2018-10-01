
var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var AdvisoryReqSchema = new Schema( { 
    name: { type: String , required: [true, 'Name is required']}, 
    description: String, 
    cashHoldingPercentage: Number,
    driftPercentage:  Number, 
    createdOn: { type: Date, default: Date.now }, 
    modelType: String,
    rebalanceFrequency: String,
    assetAllocations : [{ symbol : String ,  percentage : Number}]
});


const Advisory = mongoose.model('advisory', AdvisoryReqSchema);
module.exports =  Advisory


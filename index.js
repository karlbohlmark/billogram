var Promise = require("bluebird")
var debug = require("debug")("billogram")

var promisify = Promise.promisify;
var url = require("url");
var https = require("https")

module.exports = BillogramClient

function BillogramClient(conf) {
    this.conf = conf;
}

BillogramClient.prototype.createInvoice = createInvoice
BillogramClient.prototype.sendRequest = sendRequest
BillogramClient.prototype.createCustomer = createCustomer
BillogramClient.prototype.updateCustomer = updateCustomer
BillogramClient.prototype.getCustomer = getCustomer

function getCustomer (customer_no) {
    return this.sendRequest("GET", '/customer/' + customer_no)
}

function updateCustomer (customer_no, customer) {
    return this.sendRequest("PUT", '/customer/' + customer_no, customer)
}

function createCustomer (customer) {
    return this.sendRequest("POST", '/customer', customer)
}

function createInvoice (invoice) {
    return this.sendRequest("POST", '/billogram', invoice)
}

function sendRequest(method, path, body) {
    var conf = this.conf
    if (body && typeof body != 'string') {
        body = JSON.stringify(body);
    }

    var basePath = conf.baseUrl.path;
    var hostname = conf.baseUrl.hostname;
    var options = {
      hostname: hostname,
      path: basePath + path,
      method: method,
      auth: conf.user + ":" + conf.pass,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    return new Promise(function(fulfill, reject) {
        var rejected = false;
        var req = https.request(options, function (res) {
            if (rejected) return;
            var respBody = ""
            res.on("data", function (data) {
                respBody += data;
            })
            res.on("end", function () {
                var obj = respBody;
                if (rejected) return;
                try{
                    obj = JSON.parse(respBody)
                } catch(e) {
                    debug("Failed to parse body. Fulfilling as string.")
                }
                fulfill(obj)
            })

        })
        req.on("error", function (err){
            rejected = true;
            reject(err);
        })
        if (body) {
            req.write(body)
        }
        req.end();
    })
}
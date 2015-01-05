billogram
=========

Promise based Billogram api client for node.js

# Usage
```
var billogram = require('billogram')({
  username: 'my username',
  password: 'my secret'
})
billogram.getCustomer(1).then(function (customer) {
 console.log("Got customer response: ", customer)
})
```

### billogram.getCustomer(customer_no)
### billogram.createCustomer(customerObject)
### billogram.updateCustomer(customer_no, customerProperties)
### billogram.createInvoice(invoiceObject)


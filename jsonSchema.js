{
  processing: {
      reportType: "Normal",
      commanCriteria : {dbs:[config, hr], columns:[user.id, attendance.employeeId]}
          columns: [{
              label: "Name",
              type: "simple",
              value: "config.table2.field3",
              format: [{
                  instruction: "style",
                  value: "bold"
              }, {
                  instruction: "prefix",
                  value: "Mr. "
              }]
          }, {
              label: "Total",
              type: "column derived",
              formula: "config.User.hourlyCost*hr.attendance.hours"
  },{
    label: "Total3",
    type: "column derived",
    formula: "config.User.admissioncost*hr.table4.field",

// funtion: "Multiplication",
// parameters: ["feild1", "field2"]
}]
  },

  config: {
      User:{
          fields:  [id, username, hourlyCost],
          
      }
  },

  hr: {
      attendance:{
          fields:  [employeeId, hours, date],
      }
  }
}

// DATA fetched
// Fetch1
data1 = [{id:1, username:'vishal', hourlyCost:'22'},
{id:2, username:'vishal2', hourlyCost:'12'}
{id:3, username:'vishal3', hourlyCost:'22'}
{id:4, username:'vishal4', hourlyCost:'42'}]

// Fetch2
data2 = [{employeeId:1, hours:'20', date:'22/3/22'},
{employeeId:2, hours:'10', date:'22/3/22'}
{employeeId:3, hours:'20', date:'22/3/22'}
{employeeId:4, hours:'30', date:'22/3/22'}
{employeeId:5, hours:'40', date:'22/3/22'}]


// if 1 to 1 mapping
for(let i=0;i<data1.length, i++){
  let columnValue = data1[i][]
}

{
  reportType: "Summary",
  groupBy: "product.id",
  columns: [{
      label: "Product Name",
      type: "simple",
      value: "product.name",
      format: [{
          instruction: "style",
          value: "bold"
      },{
          instruction: "prefix",
          value: "Mr. "
      }]
  },{
      label: "Total Price Average",
      field: "order.total",
      function: "AVG",
  }]
}




reportID:123
processing: {
      reportType: "Normal",
      commanCriteria : {dbs:["Accounting", "Stock"], columns:[Orders.ProductID, Product.ID]}
          columns: [{
              label: "Username",
              type: "simple",
              value: "Accounting.Order.tbl-User.userId.username",
          }, {
              label: "Qty",
              type: "simple",
              value: "Accounting.Order.Qty",
          },
          {
              label: "Total",
              type: "derived",
              value: "Accounting.Order.qty * Stock.product.price",
          },
          {
              label: "Product Name",
              type: "simple",
              value: "Stock.Product.Name",
          },
          {
              label: "Product Price",
              type: "simple",
              value: "Stock.Product.Price",
          }
          ]
}

Accounting: {
  Order:{
      fields: [Qty, Total, ProductId, userId],
      selectAs: ["Accounting.Order.Qty","","",""]
      User:{
          fields:[username],
          relation:[]
      }
  }
}

Stock: {
  Product:{
      fields: [ID, name, price]
  }
}

// data fetch
dbname, fields:["Accounting.Order.tbl-User.userId.username", "Accounting.Order.Qty", "Accounting.Order.Total"]
orders = [{qty:5, total:50, productId:12, userId:1, username:"shubham"},
          {qty:12, total:40, productId:15, userId:2, username:"shubham1"},
          {qty:11, total:54, productId:12, userId:3, username:"shubham2"}]
          
fields:["Stock.Product.Name", "Stock.Product.Price"]
Product = [{ID:15, name:"soap", price:101},
{ID:12, name:"snack", price:130},
{ID:14, name:"tv", price:107},
{ID:19, name:"ac", price:810}]

{
  15: {ID:15, name:"soap", price:101},
  12: {ID:12, name:"snack", price:130},
  14: {ID:14, name:"tv", price:107},
  19: {ID:19, name:"ac", price:810}
}

//process

// query
give me data fetch id where this fields are there


dbname
DF1 field:[1,2,3,4,5]
DF2 field:[6,7,8]

query: give me DfID where fields[2,4,5] are present
> DF1

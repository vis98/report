let schema = {
  "order_oct": {
    "customers": {
      "columns": {
        "customer_id": {
          "Type": "int",
          "isPrimaryKey": false,
          "isForeignKey": false
        },
        "customer_name": {
          "Type": "varchar(255)",
          "isPrimaryKey": false,
          "isForeignKey": false
        },
        "email": {
          "Type": "varchar(255)",
          "isPrimaryKey": false,
          "isForeignKey": false
        }
      },
      "relations": [
        {
          "to": "customers",
          "from": "orders",
          "foreignKey": "order_oct.customers.customer_id"
        }
      ]
    },
    "orders": {
      "columns": {
        "id": {
          "Type": "int",
          "isPrimaryKey": false,
          "isForeignKey": false
        },
        "productId": {
          "Type": "int",
          "isPrimaryKey": false,
          "isForeignKey": "productinv.products.product_id"
        },
        "customerId": {
          "Type": "int",
          "isPrimaryKey": false,
          "isForeignKey": "order_oct.customers.customer_id"
        },
        "total_amt": {
          "Type": "int",
          "isPrimaryKey": false,
          "isForeignKey": false
        }
      },
      "relations": []
    }
  },
  "productinv": {
    "categories": {
      "columns": {
        "category_id": {
          "Type": "int",
          "isPrimaryKey": false,
          "isForeignKey": false
        },
        "category_name": {
          "Type": "varchar(255)",
          "isPrimaryKey": false,
          "isForeignKey": false
        }
      },
      "relations": [
        {
          "to": "categories",
          "from": "product_categories",
          "foreignKey": "productinv.categories.category_id"
        }
      ]
    },
    "product_categories": {
      "columns": {
        "product_category_id": {
          "Type": "int",
          "isPrimaryKey": false,
          "isForeignKey": false
        },
        "productId": {
          "Type": "int",
          "isPrimaryKey": false,
          "isForeignKey": "productinv.products.product_id"
        },
        "categoryId": {
          "Type": "int",
          "isPrimaryKey": false,
          "isForeignKey": "productinv.categories.category_id"
        }
      },
      "relations": []
    },
    "products": {
      "columns": {
        "product_id": {
          "Type": "int",
          "isPrimaryKey": false,
          "isForeignKey": false
        },
        "product_name": {
          "Type": "varchar(255)",
          "isPrimaryKey": false,
          "isForeignKey": false
        },
        "description": {
          "Type": "text",
          "isPrimaryKey": false,
          "isForeignKey": false
        },
        "unit_price": {
          "Type": "decimal(10,2)",
          "isPrimaryKey": false,
          "isForeignKey": false
        },
        "stock_quantity": {
          "Type": "int",
          "isPrimaryKey": false,
          "isForeignKey": false
        }
      },
      "relations": [
        {
          "to": "products",
          "from": "orders",
          "foreignKey": "productinv.products.product_id"
        },
        {
          "to": "products",
          "from": "product_categories",
          "foreignKey": "productinv.products.product_id"
        }
      ]
    }
  },
  "processing": {
    "columns": [
      {
        "type": "simple",
        "loc": "order_oct.customers.customer_name",
        "name": "customer_name",
        "label": "cust_name"
      },
      {
        "type": "simple",
        "loc": "order_oct.orders.id",
        "name": "id",
        "label": "orderId"
      },
      {
        "type": "simple",
        "loc": "productinv.products.product_id",
        "name": "product_id",
        "label": "productId"
      }
    ]
    ,
    "relations":[
      {
        "table1":"order_oct.customers",
        "table2":"order_oct.orders",
        "on":["customer_id","customerId"]
      },
      {
        "table1":"order_oct.orders",
        "table2":"productinv.products",
        "on":["productId","product_id"]
      }
    ]
  }


};

const mysql = require('mysql2');
const express = require('express');
const app = express();
const port = 3001;

// Create a connection pool to handle connections
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234' // Add your MySQL password here
  // Change to your default database name
});

// Define a function to retrieve databases and tables
async function retrieveDatabasesAndTables() {
  const finalRes = {};

  try {
    const [rows] = await pool.promise().query('SHOW DATABASES');

    for (const row of rows) {
      const dbName = row.Database;

      if (dbName === 'productinv' || dbName === 'order_oct') {
        finalRes[dbName] = {
        };

        // Switch to the current database
        await pool.promise().query(`USE ${dbName}`);

        const [tableRows] = await pool.promise().query('SHOW TABLES');

        for (const tableRow of tableRows) {
          const tableName = tableRow[`Tables_in_${dbName}`];
          finalRes[dbName][tableName] = {};
        }
      }
    }

    return finalRes;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function retrieveRelations(sch) {
  for (const ob in sch) {
    // console.log(ob)
    await pool.promise().query(`USE ${ob}`);

    for (const t in sch[ob]) {
      const res = await pool.promise().query(`DESC ${t}`)
      sch[ob][t]['columns'] = {}
      sch[ob][t]['relations'] = []
      res[0].forEach(item => {
        sch[ob][t]['columns'][item.Field] = {
          'Type': item.Type,
          'isPrimaryKey': item && (item.keyey == 'PRI') ? true : false,
          'isForeignKey': item && (item.Key == 'MUL') ? true : false
        }
      })

    }
  }
  await pool.promise().query(`use information_schema`)

  for (const obj in sch) {
    /* for(const obj1 in  sch[obj]){
      console.log("obj",obj,obj1,sch[obj][obj1])

    } */
    let res1 = await pool.promise().query(`
    SELECT 
      CONSTRAINT_NAME AS foreign_key_name,
      TABLE_NAME AS referencing_table,
      COLUMN_NAME AS referencing_column,
      REFERENCED_TABLE_NAME AS referenced_table,
      REFERENCED_COLUMN_NAME AS referenced_column,
      REFERENCED_TABLE_SCHEMA as referenced_db_schema,
      TABLE_SCHEMA
    FROM
      information_schema.KEY_COLUMN_USAGE
    WHERE 
      TABLE_SCHEMA = '${obj}' AND
      REFERENCED_TABLE_NAME IS NOT NULL;
  `);

    let ress1 = null
    if (res1[0]) {
      ress1 = res1[0]
    }
    for (let i = 0; i < ress1.length; i++) {
      console.log("obj", obj)
      sch[ress1[i].referenced_db_schema][ress1[i].referenced_table].relations.push({
        "to": ress1[i].referenced_table,
        "from": ress1[i].referencing_table,
        "foreignKey": `${ress1[i].referenced_db_schema}.${ress1[i].referenced_table}.${ress1[i].referenced_column}`
      })
      console.log(ress1[i]);
      sch[obj][ress1[i].referencing_table].columns[ress1[i].referencing_column].isForeignKey = `${ress1[i].referenced_db_schema}.${ress1[i].referenced_table}.${ress1[i].referenced_column}`;

    }

  }
  return sch;
}

async function createSqlquery(schema) {
  let columns = schema.processing.columns
  console.log(columns)
  let query = {}
  for (let i = 0; i < columns.length; i++) {
    const parts = columns[i].loc.split('.');
    const table = parts[parts.length - 2]
    if (!query[table]) {
      query[table] = []
      query[table].push({
        col: columns[i].loc,
        alias: columns[i].label
      })

    }
    else {
      query[table].push({
        col: columns[i].loc,
        alias: columns[i].label
      })
    }
  }
  let relations=schema.processing.relations
  let q='SELECT '
  for(const obj in query){
    for(const obj1 of query[obj]){
      q=q+`${obj1.col} AS ${obj1.alias},`
    }
  }
   if (q.endsWith(',')) {
    q = q.slice(0, -1);
  }
  q=q+' FROM '
  let f=true;
  if(relations){
    for(let i=0;i<relations.length;i++){
      let [c1,c2]=relations[i].on;
      console.log(c1,c2)
      if(f){
       q=q+`${relations[i].table1} left join ${relations[i].table2} ON ${relations[i].table1}.${c1}=${relations[i].table2}.${c2} `
       f=false;
      }
      else{
       q=q+`left join ${relations[i].table2} ON ${relations[i].table1}.${c1}=${relations[i].table2}.${c2} `
      }
     }
  }
  else{
    for(let i=0;i<columns.length;i++){
      q=q+`${columns[i].loc.split(".").splice(0,2).concat(".")} ,`
    }
  }
  if (q.endsWith(',')) {
    q = q.slice(0, -1);
  }
  return q
 

}

function convertSchemaToTree(schema) {
  const tree = {};

  // Initialize each table in the tree
  for (const table in schema) {
    tree[table] = {
      name: table,
      children: []
    };
  }

  // Attach columns to each table in the tree
  for (const [table, details] of Object.entries(schema)) {
    for (const [column, columnDetails] of Object.entries(details.columns)) {
      tree[table].children.push({
        name: column,
        type: columnDetails.Type,
        isPrimaryKey: columnDetails.isPrimaryKey,
        isForeignKey: columnDetails.isForeignKey

      });
    }
  }

  // Attach relations to each table in the tree
  for (const [table, details] of Object.entries(schema)) {
    for (const relation of details.relations) {
      if (relation.to === table) {
        tree[table].children.push(tree[relation.from]);
      }
    }
  }

  return tree;
}
// Connect to MySQL and retrieve databases and tables
pool.getConnection(async (err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL server:', err);
    return;
  }

  console.log('Connected to MySQL server');

  try {
    const databasesAndTables = await retrieveDatabasesAndTables();
    console.log('Databases and Tables:', databasesAndTables);
    //fetch relations using  information schema
    const schemaRelations = await retrieveRelations(databasesAndTables);
    //console.log("finalTree", JSON.stringify(schemaRelations))
    let finalTree = {}
    for (const obj in schemaRelations) {
      finalTree[obj] = {}
      finalTree[obj] = convertSchemaToTree(schemaRelations[obj]);
    }
    //console.log("finalTree",JSON.stringify(finalTree))
    let queries = await createSqlquery(schema)
    console.log("que", queries)
  }
  catch (error) {
    console.error('Error retrieving databases and tables:', error);
  } finally {
    // Release the connection back to the pool
    connection.release();
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

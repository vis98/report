{
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
    "processing":[
        "columns":[
            {
                "type":"simple",
                "loc":"order_oct.customers.customer_name",
                 "name":"customer_name",
                 "label":"cust_name"
            },
            {
                "type":"simple",
                "loc":"order_oct.customers.customer_id",
                 "name":"id",
                 "label":"cust_id"   
            }
        ]
    ]
  }
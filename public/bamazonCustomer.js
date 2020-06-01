var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table")
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_db"
})

connection.connect(function(err) {
    if (err) {
        console.log("error connection:", err.stack);
        return;
    }
    // console.log("connected as id:",connection.threadId);

});
var totalCost = 0;
function display() {
    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", function (err, res) {
        console.log("----- Check Out The Items Listed For Sale Below -----")
        console.log("\n-----------------------------------------------------\n")
       
        console.table(res)
    
    
    
      start()
       
    
    });
}
//calling on database to console.log() all items from the database



function buyItem() {
    inquirer
    .prompt([{
        name: "buyItemById",
        type: "number",
        message: "To buy a product please Enter the product's ID number",
        validate: function(params) {
            if (isNaN(params)) {
                return false;
            }
            return true
        }
    },
    {
        name: "quantity",
        type: "input",
        message: "Enter The Quantity Amount That You Wish To Purchase."

    }
]).then(function(userInput) {
    
    connection.query("SELECT * FROM products WHERE item_id = ?", userInput.buyItemById,function(err, result) {
        // console.log(result[0].price)
        
        if(userInput.quantity < result[0].stock_quantity){
            totalCost  = totalCost + result[0].price * userInput.quantity
           
             var newQuant = result[0].stock_quantity - userInput.quantity
            
             connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?",[newQuant, userInput.buyItemById], function (err, result) {
                 console.log("Total Purchases: $"+ totalCost);
                display()
             })
        } else{
            console.log("Insufficient Quantity")
            display()
        }

     
    })

})
    
    
}

//start function to begin running the CLI
function start() {
   
inquirer
.prompt({
        name: "welcomeUser",
        type: "list",
        message: "Would you like to buy an item?",
        choices: ["Yes","No, Exit"]

}).then(function(res) {
    switch (res.welcomeUser) {
        case "Yes":
            buyItem()
            break;
        case "No, Exit":
            console.log("Come Back Soon For More!")
        connection.end()
        default:
            connection.end()
            break;
    }
    
});
}

function split() {
    console.log("\n-----------------------------------------------------\n")
    
}
display()



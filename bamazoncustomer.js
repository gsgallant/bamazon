var mysql = require('mysql');
var prompt = require('mysql');
var colors = require('colors');
var pad = require('pad');


var con = mysql.createConnection({
     host     : 'localhost', //for now, this will always be localhost
     user     : 'root',  // this will be whatever user you use to connect to mysql
     password : 'Thew1zardof0z',  // this is the password for the 'user' above
     database : 'Bamazon'  // this is a database which you have on your install of mysql
});


con.connect(function (err) {
       if (err) {
           console.log(err);
       }
       //console.log('connected');
   });

var displayProducts = function(){
	con.query("SELECT * FROM Product", function(err,rows){

		if (err) {
		           return callback(err);
		       }
		       
		       if (rows.length == 0) {
		           var err = new Error();
		           err.message = "No products found";            
		           return callback(err);
		       }
			process.stdout.write("\n\n"+pad(30,"Current Inventory").bold.red);
			process.stdout.write(("\n"+pad(30,"-----------------")).bold.red);
			process.stdout.write(("\nProdID "+pad("Name",22)).bold.green);
	 		process.stdout.write((pad("Price",8)+pad("# Available",10)).bold.green);
			process.stdout.write(("\n================================================").bold.red); 
			for(i=0;i<rows.length-1;++i){
			 	
			 	var itemId = rows[i].ItemID;
			 	var prodName = rows[i].ProdName;
		 		var price = rows[i].Price;
		 		var qty = rows[i].StockQuantity;
			 	// console.log(price);
			 	// console.log(qty);
			 	process.stdout.write("\n"+pad(pad(3,itemId),6));
			 	process.stdout.write(" "+pad(prodName,20));
			 	process.stdout.write(" "+pad(6,price.toFixed(2)));
			 	process.stdout.write(" "+pad(10,qty.toString()));
			 }      
			 console.log();


	})
};

displayProducts();
const mongoose = require("mongoose");
require("dotenv").config();


exports.connect = async() => {
	const URL = process.env.MONGODB_URL;
	//const URL=`mongodb://localhost:27017/clone`;//for local mongodb
	try {
	  mongoose.set('strictQuery', false);
  
	  await mongoose.connect(URL, { useNewUrlParser: true });
  
	  console.log(`database connected successfully`);
	} catch (error) {
	  console.log('Error: while connecting with database', error.message);
	}
	/*try{
		await mongoose.connect(MONGODB_URL, {
			useNewUrlparser: true,
			useUnifiedTopology: true,
		})
		.then(console.log(`DB Connection Success`))
		.catch((err) => {
			console.log(`DB Connection Failed`);
			console.log(err);
			process.exit(1);
		});
		*/
};

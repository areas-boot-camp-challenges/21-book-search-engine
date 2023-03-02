// Dependencies.
const mongoose = require("mongoose")

// Set up a connection to the database.
const db = "googlebooks"
mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost/${db}`,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	},
	(err) => {
		// Log any database connection errors. Otherwise, log a success message.
		if (err) {
			console.error(err)
		} else {
			console.log(`Connected to the ${db} database! ✅`)
		}
	},
)

module.exports = mongoose.connection

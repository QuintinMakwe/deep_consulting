require("express-async-errors");
const app = require("express")();
const { PORT } = require("./src/config");

const db = require('./src/config/postgres-db.config');
const Product = require('./src/models/product.model');
const Log = require("./src/models/log.model");

Product.hasMany(Log, { foreignKey: { allowNull: false}});
Log.belongsTo(Product);
db.authenticate().then(() => {
  console.log('✅ :::> Connected to PostgresSQL')
  // db.sync({force: true}).then((result)=>{
  //   console.log('this is result of sync ', result)
  // })
}).catch(err => {
  console.log('🚫 :::> Could not connect to PostgresSQL ', err)
})


// Pre-route middlewares
require("./src/middlewares/pre-route.middleware")(app);

// API routes
app.use("/api", require("./src/routes"));

// Ping route for testing connection
app.get("/ping", (req, res) => res.status(200).send("Hello world! 😁"));

// Error middlewares
require("./src/middlewares/error.middleware")(app);

db.sync().then(()=> {
  // Listen to server port
  app.listen(PORT, async () => {
    //Initialize MongoDB
    // await require("./src/config/mongo-db.config")()
    
    console.log(`✅ :::> Ping master, your server is listening on port ${PORT} \n\n   :::> http://localhost:${PORT}`);
  });

})

// On  server error
app.on("error", (error) => {
  console.error(`🚫 :::> An error occurred on the server: \n ${error}`);
});



module.exports = app
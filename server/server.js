
/*================== Global Imports =================*/
const express = require('express')
const app = express();


const dotenv = require('dotenv')

const cors = require('cors')
const morgan = require('morgan');
const csp = require('helmet-csp');
const sanitizeMongo = require('express-mongo-sanitize')



const path = require('path')


const db = require('./config/db')
const PORT = process.env.PORT || 3001




/*================== Configurations =================*/

/*================== Environment Variables config for development =================*/
if(process.env.NODE_ENV !== "production"){
    dotenv.config();
}

/*================== Express config =================*/

app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.use(express.static(path.join(__dirname + '/public')))




/*================== Security ==================*/
if(process.env.NODE_ENV === "production"){

    // Use the helmet middleware to set the default CSP
    app.use(csp({
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", 'https://fonts.googleapis.com', 'https://fonts.gstatic.com',"'unsafe-inline'"],
          fontSrc: ['https://fonts.gstatic.com','https://nameless-basin-36851.herokuapp.com/*'],
          imgSrc: ["'self'", "*", "blob:", "data:"]
        }
      }));
    
    // Enable CORS for all routes
    app.use(cors({
      origin: ['https://nameless-basin-36851.herokuapp.com']
    })); 

} else{      
  app.use(cors());  
}


    

app.use(morgan("common"));


// sanitize-mongo middleware to protect against MongoDB injection attacks
app.use(sanitizeMongo({replaceWith: '_'}))


//Routes
const { router:routes, server} = require("./routes")(app)
app.use(routes)



// Serve the index.html file from the public folder
if(process.env.NODE_ENV === "production"){
    app.get("/*", (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
      });
      
}



/*================== MONGODB =================*/
db.once("open", () => {
    server.listen(PORT, () => {
        console.log(`🌍💥 Server running on port ${PORT}`)
    })
})

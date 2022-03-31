const express = require('express')
const app = express()
const path = require('path')
const hbs = require('hbs')
require("./db/conn")
const port = process.env.PORT || 3000;
const templates_path = path.join(__dirname,"../templates/views")
const Register = require("./models/registers");
const Cart = require("./models/carts");
const Order = require("./models/orders");
const { json } = require("express");
const staticPath = path.join(__dirname,"../public");
app.use(express.static(staticPath));
app.set('view engine',"hbs");
app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.set('views',templates_path);
app.get('/', (req, res) => {
    res.render("login")
})
app.get("/register", (req, res) => {
    res.render("register")
})
app.get('/login', (req, res) => {
  res.render('login')
})
app.get('/forgotPswd', (req, res) => {
  res.render('forgotPswd')
})
app.get("/about", (req, res) => {
  res.render("about")
})
app.get("/contact", (req, res) => {
  res.render("contact")
})
app.get('/order', (req, res) => {
  res.render('order')
})
app.post('/add',async(req,response) => {
  try{
    const exist = await Cart.findOne({useremail : global.e,title : req.body.title})
    
    if(!exist){
      const addCart = new Cart({
        useremail : global.e,
        title : req.body.title,
        price : req.body.p,
        imagePath : req.body.imageSrc,
        quantity : req.body.qty
      })
      const added = await addCart.save(); 
      console.log(added)
    }else{
      console.log('Already in Cart');
    }
  }catch(error){
    response.status(400).send(error);
  } 
})
const updateDocument = async(title,qty) => {
  try{
    const result = await Cart.updateOne(
      {
        useremail : global.e,
        title : title
      },
      {
        $set : {
          quantity : qty,
        }
      });
      console.log(result);
  }catch(err){
    console.log(err);
  }
}
const removeDocument = async(title) => {
  try{
    const result = await Cart.remove({useremail : global.e},{title : title});
    console.log(result);
  }catch(err){
    console.log(err);
  }
}
app.post('/remove',async(req,res) => {
  try{
    removeDocument(req.body.title)
    console.log('Removed')
  }catch{
    response.status(400).send(error);
  }
})
app.post('/update',async(request,response) => {
  try{
    var title = request.body.title
    var qty = request.body.qty
    console.log(qty);
    updateDocument(title,qty);
  }catch{
    response.status(400).send(error);
  } 
})
app.post('/purchase',async(request,response) => {
  try{
    var price = request.body.total
    console.log(price);
    global.p =price
  }catch{
    response.status(400).send(error);
  } 
})

app.post('/order',async(req,response) => {
      try{
          const booksPurchased = await Cart.find({useremail : global.e})
          console.log("------")
          console.log(booksPurchased)
          const purchase = new Order({
              name : req.body.name,
              email : global.e,
              phone : req.body.phone,
              books : booksPurchased,
              totalprice : global.p,
              pincode: req.body.pincode,
              address : req.body.address,
              state : req.body.state,
              city : req.body.city,
              country : req.body.country
          })
        const ordered = await purchase.save();
        const result = await Cart.remove({useremail : global.e});
        console.log(result);
        response.status(201).render('login');
    }catch(error){
        response.status(400).send(error);
    }
})

//creating a new user in database
app.post("/register", async (req, res) => {
    try{
      const password = req.body.password;
      const cpassword = req.body.confirmpassword
  
      if (password === cpassword){
      const registerUser = new Register({
            firstname : req.body.firstname,
            lastname : req.body.lastname,
            email : req.body.email,
            phone : req.body.phone,
            password : password,
            confirmpassword : cpassword
      })

      //save the contents in db
      const registered = await registerUser.save(); 
      //After saving show index page
        res.status(201).render("index",{
          email: req.body.email,
        });
      }
    }catch(error){
      res.status(400).send(error);
    } 
  });

  app.post('/login', async (req, res) => {
    try{
      //email and password entered by current user
      const email = req.body.email;
      global.e = email
      const password = req.body.password;
  
      const useremail = await Register.findOne({email:email});
      const ex = await Cart.findOne({useremail:global.e});
      if(useremail.password === password){
       
        res.status(201).render("index",{
          email: req.body.email
        });
      }else{
        res.status(201).render("login",{
          Flag: 0
        })
      }
    }catch(error){
        res.status(201).render("login",{
          Flag: 0
        })
    } 
  })

  const updatePassword = async(email,password) => {
    try{
      const result = await Register.updateOne(
        {
          email : email,
        },
        {
          $set : {
            password : password,
            confirmpassword : password,
          }
        });
        console.log(result);
    }catch(err){
      console.log(err);
    }
  }
  app.post('/forgotPswd', async (req, res) => {
    try{
      const email = req.body.email;
      const password = req.body.password;
      updatePassword(email,password) 
      res.status(201).render("login")
    }catch(error){
      console.log(err);
    } 
  })

//If we use 3000 as port valid till our db only.
app.listen(port,() =>{
    console.log('server is running at port number '+ port);
})
const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async(req, res) => {
  try{
    const { email, password } = req.body;
    if(!email){
      return res.status(400).json({ error: 'Email is required' });
    }
    if(!password){
      return res.status(400).json({ error: 'Password is required' });
    }
    const user = await prisma.user.findFirst({
      where: { email }
    });
    if(user){
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { email, password: hashedPassword }
    });

    res.send('User registered successfully');
  }catch(err){
    console.log(err);
    res.status(500).json({ error: 'Server error' } ); 
  }
}

exports.login = async(req, res) => {
  try{
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({
      where: { email }
    });
    if(!user || !user.enabled){
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const payload = { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' },(err, token) => {
      if(err){
        console.error(err);
        return res.status(500).json({ error: 'Server error' });
      }
      res.json({ payload, token });
    });
    
  }catch(err){
    console.log(err);
    res.status(500).json({ error: 'Server error' } );
  }
}

exports.currentUser = async(req, res) => {
  try{
    const user = await prisma.user.findFirst({
      where:{email:req.user.emai},
      select:{
        id:true,
        email:true,
        name:true,
        role:true
      }
    })
    res.json({user}) 
  }catch(err){  
    console.log(err);
    res.status(500).json({ error: 'Server error' } );
  } 
}


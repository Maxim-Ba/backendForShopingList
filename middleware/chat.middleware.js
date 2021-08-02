module.exports = (req, res, next) =>{

try {




  
  return next()
} catch (error) {
  return res.status(401).json({ message: error })
}


}
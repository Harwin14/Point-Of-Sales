module.exports = {  
    isLoggedIn : (req, res, next) => {
    if(req.session.user){
      next() // Lanjutkan ke rute yang diakses
    }else{
      res.redirect('/login')
    }
  },
  
  isAdmin : (req, res, next) => {
    if(req.session.user && req.session.user.role == 'Admin'){
      next()
    }else{
      res.redirect('/sales')
    }
  },
  
}
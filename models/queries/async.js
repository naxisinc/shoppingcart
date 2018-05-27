router.post('/auth/login', controllers.auth.login)

login: async (req, res, next) => {
    let v = val.validate('login', req.body)
    if(!v.valid){
      return res.data_errors(v.errors)
    }
    try{
      let data = req.body
      let user = await Users.findOne({ user: data.user })

      //si eno se encontró el usuario
      if(!user){
        return res.data_errors({user: "el usuario no existe"})
      }

      if (user.pass != funciones.hash(data.pass)) {
        return res.data_errors({pass: "la contraseña es incorrecta"})
      }

      //login correcto
      //genero el token
      let token = jwt.sign({
        id: user.id,
        rol: user.rol,
      }, config.secret)

      return res.success({
        token: token,
        id: user.id,
        user: user.user,
        first_name: user.first_name,
        last_name: user.last_name,
        rol: user.rol,
        email: user.email
      })
    }catch(err){
      console.log(err)
      next()
    }
  },
let month = ['January', 'Februari', 'March', 'April', 'May', 'June', 'July', 'August', 
            'September','October', 'November','December']

function getFullTime(time) {

  let date = time.getDate()
  let monthIndex = time.getMonth()
  let year = time.getFullYear()

  let hours = time.getHours()
  let minutes = time.getMinutes()


  let fullTime = `${date} ${month[monthIndex]} ${year} ${hours}:${minutes} WIB`

  return fullTime

}

function getDistanceTime(time) {

    let timePost = time
    let timeNow = new Date()
    let distance = timeNow - timePost
  
    let milisecond = 1000 
    let secondsInHours = 3600
    let hoursInDay = 23
  
    let seconds = 60
    let minutes = 60
  
    let distanceDay = distance / (milisecond * secondsInHours * hoursInDay)
    let distanceHours = Math.floor(distance / (milisecond * seconds * minutes))
    let distanceMinutes = Math.floor(distance / (milisecond * seconds))
    let distanceSecond = Math.floor(distance / milisecond)
  
  
    
    if (distanceDay >= 1) {
        return `${distanceDay} day ago`;
  
    } else if(distanceHours >= 1) {
      
        return `${distanceHours} hours ago`;
  
    } else if(distanceMinutes >= 1) {
     
        return `${distanceMinutes} minutes ago`;
  
    } else {
        return `${distanceSecond} seconds ago`;
    }
}


const bcrypt = require('bcrypt')
const flash = require('express-flash')
const session = require('express-session')

const { request, response } = require('express')
const express = require('express')
const app = express()
const PORT = 5050

const db = require('./connection/db')
const upload = require('./middlewares/fileUpload')

app.set('view engine', 'hbs')

app.use('/public' ,express.static(__dirname + '/public'))

app.use('/upload' ,express.static(__dirname + '/upload'))

app.use(flash())

app.use(
    session({
        cookie: {
            maxAge: 2 * 60 * 60 * 1000,
            secure: false,
            httpOnly: true
        },
        store: new session.MemoryStore(),
        saveUninitialized: true,
        resave: false,
        secret: 'secretValue'
    })
)

app.use(express.urlencoded({extended: false}))


app.get('/register', function(request, response){
response.render('register')
})

app.post('/register', function(request, response){

    const {inputName, inputEmail, inputPassword} = request.body
   
    const hashedPassword = bcrypt.hashSync(inputPassword,10)

    let query = `INSERT INTO t_user(name, email, password) VALUES ('${inputName}', '${inputEmail}', 
    '${hashedPassword}')`

    db.connect(function(err, client, done) {

        if (err) throw err

        client.query(query, function(err, result) {
           
            if (err) throw err

            // console.log(result.rows);

           
            // console.log(data)
            response.redirect('/login')
        })
    })
})

app.get('/login', function(request, response){
    response.render('login')
})
    
app.post('/login', function(request, response){
    const {inputEmail, inputPassword} = request.body

    const query = `SELECT * FROM t_user WHERE email = '${inputEmail}'`

    db.connect(function (err, client, done){
        if (err) throw err

        client.query(query, function(err, result){
            
            if (err) throw err
            
            const dataCrypt = result.rows.length
            
            if (dataCrypt == 0){

                request.flash('danger', 'Email belum terdaftar!')
                return response.redirect('/login')
            }
            
            let isMatch = bcrypt.compareSync(inputPassword, result.rows[0].password)
            
            if(isMatch){
                
                request.session.isLogin = true
                request.session.user = {
                    id: result.rows[0].id,
                    name: result.rows[0].name,
                    email: result.rows[0].email,
                }
                request.flash('success', 'Login berhasil')
                response.redirect('/blog')
                
            } else {

            request.flash('danger', 'Password salah!')
            response.redirect('/login')

            }
            
            // request.flash('danger', 'Email belum teraftar!')
        })
    })
})

app.get('/', function(request, response){

  

    let query = `SELECT * FROM t_exp`

    db.connect(function(err, client, done){
        if (err) throw err

        client.query(query,  function(err, result){
            if (err) throw err

            let data= result.rows.map((data)=>{
                return {
                    ...data,
                    isLogin: request.session.isLogin,
                    user: request.session.user,
                }
            })
            response.render('index', {isLogin: request.session.isLogin, user: request.session.user, index: data})

        })
    })
    
})

app.post('/', function(request, response){
    response.redirect('/')
})

app.get('/add-blog', function(request, response){


    if (request.session.isLogin) {
        request.flash('danger,Please Login!!')
        response.redirect('/login')
    }

    response.render('add-blog', {isLogin: request.session.isLogin, user: request.session.user})
})

app.get('/contact', function(request, response){
    response.render('contact', {isLogin : request.session.isLogin, user: request.session.user})
})

app.get('/blog', function(request, response) {

    const query = `SELECT t_blog.id, t_blog.author_id, t_blog.title, t_blog.content, t_blog.image, t_user.name AS author, t_blog.post_at
	FROM public.t_blog LEFT JOIN t_user ON t_blog.author_id = t_user.id;`

    db.connect(function(err, client, done) {
        if (err) throw err

        client.query(query, function(err, result) {
            if (err) throw err

            let data = result.rows

            data = data.map(function(blog){
                return {
                    ...blog,
                    isLogin: request.session.isLogin,
                    postAt: getFullTime(blog.post_at),
                    distance: getDistanceTime(blog.post_at)
                }
            })
            
            response.render('blog', {isLogin : request.session.isLogin, user : request.session.user, blogs: data})
        })
    })
})

app.post('/blog', upload.single('inputImage'), function(request, response) {

    let data = request.body

    const authorid = request.session.user.id

    const image = request.file.filename

    let query = `INSERT INTO t_blog(title, content, image, author_id) VALUES ('${data.inputTitle}', '${data.inputContent}', 
    '${image}', '${authorid}')`

    db.connect(function(err, client, done) {

        if (err) throw err

        client.query(query, function(err, result) {
           
            if (err) throw err

            response.redirect('/blog')
        })
    })

})

app.get('/blog-detail/:id', function(request, response) {
    // console.log(req.params);
    
    let id = request.params.id

    db.connect(function (err, client, done){
        if (err)throw err

        client.query(`SELECT * FROM t_blog WHERE id = ${id}`, function(err, result){
            if (err) throw err

            let data = result.rows[0]
            console.log(data)
            response.render('blog-detail', {blog: data, isLogin: request.session.isLogin, user: request.session.user})
        })
    })
})
  

app.get('/delete-blog/:id', function(request, response){

    let id = request.params.id;

    let query = `DELETE FROM t_blog WHERE id = ${id}`
    
    db.connect(function(err, client, done){
        if (err) throw err

        client.query(query, function(err,result){
            if (err) throw err

            response.redirect('/blog')
        })
    })
})

app.get('/edit/:id', function(request,response){

    let id = request.params.id

    db.connect(function(err, client, done){
        if (err) throw err
        
        client.query(`SELECT * FROM t_blog WHERE id = ${id}`, function(err,result){
            if (err) throw err

            let dataViews = result.rows[0]
            response.render('edit', {id:id, blog:dataViews})
            
        })
    })

})

app.post('/edit/:id', upload.single('updateImage'),function(request, response){

    let id = request.params.id

    const image = request.file.filename

    let data = request.body

    let query = `UPDATE t_blog
    SET title='${data.updateTitle}', content='${data.updateContent}', image='${image}'
    WHERE id=${id}`

    db.connect(function(err, client, done){
        if (err) throw err

        client.query(query, function(err,result){
            if (err) throw err

            response.redirect('/blog')
        })
    })
})

app.get('/logout', function(request, response){
    request.session.destroy()

    response.redirect('/blog')
})


app.listen(PORT, function(request, response){
    console.log('Wellcome Jarvis')
})


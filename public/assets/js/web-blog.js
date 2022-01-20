let blogs = []

function addBlog(event){
    event.preventDefault()
    
    let title = document.getElementById('input-blog-title').value
    let content = document.getElementById('input-blog-content').value

    let image = document.getElementById('input-blog-image').files

    image = URL.createObjectURL(image[0]) 
    let blog ={
        title: title,
        content: content,
        image: image,
        author: 'Herdiyana',
        postAt: new Date()
    }

    blogs.push(blog)
    console.log(blogs);


}
function renderBlog() {
    let contentContainer = document.getElementById('contents')

    contentContainer.innerHTML = firstBlogContent()

    for (let i = 0; i < blogs.length; i++) {
        contentContainer.innerHTML += `<div class="blog-list-item">
        <div class="blog-image">
          <img src="${blogs[i].image}" alt="" />
        </div>
        <div class="blog-content">
          <div class="btn-group">
            <button class="btn-edit">Edit Post</button>
            <button class="btn-post">Post Blog</button>
          </div>
          <h1>
            <a href="blog-detail.html" target="_blank">${blogs[i].title}</a>
          </h1>
        <div class="detail-blog-content">
          ${getFullTime(blogs[i].postAt)} | ${blogs[i].author}
        </div>
        <p>
          ${blogs[i].content}
        </p>

        <div style="text-align: right;">
            <span style="font-size: 13px; color: color: rgb(5, 5, 5)">
            ${getDistanceTime(blogs[i].postAt)}
            </span>
        </div>` 
    }   
}

function firstBlogContent() {
  return `<div class="blog-list-item">
  <div class="blog-image">
    <img src="img/download.jpg" alt="" />
  </div>
  <div class="blog-content">
    <div class="btn-group">
      <button class="btn-edit">Edit Post</button>
      <button class="btn-post">Post Blog</button>
    </div>
    <h1>
      <a href="blog-detail.html" target="_blank"
        >Orang Terganteng Di Dunia Wow Nya Mna Amazing</a
      >
    </h1>
    <div class="detail-blog-content">
      12 Jul 2021 22:30 WIB | Ichsan Emrald Alamsyah
    </div>
    <p>
      Pemuda gagah nan tampan ini katanya bisa membuat wanita terpesona setelah meggunakan topi dari Zimbabwe, 
      aksesoris berlian dan makan emas batangan 5 kg. Lorem ipsum,
      dolor sit amet consectetur adipisicing elit. Quam, molestiae
      numquam! Deleniti maiores expedita eaque deserunt quaerat! Dicta,
      eligendi debitis?
    </p>

    <div style="text-align: right;">
        <span style="font-size: 13px; color: rgb(255, 255, 255)">
          1 day ago
        </span>
    </div>`
}

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

setInterval(() => {
    renderBlog()
  }, 3000)
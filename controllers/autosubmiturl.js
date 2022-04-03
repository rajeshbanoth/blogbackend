const axios = require('axios')
const  { listBlogsWithCategoriesAndTags } = require('./blogsearch')


var XMLHttpRequest = require('xhr2');

const AutosubmitUrlBing = async() => {
  
  const BASE_URL = process.env.CLIENT_URL; //This is where you will define your base url. You can also use the default dev url http://localhost:3000

  const  getAllBlogPosts =()=>{
    let skip = 0;
    let limit = 0;
    return listBlogsWithCategoriesAndTags(skip, limit).then(data => {

      console.log(data)
        if (data.error) {
            console.log(data.error);
        } else {
            return {
                blogs: data.blogs,
                categories: data.categories,
                tags: data.tags,
                totalBlogs: data.size,
                blogsLimit: limit,
                blogSkip: skip
            };
        }
    });
}

  const {blogs,categories,tags} = await getAllBlogPosts() // your custom API call




let url=[]


  const dynamicBlog = blogs.map( singlecat=> {

    url.push(`"${BASE_URL}/blogs/${singlecat.slug}"`)


  })

  const dynamicTags = tags.map( singlecat=> {
  url.push(`"${BASE_URL}/blogs/${singlecat.slug}"`)
 

  })


  const dynamicPaths = categories.map( singlecat=> {

  url.push(`"${BASE_URL}/blogs/${singlecat.slug}"`)

  })


  //let url1 = "http://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=5f85bd77d4704b379769238f9f9d0f52";

  let url1 = "http://www.bing.com/indexnow";

let xhr = new XMLHttpRequest();
xhr.open("POST", url1);

xhr.setRequestHeader("Accept", "application/json");
xhr.setRequestHeader("Content-Type", "application/json");

xhr.onreadystatechange = function () {
   if (xhr.readyState === 4) {
      console.log(xhr.responseText);
   }};

let data=`{
  host: "gloom.co.in",
  key: "2d67b2a737ff4649841b18ade7e9ed6b",
  keyLocation: "https://gloom.co.in/2d67b2a737ff4649841b18ade7e9ed6b.txt",
  urlList:[${url}]

}`
console.log(data)
xhr.send(data);   
};

module.exports={
  AutosubmitUrlBing

}
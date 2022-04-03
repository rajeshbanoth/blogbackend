const axios = require('axios')
const listBlogsWithCategoriesAndTags = (skip, limit) => {
    const data = {
        limit,
        skip
    };
    return axios.post(`http://localhost:8000/api/blogs-categories-tags`, {
       
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
          
            return response.data;
        })
        .catch(err => console.log(err));
};

module.exports={
    listBlogsWithCategoriesAndTags
}

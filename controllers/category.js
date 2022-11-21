const Category = require('../models/category');
const Blog = require('../models/blog');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');
const { autosubmiturl } = require('./GoogleIndexing');

exports.create = (req, res) => {
    const { name } = req.body;
    let slug = slugify(name).toLowerCase();

    let category = new Category({ name, slug });

    category.save((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

        if(process.env.GOOGLE_INDEXING_ENABLE)
        {
            const url=process.env.CLIENT_URL+`/categories/${slug}`
            const type='URL_UPDATED'   
            const url1=process.env.CLIENT_URL+`/search?${slug}`        
            autosubmiturl(url1,type)    
            autosubmiturl(url,type)
        }


        res.json(data);
    });
};

exports.list = (req, res) => {
    Category.find({}).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(data);
    });
};

exports.read = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    

    Category.findOne({ slug }).exec((err, category) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        // res.json(category);
        Blog.find({ categories: category })
            .populate('categories', '_id name slug')
            .populate('tags', '_id name slug')
            .populate('postedBy', '_id name')
            .select('_id title slug excerpt categories postedBy tags createdAt updatedAt')
            .exec((err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                // console.log(data)
                res.json({ category: category, blogs: data });
            });
    });
};

exports.readHomeCat = (req, res) => {
    const slug = req.params.slug.toLowerCase();
    let limit=4
    Category.findOne({ slug }).exec((err, category) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        // res.json(category);
        Blog.find({ categories: category })
            .populate('categories', '_id name slug')
            .populate('tags', '_id name slug')
            .populate('postedBy', '_id name')
            .limit(limit)
            .select('_id title slug excerpt categories postedBy tags createdAt updatedAt')
            .exec((err, data) => {
                if (err) {
                    return res.status(400).json({
                        error: errorHandler(err)
                    });
                }
                // console.log(data)
                res.json({ category: category, blogs: data });
            });
    });
};


exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Category.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

        if(process.env.GOOGLE_INDEXING_ENABLE)
        {
            const url=process.env.CLIENT_URL+`/categories/${slug}`
            const type='URL_DELETED'   
            const url1=process.env.CLIENT_URL+`/search?${slug}`           
            autosubmiturl(url1,type)
            autosubmiturl(url,type)

        }
      
        res.json({
            message: 'Category deleted successfully'
        });
    });
};

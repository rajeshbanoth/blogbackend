const Tag = require('../models/tag');
const Blog = require('../models/blog');
const slugify = require('slugify');
const { errorHandler } = require('../helpers/dbErrorHandler');
const { autosubmiturl } = require('./GoogleIndexing');
// const { AutosubmitUrlBing } = require('./autosubmiturl');

exports.create = (req, res) => {
    const { name } = req.body;
    let slug = slugify(name).toLowerCase();

    let tag = new Tag({ name, slug });

    tag.save((err, data) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

        if(process.env.GOOGLE_INDEXING_ENABLE)
        {
          
            const url=process.env.CLIENT_URL+`/tags/${slug}`
            const type='URL_UPDATED'   
            const url1=process.env.CLIENT_URL+`/search?${slug}`        
            autosubmiturl(url1,type)    
            autosubmiturl(url,type)
        }



        // AutosubmitUrlBing()
        res.json(data); // dont do this res.json({ tag: data });
    });
};

exports.list = (req, res) => {
    Tag.find({}).exec((err, data) => {
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

    Tag.findOne({ slug }).exec((err, tag) => {
        if (err) {
            return res.status(400).json({
                error: 'Tag not found'
            });
        }
        // res.json(tag);
        Blog.find({ tags: tag })
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
                res.json({ tag: tag, blogs: data });
            });
    });
};

exports.remove = (req, res) => {
    const slug = req.params.slug.toLowerCase();

    Tag.findOneAndRemove({ slug }).exec((err, data) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }

        if(process.env.GOOGLE_INDEXING_ENABLE)
        {
            const url=process.env.CLIENT_URL+`/tags/${slug}`
            const type='URL_DELETED'   
            const url1=process.env.CLIENT_URL+`/search?${slug}`        
            autosubmiturl(url1,type)    
            autosubmiturl(url,type)
        }
       
        res.json({
            message: 'Tag deleted successfully'
        });
    });
};

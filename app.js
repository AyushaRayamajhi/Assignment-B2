const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory sample data for B2
let weblinks = [
    { id: 1, title: 'Google', url: 'https://www.google.com', rating: 5, category: 'Search' },
    { id: 2, title: 'BBC', url: 'https://www.bbc.com', rating: 4, category: 'News' },
    { id: 3, title: 'Wikipedia', url: 'https://www.wikipedia.org', rating: 5, category: 'Reference' }
];

/**
 * @api {get} /api/weblinks Get all weblinks
 * @apiName GetWeblinks
 * @apiGroup Weblinks
 *
 * @apiSuccess {Object[]} weblinks List of all weblinks.
 */
app.get('/api/weblinks', (req, res) => {
    res.json(weblinks);
});

/**
 * @api {get} /api/weblinks/:id Get one weblink
 * @apiName GetOneWeblink
 * @apiGroup Weblinks
 *
 * @apiParam {Number} id Weblink ID.
 *
 * @apiSuccess {Number} id Weblink ID.
 * @apiSuccess {String} title Weblink title.
 * @apiSuccess {String} url Weblink URL.
 * @apiSuccess {Number} rating Weblink rating.
 * @apiSuccess {String} category Weblink category.
 */
app.get('/api/weblinks/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const weblink = weblinks.find(w => w.id === id);

    if (!weblink) {
        return res.status(404).json({ error: 'Weblink not found' });
    }

    res.json(weblink);
});

/**
 * @api {post} /api/weblinks Create a new weblink
 * @apiName CreateWeblink
 * @apiGroup Weblinks
 *
 * @apiBody {String} title Weblink title.
 * @apiBody {String} url Weblink URL.
 * @apiBody {Number} rating Weblink rating.
 * @apiBody {String} category Weblink category.
 */
app.post('/api/weblinks', (req, res) => {
    const { title, url, rating, category } = req.body;

    if (!title || !url || typeof rating !== 'number' || !category) {
        return res.status(400).json({ error: 'Please provide title, url, rating and category' });
    }

    const newWeblink = {
        id: weblinks.length ? weblinks[weblinks.length - 1].id + 1 : 1,
        title,
        url,
        rating,
        category
    };

    weblinks.push(newWeblink);
    res.status(201).json(newWeblink);
});

/**
 * @api {put} /api/weblinks/:id Update a weblink
 * @apiName UpdateWeblink
 * @apiGroup Weblinks
 *
 * @apiParam {Number} id Weblink ID.
 * @apiBody {String} title Weblink title.
 * @apiBody {String} url Weblink URL.
 * @apiBody {Number} rating Weblink rating.
 * @apiBody {String} category Weblink category.
 */
app.put('/api/weblinks/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { title, url, rating, category } = req.body;

    const index = weblinks.findIndex(w => w.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Weblink not found' });
    }

    if (!title || !url || typeof rating !== 'number' || !category) {
        return res.status(400).json({ error: 'Please provide title, url, rating and category' });
    }

    weblinks[index] = { id, title, url, rating, category };
    res.json(weblinks[index]);
});

/**
 * @api {delete} /api/weblinks/:id Delete a weblink
 * @apiName DeleteWeblink
 * @apiGroup Weblinks
 *
 * @apiParam {Number} id Weblink ID.
 */
app.delete('/api/weblinks/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = weblinks.findIndex(w => w.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Weblink not found' });
    }

    weblinks.splice(index, 1);
    res.json({ message: 'Weblink deleted successfully' });
});

// Export app for tests
module.exports = app;

// Only start server directly if this file is run with node app.js
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
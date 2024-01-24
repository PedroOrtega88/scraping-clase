const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();

const url = 'https://carlosdiazgirol.github.io/dashboard/';

app.get('/', (req, res) => {
    axios.get(url)
        .then((response) => {
            if (response.status === 200) {
                const html = response.data;
                const $ = cheerio.load(html);

                const pageTitle = $('title').text();
                const links = [];

                $('a').each((index, element) => {
                    const link = $(element).attr('href');
                    links.push(link);
                });

                console.log(links);

                res.send(`
                    <html>
                        <head>
                            <title>${pageTitle}</title>
                        </head>
                        <body>
                            <h1>${pageTitle}</h1>
                            <ul>
                                ${links.map(link => `<li>${link}</li>`).join('')}
                            </ul>
                        </body>
                    </html>
                `);
            }
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
            res.status(500).send('Internal Server Error');
        });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

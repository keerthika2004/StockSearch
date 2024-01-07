const express = require('express');
// const { json } = require('express/lib/response');
const https = require('https');
const API_KEY = "c7soo6aad3i9jn7riheg";
const app = express(),
      bodyParser = require("body-parser");
      port = 3080;

app.use(bodyParser.json());
// app.use(express.static(process.cwd()+"/my-app/dist/angular-nodejs-example/"));

// function getData(url){
//   return new Promise((resolve, reject) => {
//     https.get(url, (resp) => {
//       let data = ''; 
//       resp.on('data', (chunk) => {
//         data += chunk;
//       });
//       console.log(data);
//       resp.on('end', () => resolve(data));
//     }).on("error", e => reject(e));
//   });
// }

// app.get('/stock/search', (req, res) => {
//   const url = 'https://finnhub.io/api/v1/stock/profile2?symbol='+req.query.stockTicker+'&token='+API_KEY;
//   // ret = getData(url);
//   // console.log(ret);
//   res.send(getData(url).then(data => JSON.parse(data)));
// });
function getDate(days){
  let current = new Date();
  let date = new Date();
  if (days !==0 ){
    current = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
  }
  let dd = String(current.getDate()).padStart(2, '0');
  let mm = String(current.getMonth() + 1).padStart(2, '0');
  let yyyy = current.getFullYear();

  let ret = yyyy + '-' + mm + '-' + dd;
  return ret
}

app.get('/stock/search', (req, res) => {
  // console.log("Server"+req.query.stockTicker);
  const url = 'https://finnhub.io/api/v1/stock/profile2?symbol='+req.query.stockTicker+'&token='+API_KEY;
  https.get(url, (resp) => {
    let data = ''; 
    resp.on('data', (chunk) => {
      data += chunk;
    });
    resp.on('end', () => {
      res.send(JSON.parse(data));
    });
  });
});

app.get('/stock/history', (req, res) => {
  let current = Math.floor(Date.now() / 1000);
  // console.log(current);
  let sixhago = Math.floor((Date.now()-(6*60*60*1000)) / 1000);
  // console.log(sixhago);
  let twoyago = Math.floor((new Date(new Date().setFullYear(new Date().getFullYear() - 2)).getTime())/1000);
  // console.log(twoyago);
  const url = 'https://finnhub.io/api/v1/stock/candle?symbol='+req.query.stockTicker+'&resolution=5&from='+sixhago+'&to='+current+'&token='+API_KEY;
  https.get(url, (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
      data += chunk;
    });
    resp.on('end', () => {
      console.log(data);
      res.send(JSON.parse(data));
    });
  });
});

app.get('/stock/charts_history', (req, res) => {
  let current = Math.floor(Date.now() / 1000);
  // console.log(current);
  let twoyago = Math.floor((new Date(new Date().setFullYear(new Date().getFullYear() - 2)).getTime())/1000);
  // console.log(twoyago);
  const url = 'https://finnhub.io/api/v1/stock/candle?symbol='+req.query.stockTicker+'&resolution=5&from='+twoyago+'&to='+current+'&token='+API_KEY;
  https.get(url, (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
      data += chunk;
    });
    resp.on('end', () => {
      res.send(JSON.parse(data));
    });
  });
});

app.get('/stock/stockprice', (req, res) => {
  const url = 'https://finnhub.io/api/v1/quote?symbol='+req.query.stockTicker+'&token='+API_KEY;
  https.get(url, (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
      data += chunk;
    });
    resp.on('end', () => {
      res.send(JSON.parse(data));
    });
  });
});

app.get('/stock/autocomplete', (req, res) => {
  const url = 'https://finnhub.io/api/v1/search?q='+req.query.value+'&token='+API_KEY;
  https.get(url, (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
      data += chunk;
    });
    resp.on('end', () => {
      res.send(JSON.parse(data));
    });
  });
});

app.get('/stock/news', (req, res) => {
  let today = getDate(0);
  let weekAgo = getDate(7);
  const url = 'https://finnhub.io/api/v1/company-news?symbol='+req.query.stockTicker+'&from='+weekAgo+'&to='+today+'&token='+API_KEY;
  https.get(url, (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
      data += chunk;
    });
    resp.on('end', () => {
      res.send(JSON.parse(data));
    });
  });
});

app.get('/stock/rectrends', (req, res) => {
  const url = 'https://finnhub.io/api/v1/stock/recommendation?symbol='+req.query.stockTicker+'&token='+API_KEY;
  https.get(url, (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
      data += chunk;
    });
    resp.on('end', () => {
      res.send(JSON.parse(data));
    });
  });
});

app.get('/stock/social', (req, res) => {
  const url = 'https://finnhub.io/api/v1/stock/social-sentiment?symbol='+req.query.stockTicker+'&from=2022-01-01&token='+API_KEY;
  https.get(url, (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
      data += chunk;
    });
    resp.on('end', () => {
      res.send(JSON.parse(data));
    });
  });
});

app.get('/stock/peers', (req, res) => {
  const url = 'https://finnhub.io/api/v1/stock/peers?symbol='+req.query.stockTicker+'&token='+API_KEY;
  https.get(url, (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
      data += chunk;
    });
    resp.on('end', () => {
      res.send(JSON.parse(data));
    });
  });
});

app.get('/stock/earnings', (req, res) => {
  const url = 'https://finnhub.io/api/v1/stock/earnings?symbol='+req.query.stockTicker+'&token='+API_KEY;
  https.get(url, (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
      data += chunk;
    });
    resp.on('end', () => {
      res.send(JSON.parse(data));
    });
  });
});

app.get('/', (req,res) => {
  res.sendFile(process.cwd()+"/my-app/dist/angular-nodejs-example/index.html")
});

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});

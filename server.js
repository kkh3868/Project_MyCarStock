const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const routes = require('./routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.listen(8080, function(){
  console.log('listening on 8080');
});

app.use(express.static(path.join(__dirname, 'mycarstock_react/build')));
app.use(express.static(path.join(__dirname, 'mycarstock_mainpage_react/build')));

app.get('/', routes.homeRouter);
app.post('/', routes.handleLoginRequest);

app.get('/main', routes.mainRouter);
app.post('/main', routes.handleStockSearch);
app.put('/main/:stockInfo', routes.AddStock);
app.delete('/main/:stockInfo', routes.DeleteStock);

app.get('/main/stocks', routes.GetMemberInfo);


app.get('*', routes.homeRouter);

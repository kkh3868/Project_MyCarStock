const express = require('express') //express를 설치했기 때문에 가져올 수 있다.
const app = express()
const path = require('path')


app.listen(8080, function(){
  console.log('listening on 8080');
});
// hello
app.use(express.static(path.join(__dirname, 'mycarstock_react/build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'mycarstock_react/build/index.html'));
});

app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, 'mycarstock_react/build/index.html'));
});
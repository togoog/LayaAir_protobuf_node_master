var ProtoBuf = require("protobufjs");
var ProtoRoot = ProtoBuf.loadSync("./proto/awesome.proto");
var AwesomeMessage = ProtoRoot.lookupType("awesomepackage.AwesomeMessage");
var mysql      = require('mysql');
///连接mysql
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : '******',
  password : '*********',
  database : '***********'
});
connection.connect();
/////---------------------
///*
var message = AwesomeMessage.create(
		{
			awesomeField:'server',
			age:10,
			people:{age:14,name:'alpha_svr'}
		}
);
var errMsg = AwesomeMessage.verify(message);
  if (errMsg){
  	throw Error(errMsg);
}
var buffer = AwesomeMessage.encode(message).finish();
console.log(buffer);
//var message1 = AwesomeMessage.decode(buffer);
//console.log(message1);
//*/

/////---------------------
function formatBuffer(buffer) {
    var bufferArray = Object.keys(buffer).map(function(k) {
        return buffer[k];
    })
    return new Buffer(bufferArray);
}

var io = require('socket.io')(8080);
var client;

io.on('connection', function (socket) {
  client = socket
  //断开
  socket.on("disconnect", OnClose);
			
  //登陆
  socket.on("login", OnLogin);
});

console.log('server is started, port: ' + '8080');		

var OnLogin = function(data){
  console.log('Onlogin1:' + data)
  data = formatBuffer(data)
  //console.log('Onlogin2:' + data)
  client.emit('login',buffer);
  var message = AwesomeMessage.decode(data);
  console.log(message.awesomeField +'\n' + message.age + '\n' + message.people.name + '\n' + message.people.age);
  /*
  var  addSql = 'INSERT INTO websites(Id,name,url,alexa,country) VALUES(1,?,?,?,?)';
  var  addSqlParams = ['alpha_node', 'https://c.runoob.com','23453', 'CN'];
  connection.query(addSql,addSqlParams,function (err, result) {
      if(err){
       console.log('[INSERT ERROR] - ',err.message);
       return;
      }
      console.log('--------------------------INSERT----------------------------');
      console.log('INSERT ID:',result);
      console.log('------------------------------------------------------------\n');
  });
  */
  var  sql = 'SELECT * FROM websites where Id=1';
  //查
  connection.query(sql,function (err, result) {
    if(err){
      console.log('[SELECT ERROR] - ',err.message);
      return;
    }
     console.log('--------------------------SELECT----------------------------');
     console.log(result);
     console.log('------------------------------------------------------------\n');  
  });
}

var OnClose = function(data){
  console.log('OnClose')

}

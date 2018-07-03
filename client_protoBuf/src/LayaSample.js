(function()
{
	var Loader = Laya.Loader;
	var Browser = Laya.Browser;
	var Handler = Laya.Handler;

	var ProtoBuf = Browser.window.protobuf;

	Laya.init(550, 400);

	ProtoBuf.load("../res/protobuf/awesome.proto", onAssetsLoaded);
	var buffer;
	var AwesomeMessage;

	function onAssetsLoaded(err, root)
	{
		if (err)
			throw err;

		// Obtain a message type
		AwesomeMessage = root.lookup("awesomepackage.AwesomeMessage");

		// Create a new message
		var message = AwesomeMessage.create(
			{
				awesomeField:'client',
				age:25,
				people:{age:13,name:'alpha_client'}
			}
		);

		// Verify the message if necessary (i.e. when possibly incomplete or invalid)
		var errMsg = AwesomeMessage.verify(message);
		if (errMsg){
			throw Error(errMsg);
		}

		// Encode a message to an Uint8Array (browser) or Buffer (node)
		buffer = AwesomeMessage.encode(message).finish();
		// ... do something with buffer
		// Or, encode a plain object
		// var buffer = AwesomeMessage.encode(
		// {
		// 	awesomeField: "AwesomeString"
		// }).finish();
		// ... do something with buffer
		console.log(buffer);
		// // Decode an Uint8Array (browser) or Buffer (node) to a message
		// buffer = formatBuffer(buffer)
		// console.log(buffer.toBuffer());
		// buffer = new Uint8Array(buffer)
		// console.log(buffer);
		
		// var message1 = AwesomeMessage.decode(buffer);
		// console.log(message1);
		// console.log(message1.people.age);
		// console.log(message1.people.name);
		// ... do something with message
		
		// If your application uses length-delimited buffers, there is also encodeDelimited and decodeDelimited.
	}

	var socket;
	socket = io.connect('http://game.alphayan.cn:8080');
	
	socket.on('error', function() {
    	console.log("与服务器连接发生错误");
	});
	socket.on('connecting', function() {
    	console.log("正在与服务器连接");
	});
	socket.on('connect', function() {
    	console.log("与服务器连接成功");
		socket.emit('login',buffer);
	});

	socket.on('connect_failed', function() {
    	console.log("与服务器连接失败");
	});

	socket.on('disconnect', function() {
    	console.log("与服务器断开");
	});

	socket.on('reconnect', function() {
    	console.log("重新连接到服务器");
	});
	socket.on('login', function(data) {
		var buffer1 = new Uint8Array(data)
		
    	console.log("login "+buffer1);

		var message1 = AwesomeMessage.decode(buffer1);
		console.log(message1);
		console.log(message1.people.age);
		console.log(message1.people.name);
	});

})();
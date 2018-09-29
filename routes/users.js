var express = require('express');
var router = express.Router();
//引入连接数据库模块
const connection =require('./connect');

//调用连接方法 测试是否连接成功
// connection.connect(() =>{
//   console.log('数据库连接成功')
// });
//调用连接方法 
connection.connect();


/* 接收用户管理根目录请求  添加账户管理功能*/
router.post('/userAdd', function(req, res) {
  //接收数据
   let {username,password,groups}=req.body;
   //测试是否接收到数据
   //  console.log('后端接收到的数据',username,password,groups)
   //将数据存入数据库users  nodejs操作数据库
   //1） 构造sql语句  插入数据库（增加）
   const sqlStr = `insert into users(username,password,groups) values('${username}','${password}','${groups}') `
   //2)执行sql语句
   connection.query(sqlStr,(err,data) => {
     if(err){
       throw err;
     }else{ 
       // 否则 检查是否插入成功:console.log(data);
      // 判断 如果受影响的行数 > 0 就是插入成功了
      if (data.affectedRows > 0) {
        // 响应一个成功的数据对象回去
        res.send({"errcode": 1, "msg":"添加成功!"})
      } else {
        // 否则 就是插入失败 响应一个失败的数据对象回去
        res.send({"errcode": 0, "msg":"添加失败!"})
      }
     }
   });
});
/*接收显示所有用户账户 的请求*/
router.get('/userList',(req,res) =>{
  //构造sql 查询所有用户账号
  const sqlStr=`select * from users order by ctime desc`
  //执行sql
  connection.query(sqlStr,(err,data) => {
    //如果有错 抛出错误
    if(err){
      throw err;
    }else{
      //打印数据库中所有的数据console.log(data)
      //否则直接将所有的数据返回给前端
      res.send(data);
    }
  })
});
//接收单条删除的请求
router.get('/userDeleteOne',(req,res) =>{
  //接收id
    let {id}=req.query
    //测试是否接收console.log(id);
  //构造根据id删除指定数据的sql语句
  const sqlStr= `delete from users where id=${id}`;
  //执行单条删除sql语句删除
  connection.query(sqlStr,(err,data) =>{
    if(err){
      throw err;
    }else{
     // 测试：console.log(data)
      //否则   如果受影响的数据大于》0 返回给前端删除成功的数据对象
      if (data.affectedRows > 0) {
        // 响应一个成功的数据对象回去
        res.send({"errcode": 1, "msg":"删除成功!"})
      } else {
        // 否则 就是插入失败 响应一个失败的数据对象回去
        res.send({"errcode": 0, "msg":"删除失败!"})
      }
      
    }
  })
})
//修改功能的实现   接收修改页面传输过来的id 把原来的数据查询出来
router.get('/useredit',(req,res) => {
  //接收id
  let {id}=req.query;//console.log(id)
  //构造sql语句 根据id查询该条数据
  let sqlStr=`select * from users where id=${id}` //console.log(sqlStr)
  //执行sql语句
  connection.query(sqlStr,(err,data)=>{
    if(err){
      throw err;
    }else{
      res.send(data);
    }
  })
})
//修改功能的实现   接收修改后数据
router.post('/saveedit',(req,res) =>{
  //接收修改后的数据
  let {username,password,groups,id}=req.body;// console.log(username,password,groups,id)
 //构造sql语句 更新数据
 let sqlStr=`update users set username='${username}',password='${password}',groups='${groups}' where id=${id}`//console.log(sqlStr)
 
 //执行sql语句
 connection.query(sqlStr,(err,data)=>{
   if(err){
     throw err;
   }else{
     //console.log(data);
     if(data.affectedRows>0){
       res.send({"errcode":1,"msg":"更改成功"})
     }else{
      res.send({"errcode":0,"msg":"更改失败"})
     }
   }
 })
  
})
//批量删除功能 根据id接收数据
router.post('/batchesDel',(req,res)=>{
  //接收前端传来的id
  let idArr=req.body['idArr[]'] //console.log(id) 放在一个数组里面
  // 构造sql 根据id们 把这些被选中的数据全部删除  
  const sqlStr = `delete from users where id in (${idArr})`;//console.log(sqlStr)
  //执行sql 语句 删除id对应的数据
  connection.query(sqlStr,(err,data) =>{
    if(err){
       throw err;
    }else{
      //console.log(data);
      if(data.affectedRows>0){
        res.send({"errcode":1,"msg":"批量删除成功"})
      }else{
        res.send({"errcode":0,"msg":"批量删除失败"})
      }
    }
  })

  //res.send('1')
})
//登录功能的实现  接收前端发送过来的 用户民和密码
router.post('/checkLogin',(req,res)=>{
  //接收前端发送的数据
  let {username,password}=req.body; //console.log(username,password)
 //构造sql语句 查找username 且 password 对应的数据
 let sqlStr=`select * from users where username='${username}' and password='${password}'`//console.log(sqlStr)
 //执行sql语句
 connection.query(sqlStr,(err,data)=>{
   if(err){
     throw err
   }else{
     //console.log(data[0])

     if(data.length){
       //登录成功 
       //设置cookie 
     res.cookie('username', data[0].username);
     res.cookie('password', data[0].password);
     res.cookie('groups', data[0].groups);
       res.send({"errcode" :1,"msg":"登录成功"})
     }else{
      res.send({"errcode" :0,"msg":"登录失败，请重新登录"})
     }
     
     
   }
 })
})
//检测是否登录
router.get('/checkIsLogin',(req,res)=>{
  //定义变量保存获取的cookie
  let username= req.cookies.username;
  //判断 如果存在
  if(username){
    res.send('1')
  }else{
    res.send('alert("请登录");location.href="http://localhost:256/login.html"')
  } 
})
//退出登录功能
router.get('/logout',(req,res)=>{
   // 清除cookie
   res.clearCookie('username');
   res.clearCookie('password');
   res.clearCookie('groups');
    // 弹出对应提示 跳转到登录页面
  res.send('<script>alert("下次需要重新登录哟"); location.href="http://localhost:256/login.html";</script>')
})
module.exports = router;

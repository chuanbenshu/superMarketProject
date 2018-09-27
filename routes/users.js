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

module.exports = router;

const mysql = require('mysql')

const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    port:'3306',
    password: '',
    database: 'restu'

  })

  connection.connect((err)=>{
      if(!err)
      console.log("Db Connected!!")
      else
      console.log(err)

  })
 

  module.exports=connection
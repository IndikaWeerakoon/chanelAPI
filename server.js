const express = require('express');
const body_parser = require('body-parser');
const mysql = require('mysql');

const app = express();
const router = express.Router();

app.use(body_parser.json());
app.use(body_parser.urlencoded({
    extended: true
}));
app.use('/api',router);
//msqli confiquration
const mc = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'node_task_demo'
});

//mysql connect
mc.connect(err=>{
    if(err) throw err;
    console.log('Database Successfully Connected');
});

//defalt router
app.get('/',(req,res)=>{
    return res.send({error:true,massege:'hello'})
});

//send all todos 
app.get('/todos',(req,res)=>{
    mc.query('SELECT * FROM tasks',(err,results,fields)=>{
        if(err) throw err;
        return res.status(200).send({error:false,dara:results,massege:'todos list'});
    });
});

//retrieve todos with id
app.get('/todos/:id',(req,res)=>{
    let tast_id = req.params.id;

    if(!tast_id){
        res.status(404).send({error:true,massege:"please provide a task id"});
    }
    mc.query('SELECT * FROM tasks WHERE id=?',tast_id,(error,results,fields)=>{
        if(error) throw error;
        return res.status(200).send({error:false,data:results,massege:'todo list'})
    });
});

//search from todos tith bug in there names
app.get('/todos/search/:keyword',(req,res)=>{
    let key = req.params.keyword;
    mc.query('SELECT * FROM tasks WHERE task LIKE ?',['%'+key+'%'],(error,results,fields)=>{
        if(error) throw error;
        return res.send({error:false,data:results,massege:'todo List'});

    });
});
//add some task to the database
app.post('/todo',(req,res)=>{
    let task = req.body.task;
    if(!task){
        res.send({error:true,massege:"Task is not set"});
    }

    mc.query('INSERT INTO tasks SET ?',{task: task.task},(error,results,fields)=>{
        if(error) throw error;
        return res.send({error:false,data:results,massege:'new task created'});
    });
    
});
//DElete item by id
app.delete('/todo',(req,res)=>{
    let task_id = req.body.task_id;

    if(!task_id){
        res.status(404).send({error:true,massage:"task id is requered"})
    }
    mc.query('DELETE FROM tasks WHERE id =?',[task_id],(error,results,fields)=>{
        if(error) throw error;
        res.send({error:false,data:results,massage:'item deleted'});
    });
});

//Update a particular item
app.put("/todo",(req,res)=>{
    let task = req.body;

    if(!task.id||!task.task){
        res.status(404).send({error:true,massage:'Request body is missed'});
    }

    mc.query('UPDATE tasks SET task = ? WHERE id = ?',[task.task,task.id],(error,results,fields)=>{
        if(error) throw error;
        res.send({error:false,data:results,massage:'item Updated'});
    });
});

//create server
app.listen(8080,(req,res)=>{
    console.log('You are listening to the port 8080');
});
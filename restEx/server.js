var mysql = require('mysql');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// connection configurations
const mc = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node_task_demo'
});
 
// connect to database
mc.connect();
 
 
// default route
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'hello' })
});
 
// port must be set to 8080 because incoming http requests are routed from port 80 to port 8080
app.listen(8080, function () {
    console.log('Node app is running on port 8080');
});


// Retrieve all todos 
app.get('/todos', function (req, res) {
    mc.query('SELECT * FROM tasks', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Todos list.', count:results.length });
    });
});


// Retrieve todo with id 
app.get('/todo/:id', function (req, res) {
 
    let task_id = req.params.id;
 
    if (!task_id) {
        return res.status(400).send({ error: true, message: 'Please provide task_id' });
    }
 
    mc.query('SELECT * FROM tasks where id=?', task_id, function (error, results, fields) {
        if(results.length>0) {      
        if(error)
        throw error;
        return res.send({ error: false, data: results[0], message: 'Todos list.', count:results.length});  
        }else{
            if(error)
            throw error;
            return res.send({ error: true, message: 'Error occured.', count:results.length});
        }   
    });
});




// Search for todos with ‘bug’ in their name
app.get('/todos/search/:keyword', function (req, res) {
    let keyword = req.params.keyword;
    mc.query("SELECT * FROM tasks WHERE task LIKE ? ", ['%' + keyword + '%'], function (error, results, fields) {
        if(results.length>0) {       
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Todos search list.', count:results.length }); 
        }else{
            if(error)
            throw error;
            return res.send({ error: true, message: 'Error occured.', count:results.length});
        }   
    });
});


// Add a new todo  
app.post('/todo',  (req, res)=> {
 
    let task = req.body.task;
 
    if (!task) {
        return res.status(400).send({ error:true, message: 'Please provide task' });
    }
 
    mc.query("INSERT INTO tasks SET ? ", { task: task }, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'New task has been created successfully.' });
    });
});


//  Delete todo

//number of affected rows walin count 1
app.delete('/todo/:id', function (req, res) {
 
    //let task_id = req.body.task_id;
    let task_id = req.params.id;
 
    if (!task_id) {
        return res.status(400).send({ error: true, message: 'Please provide task_id' });
    }
    mc.query('DELETE FROM tasks WHERE id = ?', [task_id], function (error, results, fields) {              
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Task has been deleted successfully.'});
    });
}); 


//  Update todo with id
app.put('/todo', function (req, res) {
 
    let task_id = req.body.task_id;
    let task = req.body.task;
 
    if (!task_id || !task) {
        return res.status(400).send({ error: task, message: 'Please provide task and task_id' });
    }
 
    mc.query("UPDATE tasks SET task = ? WHERE id = ?", [task, task_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Task has been updated successfully.' });
    });
});


// all other requests redirect to 404
app.all("*", function (req, res, next) {
    return res.send({ error: true,  message: 'Page not found' });
    next();
});



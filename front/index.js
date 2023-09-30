let express = require('express'); // оснастка веб сервера
let app = express();

// строка для подключения к базе данных.
let sqlConfig = {
    user: 'sa',
    password: 'root',
    server: 'localhost',
    database: 'rest'
}
let db = new sqlite3.Database('./db/rest.db');

// сервер для http://localhost:8081/
let server = app.listen(8081, function () {
    let host = server.address().address
    let port = server.address().port

    console.log("сервер доступен по url http://%s:%s", host, port)
});

app.get('/sales', function (req, res) {
    db.get(sql, [], (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        return row
            ? console.log(row.id, row.name)
            : console.log(`No playlist found with the id ${playlistId}`);

    });
    sql.connect(sqlConfig, function() {
        let request = new sql.Request();
        request.query('select * from sales', function(err, resp) {
            if(err) console.log(err);
            res.json(resp.recordset); // результат в формате JSON
            sql.close(); // закрываем соединение с базой данных
        });
    });
});

app.get('/sales/:id', function (req, res) {
    sql.connect(sqlConfig, function() {
        let request = new sql.Request();
        request.input('input_parameter', sql.Int, Number(req.params.id)) // защита от SQL-инъекций и преобразование к числовому типу
            .query('select * from sales where id = @input_parameter', function(err, resp) {
                if(err) console.log(err);
                res.json(resp.recordset); // результат в формате JSON
                sql.close(); // закрываем соединение с базой данных
            });
    });
});

app.post('/sales/:id/invoices', function (req, res) {
    sql.connect(sqlConfig, function() {
        let request = new sql.Request();
        request.input('idSales', sql.Int, Number(req.params.id)) // защита от SQL-инъекций
            .execute('addInvoices', function(err, resp, returnValue, affected) {
                if(err) console.log(err);
                res.json(resp.recordset); // результат в формате JSON
                sql.close(); // закрываем соединение с базой данных
            });
    });
});

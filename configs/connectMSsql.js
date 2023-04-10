const mssql_config = {
    user: 'rupam', // better stored in an app setting such as process.env.DB_USER
    password: 'Module@12345', // better stored in an app setting such as process.env.DB_PASSWORD
    server: 'email-automation-sql-server.database.windows.net', // better stored in an app setting such as process.env.DB_SERVER
    port: 1433, // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
    database: 'email-automation-sqldb', // better stored in an app setting such as process.env.DB_NAME
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
}

module.exports = mssql_config
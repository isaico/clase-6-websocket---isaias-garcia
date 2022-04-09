const configSQLite={
    client:'sqlite3',
    connection:{
        filename:'./src/db/mydb.sqlite'
    },
    useNullAsDefault:true
}
module.export = {configSQLite}

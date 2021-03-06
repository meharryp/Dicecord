const postGres = require('pg');

const pgHandler = module.exports = {
    client: new postGres.Client({
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    }),
    init: () => {
        pgHandler.client.connect();
        console.log('-- > Successfully connected to the PostGres database');
    },
    selectFromDB: (dbName) => {
        return new Promise((resolve, reject) => {
            pgHandler.client.query('SELECT * FROM public.' + dbName, (err, res) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(res.rows);
                }
            });
        });
    },
    insertIntoDB: (dbName, columnNames, values) => {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM public." + dbName + " WHERE ";
            const whereClause = columnNames[0] + " = '" + values[0] + "'";

            //console.log(query + whereClause + ';');
            pgHandler.client.query(query + whereClause + ';', (err, res) => {
                if(err) {
                    reject(err);
                }
                else if(!res.rows || !res.rows.length) {
                    let insertQuery = "INSERT INTO public." + dbName +
                        " (" + JSON.stringify(columnNames).slice(1, -1).replace(/"/g, '') +
                        ") VALUES (" ;

                    let valuesText = '';
                    for(let i = 0; i < values.length; i++) {
                        valuesText += "'" + values[i] + "'";
                        if(i < values.length - 1) {
                            valuesText += ', ';
                        }
                    }
                    //console.log(insertQuery + valuesText + ');');
                    pgHandler.client.query(insertQuery + valuesText + ');', (err) => {
                        if(err) {
                            reject(err);
                        }
                        else {
                            resolve();
                        }
                    });
                }
                else {
                    const updateQuery = "UPDATE public." + dbName + " SET ";
                    let updateFields = '';
                    for(let i = 1; i < columnNames.length; i++) {
                        updateFields += columnNames[i] + " = '" + values[i] + "'";
                        if(i < columnNames.length - 1) {
                            updateFields += ', ';
                        }
                    }
                    //console.log(updateQuery + updateFields + " WHERE " + whereClause + ';');
                    pgHandler.client.query(updateQuery + updateFields + " WHERE " + whereClause + ';', (err) => {
                        if(err) {
                            reject(err);
                        }
                        else {
                            resolve();
                        }
                    });
                }
            });
        })
    }
};
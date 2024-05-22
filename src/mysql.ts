import mysql from 'mysql'
import config from './config.js'

const params = {
    host: config.mysql.host,
    port: Number(config.mysql.port),
    database: config.mysql.database,
    user: config.mysql.user,
    password: config.mysql.password
};

const Connect = async () =>
    new Promise<mysql.Connection>((resolve, reject) => {
        const connection = mysql.createConnection(params);

        connection.connect((error) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(connection);
        });
    });

const Query = async <Type>(connection: mysql.Connection, query: string): Promise<Type> =>
    new Promise((resolve, reject) => {
        connection.query(query, connection, (error, result) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(result as Type);
        });
    });

export { Connect, Query };
import * as mysql from 'mysql2/promise';
import configuration from 'src/core/config';

const { db } = configuration();

// 创建连接池，设置连接池的参数
const pool = mysql.createPool({
  host: db.mysql.host, // 数据库服务器地址
  user: db.mysql.username, // 连接名
  database: db.mysql.database, // 数据库名
  port: db.mysql.port, //数据库端口
  password: db.mysql.password, // 数据库密码
  waitForConnections: true,
  connectionLimit: 10, //最大连接数，默认为10
  maxIdle: 10, // 最大空闲连接数，默认等于 `connectionLimit`
  idleTimeout: 60000, // 空闲连接超时，以毫秒为单位，默认值为 60000 ms
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

async function query(sql: string, values?: any[]) {
  // 连接池初始化
  const conn = await pool.getConnection();

  try {
    // 查询
    const [rows] = await conn.query(sql, values);
    return rows;
  } catch (error) {
    throw error;
  } finally {
    //释放链接（在缓冲池，没有被销毁）
    conn.release();
  }
}

export default query;

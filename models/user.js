const sha256 = require('js-sha256');


/**
 * ===========================================
 * Export model functions as a module
 * ===========================================
 */
module.exports = (pool) => {
  const index = (username, callback) => {
    const queryString = `SELECT * FROM users WHERE name != '${username}'`;
    pool.query(queryString, (error, queryResult) => {
      if (error) {
        console.log('error getting all users:', error);
        callback(error, null);
      } else if (queryResult.rows.length === 0) {
        callback(null, null);
      } else {
        callback(null, queryResult.rows);
      }
    });
  };

  const create = (user, callback) => {
    const hashedValue = sha256(user.password);
    const queryString = 'INSERT INTO users (name, password) VALUES ($1, $2) RETURNING *';
    const values = [
      user.name,
      hashedValue
    ];

    pool.query(queryString, values, (error, queryResult) => {
      if (error) {
        console.log('error creating user:', error);
        callback(error, null);
      } else {
        callback(null, queryResult.rows[0]);
      }
    });
  };

  const get = (username, callback) => {
    const queryString = `SELECT * FROM users WHERE name = '${username}'`;
    pool.query(queryString, (error, queryResult) => {
      if (error) {
        console.log('error getting user:', error);
        callback(error, null);
      } else {
        callback(null, queryResult.rows[0]);
      }
    });
  };

  const update = (username, bio, callback) => {
    const queryString = `UPDATE users SET bio = ($1) WHERE name = '${username}' RETURNING *`;
    const values = [bio];
    pool.query(queryString, values, (error, queryResult) => {
      if (error) {
        console.log('error updating user bio:', error);
        callback(error, null);
      } else {
        callback(null, queryResult.rows[0]);
      }
    });
  };

  const follow = (user, follower, callback) => {
    const queryString = 'INSERT INTO followers (user_name, follower_name) VALUES ($1, $2) RETURNING *';
    const values = [user, follower];
    pool.query(queryString, values, (error, queryResult) => {
      if (error) {
        console.log('error following user:', error);
        callback(error, null);
      } else {
        callback(null, queryResult.rows[0]);
      }
    });
  };

  const following = (user, callback) => {
    const queryString = `SELECT user_name FROM followers WHERE follower_name = '${user}'`;
    pool.query(queryString, (error, queryResult) => {
      if (error) {
        console.log('error getting following:', error);
        callback(error, null);
      } else {
        callback(null, queryResult.rows);
      }
    });
  };

  const unfollow = (user, follower, callback) => {
    const queryString = `DELETE from followers WHERE user_name = '${user}' AND follower_name = '${follower}'`;
    pool.query(queryString, (error, queryResult) => {
      if (error) {
        console.log('error unfollowing user:', error);
        callback(error, null);
      } else {
        callback(null, queryResult.rows);
      }
    });
  };

  return {
    create,
    get,
    index,
    update,
    follow,
    unfollow,
    following
  };
};

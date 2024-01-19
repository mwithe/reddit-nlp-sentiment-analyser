const redis = require("redis");

async function createRedisClient(client) {
client = redis.createClient();
(async () => {
    try {
      await  client.connect();  
    } catch (err) {
      console.log(err);
    }
})();
return client;
};

module.exports = {createRedisClient};

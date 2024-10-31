module.exports = {
  "apps": [
    {
      "name": "sned-api",
      "script": "dist/index.js",
      "env": {
        "DB_USERNAME": "postgres",
        "DB_HOST": "159.69.31.178",
        "DB_PORT": "5432"
      }
    }
  ]
}
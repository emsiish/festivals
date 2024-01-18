const { AsyncDatabase } = require("promised-sqlite3");

const dbPromise = (async () => {
    try {
        // Create the AsyncDatabase object and open the database.
        const db = await AsyncDatabase.open("./db.sqlite");

        // Access the inner sqlite3.Database object to use the API that is not exposed by AsyncDatabase.
        db.inner.on("trace", (sql) => console.log("[TRACE]", sql));

        // Run some sql request.
        // language=SQL format=false
        await db.run(
            `CREATE TABLE IF NOT EXISTS events ( 
                    id INTEGER PRIMARY KEY AUTOINCREMENT, 
                    title TEXT NOT NULL, 
                    description TEXT NOT NULL,
                    date TEXT NOT NULL,
                    price INTEGER NOT NULL
            )
            `
        );

        return db;
    } catch (err) {
        console.error(err);
    }
})();

const db = {
    async all(...args) {
        return (await dbPromise).all(...args);
    },
    async run(...args) {
        return (await dbPromise).run(...args);
    },
    async get(...args) {
        return (await dbPromise).get(...args);
    }
};
export { db };
function pgTable(tableName, columns) {
  return { tableName, columns };
}

const users = pgTable("users", {
  id: { name: "id", type: "serial" },
  name: { name: "name", type: "varchar" },
});

console.log(JSON.stringify({ table: users.tableName, colCount: Object.keys(users.columns).length }));

const knex = require("../db/connection");
const tableName = "tables"

function list() {
    return knex(tableName)
    .orderBy("table_name")
}

function create(table) {
  return knex(tableName)
    .insert(table, "*")
    .then((createdTables) => createdTables[0]);
}

function seat(table_id, reservation_id) {
    return knex.transaction(async (transaction) => {
           return knex("tables")
          .where({ table_id })
          .update({ reservation_id }, "*")
          .transacting(transaction)
          .then((records) => records[0]);
    });
}

// read 
function read(table_id) {
    return knex(tableName)
        .where("table_id", table_id)
        .first();
}

function occupy(table) {
    return knex.transaction(async (transaction) => {
       
      return knex(tableName)
        .where({ table_id: table.table_id })
        .update({ reservation_id: null }, "*")
        .transacting(transaction)
        .then((records) => records[0]);
    });
}

module.exports = {
  create,
  list,
  seat,
  read,
  occupy
};
exports.up = function (knex) {
  return knex.schema.createTable("reservations", (table) => {
    table.increments("reservation_id").primary();
    table.string('first_name');
    table.string('last_name');
    table.string('mobile_number');
    table.string('reservation_date');
    table.string('reservation_time');
    table.string('people');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.string("status").defaultTo("booked");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("reservations");
};
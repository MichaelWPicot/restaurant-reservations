
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex.raw("TRUNCATE TABLE tables RESTART IDENTITY CASCADE").then(()=>{
      // Inserts seed entries
      return knex('tables').insert([
        {capacity:1, table_name:'Bar #1', reservation_id:null},
        {capacity:1, table_name:'Bar #2', reservation_id:null},
        {capacity:6, table_name:'#1', reservation_id:null},
        {capacity:6, table_name:'#2', reservation_id:null}
      ]);
    });
};

const { v4: uuidv4 } = require("uuid");

exports.seed = async function (knex) {
  // Deletes ALL existing entries
  return knex("user")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("user").insert([
        {
          id: uuidv4(),
          name: "Dwight S",
          img_path: "images/dwight.png",
        },
      ]);
    });
};

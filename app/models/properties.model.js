// CREATE TABLE properties (
//   id smallint unsigned not null auto_increment,
//   name varchar(255) not null,
//   address varchar(255) not null,
//   city varchar(255) not null,
//   state varchar(255) not null,
//   zip_code varchar(255) not null,
//   county varchar(255) not null,
//   phone varchar(255) not null,
//   type varchar(255) not null,
//   capacity varchar(255) not null,
//   constraint pk_properties primary key (id)
// );

// alter table
//   properties
// add
//   image varchar (255);

const sql = require("./db.js");
// constructor
const Properties = function(property) {
  this.name = property.name;
  this.address = property.address;
  this.city = property.city;
  this.state = property.state;
  this.zip_code = property.zip_code;
  this.county = property.county;
  this.phone = property.phone;
  this.type = property.type;
  this.capacity = property.capacity;
  this.image = property.image;
};

Properties.create = (newProperties, result) => {
  sql.query("INSERT INTO properties SET ?", newProperties, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created property: ", { id: res.insertId, ...newProperties });
    result(null, { id: res.insertId, ...newProperties });
  });
};

Properties.getAll = result => {
  sql.query("SELECT * FROM properties", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Properties.findByFilterItem = (filterItem, result) => {
  sql.query(`SELECT * FROM properties WHERE city LIKE '${filterItem}%' OR name LIKE '%${filterItem}%' OR state LIKE '${filterItem}%'`, (err, res) => {
    if (err) {""
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found property: ", res);
      result(null, res);
      return;
    }

    // not found property with the item
    result({ kind: "not_found" }, null);
  });
};

Properties.findById = (propertyId, result) => {
  console.log(propertyId);
  sql.query(`SELECT image FROM properties WHERE id = ${propertyId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found images: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found images with the id
    result({ kind: "not_found" }, null);
  });
};

module.exports = Properties;

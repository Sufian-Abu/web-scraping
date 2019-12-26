const Nightmare = require('nightmare');
const cheerio = require('cheerio');
const cheerioTableparser = require('cheerio-tableparser');
const Properties = require("../models/properties.model.js");
const path = require("path");

exports.create = (req, res) => {
  const nightmare = Nightmare({ show: true })
  const url = 'https://apps.hhs.texas.gov/LTCSearch/namesearch.cfm';
  const isle = 'The Isle At Watermere';
  const isleImages = ['public/images/the_isle_at_watermere/isle_one.jpg', 'public/images/the_isle_at_watermere/isle_two.png', 'public/images/the_isle_at_watermere/isle_three.png'];
  const creekside = 'Brookdale Creekside';
  const creeksideImages = ['public/images/brookdale_creekside/creekside_one.jpg', 'public/images/brookdale_creekside/creekside_two.jpg', 'public/images/brookdale_creekside/creekside_three.jpg'];
  const delaney = 'The Delaney At Georgetown Village';
  const delaneyImages = ['public/images/the_delaney_at_georgetown_village/delaney_one.png', 'public/images/the_delaney_at_georgetown_village/delaney_two.png', 'public/images/the_delaney_at_georgetown_village/delaney_three.png'];


  // Request making using nightmare
  nightmare
    .goto(url)
    .wait('body')
    .type('input.ui-autocomplete-input', isle)
    .click('button.ctaButton')
    .wait('table.sortabletable')
    .evaluate(() => document.querySelector('body').innerHTML)
    .end()
    .then(response => {
      saveData(getData(response));
    }).catch(err => {
      console.log(err);
    });

  // Parsing data using cheerio
  let getData = html => {
    const $ = cheerio.load(html);
    cheerioTableparser($);
    var data = ($("table.sortabletable").parsetable());
    return data;
  }
  var objectData = {} ;
  var s3Image;
  let saveData = (data) => {
    for (var item in data) {
      var key = data[item][0];
      objectData[key] = [];
      objectData[key].push(data[item][1]);
    }

    uploadFile(isleImages, 6000)
    .then(response => {
      // Create a Properties
      const property = new Properties({
        name: (""+objectData.Provider).split(/[></]/)[2],
        address: objectData.Address[0],
        city: objectData.City[0],
        state: '',
        zip_code: objectData['ZIP Code'][0],
        county: objectData.County[0],
        phone: objectData.Phone[0],
        type: objectData.Type[0],
        capacity: '',
        image: JSON.stringify(response),
      });
    // Save Properties in the databas
      Properties.create(property, (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Customer."
          });
        else res.send(data);
      });
    }).catch(err => {
      console.log(err);
    });
  }
};

exports.createFlorida = (req, res) => {
  const nightmare = Nightmare({ show: true })
  const url = 'https://www.floridahealthfinder.gov/facilitylocator/FacilitySearch.aspx';
  const legacy = 'Legacy At Highwoods Preserve';
  const legacyImages = ['public/images/legacy_at_highwoods_preserve/legacy_one.jpg', 'public/images/legacy_at_highwoods_preserve/legacy_two.png', 'public/images/legacy_at_highwoods_preserve/legacy_three.jpg'];
  const Emerald = 'Emerald Park of Hollywood';
  const emeraldImages = ['public/images/emerald_park_of_hollywood/emerald_one.jpg', 'public/images/emerald_park_of_hollywood/emerald_two.jpg', 'public/images/emerald_park_of_hollywood/emerald_three.jpg'];
  const Banyan = 'Banyan Place';
  const banyanImages = ['public/images/banyan_place/banyan_one.png', 'public/images/banyan_place/banyan_two.jpg', 'public/images/banyan_place/banyan_three.jpg'];

  // Request making using nightmare
  nightmare
    .goto(url)
    .wait('body')
    .select('select', 'ALL')
    .type('input.DefaultField', legacy)
    .click('#ctl00_mainContentPlaceHolder_SearchButton')
    .wait('table.display')
    .evaluate(() => document.querySelector('body').innerHTML)
    .end()
    .then(response => {
      saveFloridaData(getData(response));
    }).catch(err => {
      console.log(err);
    });

  // Parsing data using cheerio
  let getData = html => {
    const $ = cheerio.load(html);
    cheerioTableparser($);
    var data = ($("#ctl00_mainContentPlaceHolder_dgFacilities").parsetable(true, true, true));
    return data;
  }
  var objectFloridaData1 = {} ;
  var objectFloridaData2 = {} ;

  let saveFloridaData = (data) => {
    for (var item in data) {
      var key = data[item][0];
      objectFloridaData1[key] = [];
      objectFloridaData2[key] = [];
      objectFloridaData1[key].push(data[item][1]);
      objectFloridaData2[key].push(data[item][2]);
    }
    uploadFile(legacyImages, 10000)
    .then(response => {
      // Create a Properties
      const property1 = new Properties({
        name: objectFloridaData1.Name[0],
        address: objectFloridaData1['Street Address'][0],
        city: objectFloridaData1.City[0],
        state: objectFloridaData1.State[0],
        zip_code: objectFloridaData1.Zip[0],
        county: '',
        phone: objectFloridaData1['Phone Number'][0],
        type: objectFloridaData1.Type[0],
        capacity: objectFloridaData1['Licensed Beds'][0],
        image: JSON.stringify(response),
      });
      const property2 = new Properties({
        name: objectFloridaData2.Name[0],
        address: objectFloridaData2['Street Address'][0],
        city: objectFloridaData2.City[0],
        state: objectFloridaData2.State[0],
        zip_code: objectFloridaData2.Zip[0],
        county: '',
        phone: objectFloridaData2['Phone Number'][0],
        type: objectFloridaData2.Type[0],
        capacity: objectFloridaData2['Licensed Beds'][0],
        image: JSON.stringify(response),
      });
    // Save Properties in the database
      Properties.create(property1, (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the properties."
          });
        else res.send(data);
      });

      Properties.create(property2, (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the properties."
          });
        else res.send(data);
      });
  }).catch(err => {
      console.log(err);
  });
  }
};

exports.findAll = (req, res) => {
  Properties.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving properties."
      });
    else res.send(data);
  });
};

exports.filterProperties = (req, res) => {
  Properties.findByFilterItem(req.query.filterItem, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found properties with search item ${req.query.filterItem}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving properties with search " + req.query.filterItem
        });
      }
    } else res.send(data);
  });
};

exports.findImagesById = (req, res) => {
  Properties.findById(req.query.propertyId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Images with id ${req.params.propertyId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Images with id " + req.params.propertyId
        });
      }
    } else res.send(data);
  });
};

async function sleep(ms) {
   return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

// S3 BUCKET IMAGE UPLOAD

let uploadFile = async (data, timeOut) => {
  const fs = require('fs');
  const AWS = require('aws-sdk');

  // Enter copied or downloaded access ID and secret key here
  const ID = '';
  const SECRET = '';

  // The name of the bucket that you have created
  const BUCKET_NAME = 'boomers-hub';
  const s3ImageArray = [];

  const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
  });

  for (const value of data) {
    const fileContent = fs.readFileSync(value);
    var fileName = path.basename(value);
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName, // File name you want to save as in S3
      Body: fileContent
    };
    s3.upload(params, function (err, data) {
      if (err) {
        throw err;
      }
      s3ImageArray.push(data.Location);
    });
    await sleep(timeOut);
  }
  return s3ImageArray;
}

const mongoCollections = require("../config/mongoCollections");
const apartments = mongoCollections.apartments;
const { ObjectId } = require("mongodb");
const helpers = require("../helpers");

const createApartment = async (
  username,
  apartmentName, //do we need users' id here?
  streetAddress,
  rentPerMonth,
  rentDuration,
  maxResidents,
  numBedrooms,
  numBathrooms,
  laundry,
  floorNum,
  roomNum,
  appliancesIncluded,
  maxPets,
  utilitiesIncluded,
  file
) => { //if added id to params, add check id here
  let params = helpers.checkApartmentParameters(username, apartmentName, streetAddress,rentPerMonth,rentDuration, maxResidents, numBedrooms, numBathrooms, laundry, floorNum, roomNum, appliancesIncluded, maxPets, utilitiesIncluded,file);
  if(!params) throw "error in checking Apartment parameters"
  const apartmentCollection = await apartments();
  
  //Checking for duplicate apartments
  const existingApt = await apartmentCollection.findOne({ apartmentName: params.apartmentName, streetAddress: params.streetAddress, floorNum: params.floorNum, roomNum: params.roomNum});
  if (existingApt !== null) throw `This apartment has been listed already.`;

  const existingApt2 = await apartmentCollection.findOne({ streetAddress: params.streetAddress, floorNum: params.floorNum, roomNum: params.roomNum});
  if (existingApt2 !== null) throw `This apartment has been listed already under a different name.`;

  //get date variable
  let today = new Date();
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let dd = String(today.getDate()).padStart(2, "0");
  let yyyy = today.getFullYear();
  today = mm + "/" + dd + "/" + yyyy;
  let newApartment = {
    userPosted: username,
    apartmentName: params.apartmentName,
    streetAddress: params.streetAddress,
    rentPerMonth: params.rentPerMonth,
    rentDuration: params.rentDuration,
    maxResidents: params.maxResidents,
    numBedrooms: params.numBedrooms,
    numBathrooms: params.numBathrooms,
    laundry: params.laundry,
    floorNum: params.floorNum,
    roomNum: params.roomNum,
    appliancesIncluded: params.appliancesIncluded,
    maxPets: params.maxPets,
    utilitiesIncluded: params.utilitiesIncluded,
    file: params.file,
    datePosted: today, //*Added a datePosted
    dateModified: "N/A",
    reviews: [],
    overallRating: 0
  };
  
  const insertInfo = await apartmentCollection.insertOne(newApartment);
  if (insertInfo.insertedCount === 0) throw "Could not add Apartment";
  const newId = insertInfo.insertedId.toString();
  const apt = await getApartmentById(newId);
  
  apt._id = apt._id.toString();
  return apt._id;
};

const getAllApartments = async () => { //for sort, maybe pass the sorting parameter here
  const apartmentCollection = await apartments();
  const apartmentList = await apartmentCollection.find({}).toArray(); //?
  if (!apartmentList) throw "Could not get all Apartments";
  apartmentList.forEach((Apartment) => {
    Apartment._id = Apartment._id.toString();
  });
  apartmentList.sort((a,b) => (a.apartmentName.toLowerCase() > b.apartmentName.toLowerCase()) ? 1 : -1);
  return apartmentList;
};

const getApartmentById = async (apartmentId) => {
  apartmentId = helpers.checkID(apartmentId);
  //apartmentId = apartmentId.trim();
  const apartmentCollection = await apartments();
  const newApartments = await apartmentCollection.findOne({_id: ObjectId(apartmentId)});
  if (!newApartments) throw "No Apartment with that id";

  newApartments._id = newApartments._id.toString();
  newApartments.reviews.forEach((apt) => {
    apt._id = apt._id.toString();
  });
  
  return newApartments;
};

const removeApartment = async (apartmentId) => {
  apartmentId = helpers.checkID(apartmentId.toString());
  const apartmentCollection = await apartments();
  let aptName = await getApartmentById(apartmentId.toString());
  let apartName = aptName.apartmentName;
  const deletionInfo = await apartmentCollection.deleteOne({ _id: ObjectId(apartmentId) });
  if (deletionInfo.deletedCount === 0) throw `Could not delete Apartment with id of ${apartmentId}`;
  return `${apartName} has been successfully deleted!`; //what do i want to return?
};

const sortApartmentsBy = async (by) => {
  const apartmentCollection = await apartments();
  let apartmentList = await apartmentCollection.find({}).toArray(); //?
  if (!apartmentList) throw "Could not get all Apartments";
  apartmentList.forEach((Apartment) => {
    Apartment._id = Apartment._id.toString();
  });
  
  switch (by) {
    case "Cost":
      apartmentList.sort((a,b) => (a.rentPerMonth > b.rentPerMonth) ? 1 : -1);
      break;

    case "Nummber of Bedrooms":
      apartmentList.sort((a,b) => (a.numBedrooms > b.numBedrooms) ? 1 : -1);
      break;

    case "Number of Bathrooms":
      apartmentList.sort((a,b) => (a.numBathrooms > b.numBathrooms) ? 1 : -1);
      break;

    case "Number of Residents":
      apartmentList.sort((a,b) => (a.maxResidents > b.maxResidents) ? 1 : -1);
      break;

    case "Alphabetical":
      apartmentList.sort((a,b) => (a.apartmentName.toLowerCase() > b.apartmentName.toLowerCase()) ? 1 : -1);
      break;

    case "Rating":
      apartmentList.sort((a,b) => (a.overallRating > b.overallRating) ? -1 : 1);
      break;

    case "Pets Allowed":
      let apts = apartmentList.filter( function (apt) {
        if (apt.maxPets =="Yes") return apt;
      });
      return apts;
      break;

    default: //error?
      break;
  }
  return apartmentList;
}

const addFilePathtoApt = async (aptId, filePath) => {
  //error check this
  const apartmentCollection = await apartments();

  const apartment = await getApartmentById(aptId);

  if (apartment === null) throw "no Apartment exists with that id";
  let today = new Date();
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let dd = String(today.getDate()).padStart(2, "0");
  let yyyy = today.getFullYear();
  today = mm + "/" + dd + "/" + yyyy;

  let updatedApartment = {
    userPosted: apartment.userPosted,
    apartmentName: apartment.apartmentName,
    streetAddress: apartment.streetAddress,
    rentPerMonth: apartment.rentPerMonth,
    rentDuration: apartment.rentDuration,
    maxResidents: apartment.maxResidents,
    numBedrooms: apartment.numBedrooms,
    numBathrooms: apartment.numBathrooms,
    laundry: apartment.laundry,
    floorNum: apartment.floorNum,
    roomNum: apartment.roomNum,
    appliancesIncluded: apartment.appliancesIncluded,
    maxPets: apartment.maxPets,
    utilitiesIncluded: apartment.utilitiesIncluded,
    file: filePath,
    datePosted: apartment.datePosted, //*Added a datePosted
    dateModified: today,
    reviews: apartment.reviews,
    overallRating: apartment.overallRating
  };
  const updateInfo = await apartmentCollection.replaceOne(
    { _id: ObjectId(aptId) },
    updatedApartment
  );
  if(!updateInfo.acknowledged || updateInfo.matchedCount !== 1 || updateInfo.modifiedCount !== 1) throw "cannot update apartment"

  const update = await getApartmentById(aptId);

  update._id = update._id.toString();
  return update;
}

const updateApartment = async (
  apartmentId,
  userName,
  apartmentName,
  streetAddress,
  rentPerMonth,
  rentDuration,
  maxResidents,
  numBedrooms,
  numBathrooms,
  laundry,
  floorNum,
  roomNum,
  appliancesIncluded,
  maxPets,
  utilitiesIncluded
) => {

  //!do not modify reviews or overallRating here
  //parms returns all the prams in a object with the trimmed output

  let id = helpers.checkID(apartmentId);
  let params = helpers.checkApartmentParameters(userName, apartmentName, streetAddress,rentPerMonth,rentDuration, maxResidents, numBedrooms, numBathrooms, laundry, floorNum, roomNum, appliancesIncluded, maxPets, utilitiesIncluded);
  if(!params) throw "error in checking apartment parameters"
  const apartmentCollection = await apartments();
  const apartment = await getApartmentById(id);
  if (apartment === null) throw "no Apartment exists with that id";
  let today = new Date();
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let dd = String(today.getDate()).padStart(2, "0");
  let yyyy = today.getFullYear();
  today = mm + "/" + dd + "/" + yyyy;

  let updatedApartment = {
    userPosted: params.userName,
    apartmentName: params.apartmentName,
    streetAddress: params.streetAddress,
    rentPerMonth: params.rentPerMonth,
    rentDuration: params.rentDuration,
    maxResidents: params.maxResidents,
    numBedrooms: params.numBedrooms,
    numBathrooms: params.numBathrooms,
    laundry: params.laundry,
    floorNum: params.floorNum,
    roomNum: params.roomNum,
    appliancesIncluded: params.appliancesIncluded,
    maxPets: params.maxPets,
    utilitiesIncluded: params.utilitiesIncluded,
    file: apartment.file,
    datePosted: apartment.datePosted, //*Added a datePosted
    dateModified: today,
    reviews: apartment.reviews,
    overallRating: apartment.overallRating
  };
  const updateInfo = await apartmentCollection.replaceOne(
    { _id: ObjectId(id) },
    updatedApartment
  );

  if(!updateInfo.acknowledged || updateInfo.matchedCount !== 1 || updateInfo.modifiedCount !== 1) throw "cannot update apartment"
  const update = await getApartmentById(id);

  update._id = update._id.toString();
  return update;
};


module.exports = {
  createApartment,
  getAllApartments,
  getApartmentById,
  removeApartment,
  updateApartment,
  sortApartmentsBy, addFilePathtoApt
};

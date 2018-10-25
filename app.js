// timesheet logic
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve trains from the train database.
// 4. Create a way to calculate the minutes passed. Using difference between start and current time.
//    Then use moment.js formatting to set difference in minutes.
// 5. Calculate Total billed

// 1. Initialize Firebase
var config = {
  apiKey: "AIzaSyDrEMYna5faMF2fKtSsrJOSY0olCPKI39w",
  authDomain: "trainsch3dule.firebaseapp.com",
  databaseURL: "https://trainsch3dule.firebaseio.com",
  projectId: "trainsch3dule",
  storageBucket: "trainsch3dule.appspot.com",
  messagingSenderId: "447645699769"
};
firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input")
    .val()
    .trim();
  var trainDestination = $("#destination-input")
    .val()
    .trim();
  var trainStart = moment(
    $("#start-input")
      .val()
      .trim(),
    "HH:mm"
  ).format("HH:mm");
  var trainFrequency = $("#rate-input")
    .val()
    .trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    //
    name: trainName,
    destination: trainDestination,
    start: trainStart,
    freq: trainFrequency
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name); ///
  console.log(newTrain.destination);
  console.log(newTrain.start);
  console.log(newTrain.freq);

  alert("train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#start-input").val("");
  $("#rate-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainStart = childSnapshot.val().start;
  var trainFrequency = childSnapshot.val().freq;

  // train Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(trainStart);
  console.log(trainFrequency);

  //Grab the current time
  var currentTime = moment().format("hh:mm a");
  console.log(currentTime);

  var firstTime = moment(firstTrain, "hh:mm a").subtract(1, "years");
  console.log("firstTime:" + firstTime);

  //Grab the difference from the current time and the first train arrival
  var trainDifference = moment().diff(moment(firstTime), "minutes");
  console.log("trainDifference:" + trainDifference);

  //Use modulo to grab the remainder of the trainDifference and trainFreq
  var timeLeft = trainDifference % trainFreq;
  console.log("timeLeft:" + timeLeft);

  //Grab the minutes away but subtracting the train frequency from the time left
  var minutesAway = trainFreq - timeLeft;
  console.log("minutesAway:" + minutesAway);

  //Grab the next train coming
  var nextTrain = moment()
    .add(minutesAway, "minutes")
    .format("hh:mm a");
  console.log("nextTrain:" + nextTrain);

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(trainMinutes),
    $("<td>").text(nextTrain),
    $("<td>").text(minutesAway)
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});

// Example Time Math
// -----------------------------------------------------------------------------
// Assume train start date of January 1, 2015
// Assume current date is March 1, 2016

// We know that this is 15 minutes.
// Now we will create code in moment.js to confirm that any attempt we use meets this test case

// Assume the following situations.

// (TEST 1)
// First Train of the Day is 3:00 AM
// Assume Train comes every 3 minutes.
// Assume the current time is 3:16 AM....
// What time would the next train be...? (Use your brain first)
// It would be 3:18 -- 2 minutes away

// (TEST 2)
// First Train of the Day is 3:00 AM
// Assume Train comes every 7 minutes.
// Assume the current time is 3:16 AM....
// What time would the next train be...? (Use your brain first)
// It would be 3:21 -- 5 minutes away

// ==========================================================

// Solved Mathematically
// Test case 1:
// 16 - 00 = 16
// 16 % 3 = 1 (Modulus is the remainder)
// 3 - 1 = 2 minutes away
// 2 + 3:16 = 3:18

// Solved Mathematically
// Test case 2:
// 16 - 00 = 16
// 16 % 7 = 2 (Modulus is the remainder)
// 7 - 2 = 5 minutes away
// 5 + 3:16 = 3:21

// Assumptions
var tFrequency = 3;

// Time is 3:30 AM
var firstTime = "03:30";

// First Time (pushed back 1 year to make sure it comes before current time)
var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
console.log(firstTimeConverted);

// Current Time
var currentTime = moment();
console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

// Difference between the times
var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
console.log("DIFFERENCE IN TIME: " + diffTime);

// Time apart (remainder)
var tRemainder = diffTime % tFrequency;
console.log(tRemainder);

// Minute Until Train
var tMinutesTillTrain = tFrequency - tRemainder;
console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

// Next Train
var nextTrain = moment().add(tMinutesTillTrain, "minutes");
console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

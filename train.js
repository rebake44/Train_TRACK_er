/* global firebase moment */
// Steps to complete:

// 1. Initialize Firebase
// 2. Create button for adding new trains - then update the html + update the database
// 3. Create a way to retrieve trains from the train database.
// 4. Create a way to calculate the time to next arrival. Using difference between time and current time.
//    Then use moment.js formatting to set difference in minutes.
// 5. Calculate minutes away.  

// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyAh5GvtkRjKvO1Mg8dYb9Ji-Jq6-Vu4l2k",
    authDomain: "train-tracker-81b09.firebaseapp.com",
    databaseURL: "https://train-tracker-81b09.firebaseio.com",
    projectId: "train-tracker-81b09",
    storageBucket: "train-tracker-81b09.appspot.com",
    messagingSenderId: "246255930749"
};

firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding trains
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var trainFirst = $("#time-input").val().trim();
    var trainFrequency = $("#frequency-input").val().trim();

    // Creates local "temporary" object for holding train data
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        trainFirst: trainFirst,
        frequency: trainFrequency
    };

    // Uploads train data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.trainFirst);
    console.log(newTrain.frequency);

    // Alert
    alert("train successfully added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#time-input").val("");
    $("#frequency-input").val("");

});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());

    // Store everything into a variable.
    var nameTrain = childSnapshot.val().name;
    var destinationTrain = childSnapshot.val().destination;
    var trainFirstTime = childSnapshot.val().trainFirst;
    var frequencyTrain = childSnapshot.val().frequency;

    console.log(trainFirstTime);
    console.log(destinationTrain);
    // console.log(trainFirst);
    console.log(frequencyTrain);

    var trainArrive = trainFirstTime.split(":");
    var arriveTime = moment().hours(trainArrive[0]).minutes(trainArrive[1]);
    var maxMoment = moment.max(moment(), arriveTime);
    var minutes;
    var arrival;

    if (maxMoment === arriveTime) {
        arrival = arriveTime.format("HH:mm");
        minutes = arriveTime.diff(moment(), "minutes");

    } else {

        var diffTime = moment().diff(arriveTime, "minutes");
        var modulus = diffTime % frequencyTrain;
        minutes = frequencyTrain - modulus;

        arrival = moment().add(minutes, "m").format("HH:mm");
    }
    console.log("minutes:", minutes);
    console.log("arrival:", arrival);

    // Add each train's data into the table
    $("#train-table > tbody").append("<tr><td>" + nameTrain + "</td><td>" + destinationTrain + "</td><td>" + frequencyTrain + "</td><td>" + arrival + "</td><td>" + minutes + "</td></tr>");
});

// Initialize Firebase
var config = {
    apiKey: "AIzaSyA7siQh5M6Kp4_IbXwf7sjgWfDZvsJcFQ8",
    authDomain: "trainschedule-126d3.firebaseapp.com",
    databaseURL: "https://trainschedule-126d3.firebaseio.com",
    projectId: "trainschedule-126d3",
    storageBucket: "trainschedule-126d3.appspot.com",
    messagingSenderId: "412405610026"
};
firebase.initializeApp(config);

// VARIABLES
// Get a reference to the database service
var database = firebase.database();

// Click Button changes what is stored in firebase
$("#click-button").on("click", function (event) {
    // Prevent the page from refreshing
    event.preventDefault();

    // Grab values from text-boxes
    var trainName = $("#train").val().trim();
    var destination = $("#destination").val().trim();
    var firstTrainTime = $("#time").val().trim();
    var frequency = $("#repeat").val().trim();

    // Change what is saved in firebase
    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency,
    });

    //Clear Input Fields
    $("#train").val("");
    $("#destination").val("");
    $("#time").val("");
    $("#repeat").val("");
});


// Firebase watcher + initial loader
database.ref().on("child_added", function (snapshot) {

    // Log everything that's coming out of snapshot

    // console.log(snapshot.val());
    // console.log(snapshot.val().trainName);
    // console.log(snapshot.val().destination);
    // console.log(snapshot.val().firstTrainTime);
    // console.log(snapshot.val().frequency);


    //Data for New Child in Database
    var addedTrainName = snapshot.val().trainName;//Newly Added Train Name
    var addedDestination = snapshot.val().destination;//Newly Added Destination
    var addedFrequency = snapshot.val().frequency; //Newly Added Frequency
    var addedFirstTrainTime = snapshot.val().firstTrainTime;//Newly Added Train Time

   
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(addedFirstTrainTime, "hh:mm A").subtract(1, "years");
    // console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    // console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm A"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    // console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % addedFrequency;
    // console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = addedFrequency - tRemainder;
    // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
    // console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm A"));


    // //New Row in the Output Table
    var newRow = $("<tr>");

    //Append Each Piece of Data to Row in Same Order as the Table Headers in HTML File
    $(newRow).append("<td>" + addedTrainName + "</td>");
    $(newRow).append("<td>" + addedDestination + "</td>");
    $(newRow).append("<td>" + addedFrequency + "</td>");
    $(newRow).append("<td>" + moment(nextTrain).format("hh:mm A") + "</td>");//Next Arrival
    $(newRow).append("<td>" + tRemainder + "</td>");//Minutes Away

   
    //Append New Row to Table Body
    $("#trainTableRows").append(newRow);


    //  Handle the errors
}, function (errorObject) {
    // console.log("The read failed: " + errorObject.code);
});

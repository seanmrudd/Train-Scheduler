//Initialize Firebase

var config = {
  apiKey: "AIzaSyCTocMNj5DhQHrOoM_QSNwFLCH_i-oj2N4",
  authDomain: "trainscheduler-d7f12.firebaseapp.com",
  databaseURL: "https://trainscheduler-d7f12.firebaseio.com",
  projectId: "trainscheduler-d7f12",
  storageBucket: "trainscheduler-d7f12.appspot.com",
  messagingSenderId: "241366282664"
};

firebase.initializeApp(config);

var database = firebase.database();

console.log(database);

var ref = database.ref('trains')

console.log(ref);


database.ref().on("value", function (childSnapshot) {
  console.log(childSnapshot.val());
  console.log(Object.keys(childSnapshot.val()));
})


//Create button for adding new trains - add user input to database + clear html
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();

  //Grab user input
  //Don't submit blank input
  if ($("#train-name-input").val() != '') {
    var trainName = $("#train-name-input").val().trim();
  } else {
    alert('Need Train Name')
  }
  if ($("#destination-input").val() != '') {
    var trainDestination = $("#destination-input").val().trim();
  } else {
    alert('Need a Destination')
  }
  if ($("#initialTrain-input").val() != '') {
    var trainIntialTime = $("#initialTrain-input").val().trim();
  } else {
    alert('Need First Arrival')
  }
  if ($("#frequency-input").val() != '') {
    var trainFrequency = $("#frequency-input").val().trim();
  } else {
    alert('Need Frequency')
  }

  // console.log(trainName);
  // console.log(trainDestination);
  // console.log(trainIntialTime);
  // console.log(trainFrequency);

  //Create local 'temporary' object for holding train data
  var newTrain = {
    trainName: trainName,
    trainDestination: trainDestination,
    trainIntialTime: trainIntialTime,
    trainFrequency: trainFrequency
  };

  //Upload data to database
  for (i = 0; i < Object.keys(childSnapshot.val().length); i++) {
    database.ref().push(newTrain[i]);
  }
  //Log in console
  // console.log(newTrain.trainName);
  // console.log(newTrain.trainDestination);
  // console.log(newTrain.trainIntialTime);
  // console.log(newTrain.trainFrequency);

  //Clear user inputs
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#intialTrain-input").val("");
  $("#frequency-input").val("");
});

//Create Firebase event for adding new child to database and a row in the HTML when a train is added.
database.ref().on("child_added", function (childSnapshot) {
  // console.log(childSnapshot.val());
  var snapval = childSnapshot.val();

  //Store data into a variable - Train Name, Destination, Frequency, Initial arrival
  var trainName = snapval.trainName;
  var trainDestination = snapval.trainDestination;
  var trainIntialTime = snapval.trainIntialTime;
  var trainFrequency = snapval.trainFrequency;
  var trainInfo = snapval;

  //Log in console
  // console.log(trainName);
  // console.log(trainDestination);
  // console.log(trainIntialTime);
  // console.log(trainFrequency);
  console.log(trainInfo)

  //Sanitize initial arrival (Make it useable by putting it a day behind.  That way it wont be a future time.)
  var firstArrival = moment(trainIntialTime, "HH:mm").subtract(1, "days");
  // console.log(firstArrival);

  //Calculate difference between arrival and current time in minutes
  var diffTime = moment().diff(moment(firstArrival), "minutes");
  // console.log("DIFFERENCE IN TIME: " + diffTime);

  //Time apart ('the difference between current and inital time' % frequency = 'remainder') This is also how many minutes used up
  var remainder = diffTime % trainFrequency;
  // console.log(remainder);

  //Min. left till train is (frequency - remainder)...way to wrap your brain around it is if the remainder is zero, then the full frequency time till the next train
  var minRemaining = trainFrequency - remainder;
  // console.log("MINUTES TILL TRAIN: " + minRemaining);

  //Next train is how many minutes left to till the next train added to the current time.
  var nextTrain = moment().add(minRemaining, "minutes").format("LT");
  // console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

  //Create a new row to train table
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(trainFrequency),
    $("<td>").text(nextTrain),
    $("<td>").text(minRemaining),
    $('<td>').addClass('fas fa-trash').attr('id', 'deleteBtn'),
    $('<td>').addClass('fas fa-edit').attr('id', 'editBtn')
  ).attr('id', trainName).attr('data-key', childSnapshot.key);

  console.log(childSnapshot.key)

  //Append the new row to the table
  $("tbody").append(newRow);
  console.log(newRow);

  //   //Pop up Modal to Edit data
  //   $(document).ready(function () {
  //     $('#editBtn').click(function () {
  //       $('#editModal').show();
  //     })

  //     $('.close').click(function () {
  //       $('#editModal').hide();
  //     })

  //     $(window).click(function () {
  //       if (event.target == modal) {
  //         $('#editModal').hide();
  //       }
  //     })
  //   })

  // })

  // $("#edit-add-train-btn").on("click", function (event) {
  //   event.preventDefault();

  //   //Grab user input
  //   //Don't submit blank input
  //   if ($("#edit-train-name-input").val() != '') {
  //     var trainName = $("#edit-train-name-input").val().trim();
  //   }
  //   if ($("#edit-destination-input").val() != '') {
  //     var trainDestination = $("#edit-destination-input").val().trim();
  //   }
  //   if ($("#edit-initialTrain-input").val() != '') {
  //     var trainIntialTime = $("#edit-initialTrain-input").val().trim();
  //   }
  //   if ($("#edit-frequency-input").val() != '') {
  //     var trainFrequency = $("#edit-frequency-input").val().trim();
  //   }

  //   // console.log(trainName);
  //   // console.log(trainDestination);
  //   // console.log(trainIntialTime);
  //   // console.log(trainFrequency);

  //   //Create local 'temporary' object for holding train data
  //   var newTrain = {
  //     trainName: trainName,
  //     trainDestination: trainDestination,
  //     trainIntialTime: trainIntialTime,
  //     trainFrequency: trainFrequency
  //   };

  //   //Upload data to database
  //   database.ref().update(newTrain);

  //   //Log in console
  //   // console.log(newTrain.trainName);
  //   // console.log(newTrain.trainDestination);
  //   // console.log(newTrain.trainIntialTime);
  //   // console.log(newTrain.trainFrequency);

  //   //Clear user inputs
  //   $("#edit-train-name-input").val("");
  //   $("#edit-destination-input").val("");
  //   $("#edit-intialTrain-input").val("");
  //   $("#edit-frequency-input").val("");
  // });

  // $("#deleteBtn").on("click", function (event) {
  //   event.preventDefault();

  //   database.ref().update(newTrain);

});

$.fn.scrollView = function () {
  return this.each(function () {
    $('html, body').animate({
      scrollTop: $(this).offset().top
    }, 2000);
  });
}

$('#add-train-form').on("click", function () {
  $('#train-info-form').scrollView();
})

$('#train-schedule').on("click", function () {
  $('#top').scrollView();
})

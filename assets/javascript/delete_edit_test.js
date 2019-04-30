// Steps to complete:
// 1. Initialize Firebase
// 2. Create button for adding new employees - then update the html + update the database
// 3. Create a way to retrieve employees from the employee database.
// 4. Create a way to calculate the months worked. Using difference between start and current time.
//    Then use moment.js formatting to set difference in months.
// 5. Calculate Total billed
// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyDo0N93Qzo6gBky_Zqmw8scz0lXTeXhjaI",
    authDomain: "practice-4d5c9.firebaseapp.com",
    databaseURL: "https://practice-4d5c9.firebaseio.com",
    projectId: "practice-4d5c9",
    storageBucket: "practice-4d5c9.appspot.com",
    messagingSenderId: "501776148952"
  };
  firebase.initializeApp(config);
  var database = firebase.database();
  var ref= database.ref('employees')
  console.log(ref)
  // 2. Button for adding Employees
  $("#add-employee-btn").on("click", function(event) {
    event.preventDefault();
    // Grabs user input
    var empName = $("#employee-name-input").val().trim();
    var empRole = $("#role-input").val().trim();
    var empStart = moment($("#start-input").val().trim(), "MM/DD/YYYY").format("X");
    var empRate = $("#rate-input").val().trim();
    // Creates local "temporary" object for holding employee data
    var newEmp = {
      name: empName,
      role: empRole,
      start: empStart,
      rate: empRate
    };
    // Uploads employee data to the database
    ref.push(newEmp);
    // Logs everything to console
    console.log(newEmp.name);
    console.log(newEmp.role);
    console.log(newEmp.start);
    console.log(newEmp.rate);
    alert("Employee successfully added");
    // Clears all of the text-boxes
    $("#employee-name-input").val("");
    $("#role-input").val("");
    $("#start-input").val("");
    $("#rate-input").val("");
  });
  // 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
  ref.on("child_added", function(childSnapshot) {
    console.log(childSnapshot)
    console.log(childSnapshot.val());
    // Store everything into a variable.
    var empName = childSnapshot.val().name;
    var empRole = childSnapshot.val().role;
    var empStart = childSnapshot.val().start;
    var empRate = childSnapshot.val().rate;
    // Employee Info
    console.log(empName);
    console.log(empRole);
    console.log(empStart);
    console.log(empRate);
    // Prettify the employee start
    var empStartPretty = moment.unix(empStart).format("MM/DD/YYYY");
    // Calculate the months worked using hardcore math
    // To calculate the months worked
    var empMonths = moment().diff(moment(empStart, "X"), "months");
    console.log(empMonths);
    // Calculate the total billed rate
    var empBilled = empMonths * empRate;
    console.log(empBilled);
    var newButton= $("<button>").text("Remove")
                                .attr("id", "remove")
                                .attr("data-key", childSnapshot.key)
    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(empName),
      $("<td>").text(empRole),
      $("<td>").text(empStartPretty),
      $("<td>").text(empMonths),
      $("<td>").text(empRate),
      $("<td>").text(empBilled),
      $("<td>").append(newButton)
    );
    newRow.attr("data-key", childSnapshot.key)
          
    // Append the new row to the table
    $("#employee-table > tbody").append(newRow);
    
    $("tbody").on("click", "#remove", function(){
      console.log("button pressed")
      var key = ($(this).data("key"))
      database.ref('employees').child(key).remove();
      $(this).parent().parent().remove()
  })
    
  });
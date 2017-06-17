
  
$(document).ready(function () {
  $('select').material_select();
});

var config = {
    apiKey: "AIzaSyCVHueeH4Ls8HFiOSr-5mDToS6AZIBCpQk",
    authDomain: "webtile-com-au.firebaseapp.com",
    databaseURL: "https://webtile-com-au.firebaseio.com",
    projectId: "webtile-com-au",
    storageBucket: "webtile-com-au.appspot.com",
    messagingSenderId: "1057128384695"
  };

firebase.initializeApp(config);
var database = firebase.database();

function submitClicked() {
  validateData();
}

function debugFillData() {
  document.getElementById("description").value = "Test description";
  document.getElementById("first_name").value = "First Name";
  document.getElementById("last_name").value = "Last Name";
  document.getElementById("phone_number").value = "0400 379 865";
  document.getElementById("email").value = "email@example.com";
  Materialize.updateTextFields();
  return "autofilled email fields";
}
function validate() {
  console.log("changing");
  var phoneNumber = document.getElementById("phone_number");
  var pattern = /\d/g;
  var result = pattern.test(phoneNumber.value);
  changeValidity(result, phoneNumber);
}
function validateData() {
  var description = document.getElementById("description");

  var firstName = document.getElementById("first_name");
  var lastName = document.getElementById("last_name");
  var phoneNumber = document.getElementById("phone_number");
  var email = document.getElementById("email");

  changeValidity(/\d/g, phoneNumber);
  var pattern = /\w/g;
  changeValidity(pattern, firstName);
  changeValidity(pattern, lastName);
  changeValidity(pattern, description);

  changeValidity(/\w[@]/g, email);

  if (description.classList.contains("invalid")) {
    makeToast("Please fill out the required fields."); console.log("Description invalid"); return;
  }
  if (firstName.classList.contains("invalid")) {
    makeToast("Please fill out the required fields."); console.log("firstName invalid"); return;
  }
  if (lastName.classList.contains("invalid")) {
    makeToast("Please fill out the required fields."); console.log("lastName invalid"); return;
  }
  if (phoneNumber.classList.contains("invalid")) {
    makeToast("Please fill out the required fields."); console.log("phoneNumber invalid"); return;
  }
  if (email.classList.contains("invalid")) {
    makeToast("Please fill out the required fields."); console.log("email invalid"); return;
  }

  var key = null;

  firebase.auth().signInAnonymously()
    .then(user => {
      firebase.database().ref('contact_details').push({
        description: description.value,
        firstName: firstName.value,
        lastName: lastName.value,
        phoneNumber: phoneNumber.value,
        email: email.value,
      });
      var contactDetails = "First Name: " + firstName.value +
        "\nLast Name: " + lastName.value +
        "\nEmail: " + email.value +
        "\nPhone Number: " + phoneNumber.value;
      var subjectLine = "Contact from: " + firstName.value + " " + lastName.value;
      var mailText = description.value+"\n\n"+contactDetails;
      var mailOptions = {
        from: 'tempminibit@gmail.com',
        to: 'samcavicchi@gmail.com',
        subject: subjectLine,
        text: mailText,
      };

      key = firebase.database().ref('emails').push().key;
      sendKey(key);

      //var str = ('emails/' + key);
      firebase.database().ref("emails/" + key).update(
        {
          mailOptions: mailOptions,
          notified: false
        })
    })
    .catch(error => {
      console.log(error);
    })
    var btn = document.getElementById("submit_button");
    makeToast("Form submitted.", 3000);
    btn.classList.add('disabled');
    btn.classList.remove('enabled');
    Materialize.updateTextFields();
    setTimeout(function(){
      makeToast("Redirecting...", 2000);
    },1000);
    setTimeout(function(){
      btn.classList.add('enabled');
      btn.classList.remove('disabled');
      Materialize.updateTextFields();
      location.href = "quote-complete.html";
    },3000);
    



  //      "https://hooks.zapier.com/hooks/catch/2291793/9kzujj/",
  //https://maker.ifttt.com/trigger/minibit_quote_submission/with/key/p0lXRzQ-7qrZUHoIg-QDFeHHPDfL8NCKqi6EnyZqUyF
}

function makeToast(msg, time=3000){
  Materialize.toast(msg, time, 'rounded');
}

function sendKey(key) {
  $.ajax({
    type: "POST",
    url: "https://minibit-api.herokuapp.com/emails/notify",//http://localhost:3000/emails/notify
    data: {
      id: key
    },
    dataType: "json",
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
  });
}

function changeValidity(pattern, element) {
  var valid = pattern.test(element.value);
  if (valid) {
    element.classList.remove('invalid');
    element.classList.add('valid');
  } else {
    element.classList.remove('valid');
    element.classList.add('invalid');
  }
  Materialize.updateTextFields();
}
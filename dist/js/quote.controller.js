
$(document).ready(function () {
  $('select').material_select();
  include_header();
});

function include_header() {
	//	document.getElementById("header").innerHTML='<object type="text/html" data="header.html" ></object>';
	}

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
  document.getElementById("select_navbar").checked = true;
  document.getElementById("select_feedback").checked = true;
  document.getElementById("page_home").checked = true;
  document.getElementById("page_contact").checked = true;
  document.getElementById("page_gallery").checked = true;

  document.getElementById("description").value = "Test description";
  document.getElementById("first_name").value = "First Name";
  document.getElementById("last_name").value = "Last Name";
  document.getElementById("phone_number").value = "0400 379 865";
  document.getElementById("email").value = "email@example.com";
  document.getElementById("business_name").value = "Business name";
  document.getElementById("address_line1").value = "Address Line 1";
  document.getElementById("address_line2").value = "Address Line 2";
  document.getElementById("address_city").value = "City";
  document.getElementById("address_post_code").value = "2602";
  document.getElementById("address_state").value = "State / Province";
  Materialize.updateTextFields();
  return "autofilled fields";
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

  var bName = document.getElementById("business_name").value;
  var addressLine1 = document.getElementById("address_line1").value;
  var addressLine2 = document.getElementById("address_line2").value;
  var city = document.getElementById("address_city").value;
  var postCode = document.getElementById("address_post_code").value;
  var state = document.getElementById("address_state").value;

  var siteRequirements = getRequirements();
  var sitePages = GetPages();

  changeValidity(/\d/g, phoneNumber);
  var pattern = /\w/g;
  changeValidity(pattern, firstName);
  changeValidity(pattern, lastName);
  changeValidity(pattern, phoneNumber);
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
      console.log("Firebase logged in successfully");
      firebase.database().ref('quotations').push({
        description: description.value,
        firstName: firstName.value,
        lastName: lastName.value,
        phoneNumber: phoneNumber.value,
        email: email.value,
      });
      var businessDetails = bName+"\n"+addressLine1+"\n"+addressLine2+"\n"+city+", "+state+", "+postCode;
      var contactDetails = "" + firstName.value + "\n" + lastName.value + "\n" + email.value + "\n" + phoneNumber.value;
      var subjectLine = "Quotation Request: " + firstName.value + " " + lastName.value;
      var mailText = "Hi Sam, you have a new quotation request:\n\nSite Requirements:\n" + siteRequirements + "\nSite Description:\n"+ description.value + "\nSite Pages:\n" + sitePages + "\nContact Details:\n" + contactDetails +"\n\nBusiness Details:\n"+businessDetails;
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
      return;
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
  console.log("Key sent successfully");
}

function getRequirements() {
  var returnString = "";
  var selectNavbar = document.getElementById("select_navbar");
  var selectEcommerce = document.getElementById("select_ecommerce");
  var selectLogins = document.getElementById("select_logins");
  var selectFeedback = document.getElementById("select_feedback");
  if (selectNavbar.checked) {
    returnString += "-Navbar\n";
  }
  if (selectEcommerce.checked) {
    returnString += "-ECommerce\n";
  }
  if (selectLogins.checked) {
    returnString += "-Logins\n";
  }
  if (selectFeedback.checked) {
    returnString += "-Feedback / comments\n";
  }
  return returnString;
}

function GetPages() {
  var returnString = "";
  if (document.getElementById("page_home").checked) {
    returnString += "-Home\n";
  }
  if (document.getElementById("page_contact").checked) {
    returnString += "-Contact\n";
  }
  if (document.getElementById("page_store").checked) {
    returnString += "-Store\n";
  }
  if (document.getElementById("page_menu").checked) {
    returnString += "-Menu\n";
  }
  if (document.getElementById("page_gallery").checked) {
    returnString += "-Gallery\n";
  }
  if (document.getElementById("page_blog").checked) {
    returnString += "-Blog\n";
  }
  return returnString;
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
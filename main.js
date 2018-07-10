var config = {
  apiKey: "AIzaSyBv3YLhI3ElOebO9xxLoyH2NESILuFT4OE",
  authDomain: "dish-4f0ba.firebaseapp.com",
  databaseURL: "https://dish-4f0ba.firebaseio.com",
  storageBucket: "dish-4f0ba.appspot.com",
};

firebase.initializeApp(config);
var db = firebase.database();

// CREATE REWIEW

var reviewForm = document.getElementById('reviewForm');
var fullName   = document.getElementById('fullName');
var message    = document.getElementById('message');
var hiddenId   = document.getElementById('hiddenId');

reviewForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!fullName.value || !message.value) return null

  var id = hiddenId.value || Date.now()

  db.ref('dish/' + id).set({
    name: fullName.value,
    Description: message.value,
    cost:cost.value
  });
  cost.value = '';
  fullName.value = '';
  message.value  = '';
  hiddenId.value = '';
});

// READ REVEIWS

var dish = document.getElementById('dish');
var reviewsRef = db.ref('/dish');

reviewsRef.on('child_added', (data) => {
  var li = document.createElement('li')
  li.id = data.key;
  li.innerHTML = reviewTemplate(data.val());
  dish.appendChild(li);

  console.log(data.val());
});

reviewsRef.on('child_changed', (data) => {
  var reviewNode = document.getElementById(data.key);
  reviewNode.innerHTML = reviewTemplate(data.val());
});

reviewsRef.on('child_removed', (data) => {
  var reviewNode = document.getElementById(data.key);
  reviewNode.parentNode.removeChild(reviewNode);
});

dish.addEventListener('click', (e) => {
  var reviewNode = e.target.parentNode

  // UPDATE REVEIW
  if (e.target.classList.contains('edit')) {
    fullName.value = reviewNode.querySelector('.name').innerText;
    message.value  = reviewNode.querySelector('.Description').innerText;
    hiddenId.value = reviewNode.id;
  }

  // DELETE REVEIW
  if (e.target.classList.contains('delete')) {
    var id = reviewNode.id;
    db.ref('dish/' + id).remove();
  }
});

function reviewTemplate({name, Description,cost}) {
  return `
    <div class='fullName'>Name::${name}</div>
    <div class='message'>Desc.::${Description}</div>
    <div class='message'>Cost::${cost}</div>
    <button class='delete'>Delete</button>
    <button class='edit'>Edit</button>
  `
};

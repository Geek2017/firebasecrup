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
var dishname   = document.getElementById('dishname');
var description    = document.getElementById('description');
var cost    = document.getElementById('cost');
var hiddenId   = document.getElementById('hiddenId');

reviewForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!dishname.value || !description.value || !cost.value) return null

  var id = hiddenId.value || Date.now()

  db.ref('dish/' + id).set({
    name: dishname.value,
    Description: description.value,
    cost:cost.value
  });
  cost.value = '';
  dishname.value = '';
  description.value  = '';
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
    
    description.value  = reviewNode.querySelector('.description').innerText;
    cost.value  = reviewNode.querySelector('.cost').innerText;
    dishname.value = reviewNode.querySelector('.name').innerText;
    hiddenId.value = reviewNode.id;
    console.log(reviewNode);
  }

  // DELETE REVEIW
  if (e.target.classList.contains('delete')) {
    var id = reviewNode.id;
    db.ref('dish/' + id).remove();
  }
});

function reviewTemplate({name, Description,cost}) {
  return `
  <b>Name::</b><div class='name'>${name}</div>
  <b>Desc.::</b> <div class='description'>${Description}</div>
  <b>Cost::</b><div class='cost'>${cost}</div>
    <button class='delete btn btn-danger'>Delete</button>
    <button class='edit btn btn-info'>Edit</button>
  `
};

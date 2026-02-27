// object creation
const user = {
  username: "standard_user",
  password: "secret_sauce"
};
// console.log(user);

// Accessing value of object
console.log(user.username);
console.log(user.password);

console.log('-------------------------------');

console.log(user["password"]);
console.log(user["username"]);

console.log('-------------------------------');


const usernameVal_API = user.username;
const passwordVal = user.password;

console.log('-------------------------------');

console.log(usernameVal_API);
console.log(passwordVal);


// Create a bag object with two valriables named samsung and apple, then print the value 
// with using (.) and ([]) operations

user.email = "standard@example.com";
user.isAdmin = false;
console.log(user);

user.username = "Updated data"
console.log(user);

user.username2 = "Updated data"
console.log(user);

// Question:
// Create an object called student with:
// name
// age
// course
// isEnrolled (true/false)

// Then:
// Print all properties using a loop
// Update the age
// Add a new property called grade
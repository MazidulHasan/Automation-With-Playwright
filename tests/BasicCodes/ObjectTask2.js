const student = {
  name: "Alice",
  age: 20,
  course: "Computer Science",
  isEnrolled: true
};

// Print all properties using a loop
console.log("=== Student Details ===");
for (let key in student) {
  console.log(key + ": " + student[key]);
}

// Update the age
student.age = 21;
console.log("\n=== After Updating Age ===");
console.log("New age:", student.age);

// Add a new property called grade
student.grade = "A";
console.log("\n=== After Adding Grade ===");
console.log("Grade:", student.grade);

// Print final object
console.log("\n=== Final Student Object ===");
for (let key in student) {
  console.log(key + ": " + student[key]);
}
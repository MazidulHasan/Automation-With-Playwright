const response = {
  status: 200,
  data: {
    patient: {
      id: 101,
      name: "John Doe"
    },
    BedNumber: 1212
  }
};

console.log(response.data.patient.name);
console.log(response.data.BedNumber);
// const response = {
//   status: 200,
//   data: {
//     patient: {
//       id: 101,
//       name: "John Doe"
//     }
//   }
// };

// console.log(response.data.patient.name);


let products = [
  { name: "Mouse", price: 500, quantity: 2 },
  { name: "Keyboard", price: 800, quantity: 1 },
  { name: "Monitor", price: 15000, quantity: 1 }
];

let prod = ['Data1', 'Data2']



export class LoginPage {

  constructor(){
    console.log('constructor');
  }

  login(username, password) {
    console.log(`Login with name: ${username}`);
    console.log(`Login with pass: ${password}`);
  }
  logout(){
    // some code for logout
  }
}
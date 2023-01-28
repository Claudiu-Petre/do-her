'use strict';

// DO$HER APP

// Data
const account1 = {
  owner: 'Claudiu Petre',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jane Austen',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steve Jobs',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Rosa Parks',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// display movements: deposits and withdrawals
const displayMovements = function(movements, sort = false){
containerMovements.innerHTML = ''; // emptying the container first

const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function(mov, i){   // adding to container
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__value">${mov} GBP</div>
  </div>`;
  containerMovements.insertAdjacentHTML('afterbegin', html); // inserting html in user interface
});
};
// displayMovements(account1.movements);

//display Balance in GBP
const calcDisplayBalance = function(acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  acc.balance = balance;
  labelBalance.textContent = `${balance} GBP`;
};
// calcDisplayBalance(account1.movements);

// display Summary
const calcDisplaySummary = function(acc) {

const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
labelSumIn.textContent = `${incomes} GBP`;

const out = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
labelSumOut.textContent = `${Math.abs(out)} GBP`; // removes the negative sign.

//display the Interest(E.g: 1.2%)
const interest = acc.movements.filter(mov => mov > 0)
.map(deposit => (deposit * acc.interestRate) / 100)
.filter((int, i, arr) => {          // only the interest >= 1 to be taken forward.
  return int >= 1;
})
.reduce((acc, int) => acc + int, 0);
labelSumInterest.textContent = `${interest} GBP`;

};
// calcDisplaySummary(account1.movements);

// creating a username
const createUsernames = function(accs){
accs.forEach(function(acc){
  // created username property using owner property
  acc.username = acc.owner.toLocaleLowerCase()
  .split(' ')
  .map(name => name[0])
  .join('');
})
};
createUsernames(accounts);

const updateUI = function (acc){
//Display movements
displayMovements(acc.movements);
//Display balance
calcDisplayBalance(acc);
//Display summary
calcDisplaySummary(acc);
}

// Event handler for LOG IN

let currentAccount;

btnLogin.addEventListener('click', function (e) {
//Prevent form from submitting
  e.preventDefault();

currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);

if(currentAccount?.pin === Number(inputLoginPin.value)){
// Display UI and welcome message
labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
containerApp.style.opacity = 100;

//Clear input fields
inputLoginUsername.value = inputLoginPin.value = '';
inputLoginPin.blur();

//Update UI
updateUI(currentAccount);
}
});

//Transfer money - eventListener

btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc =accounts.find(acc => acc.username === inputTransferTo.value);

  // clear the inputs in transfer form

  inputTransferAmount.value = inputTransferTo.value = '';
  //checks: got enough money in acc; amount is a positive no; not be able to transfer to us
  //the transfer account exists using optional chaining (?)
  if(amount > 0 && receiverAcc && currentAccount.balance >= amount 
    && receiverAcc?.username !== currentAccount.username){

  //transfer operations between accounts
  currentAccount.movements.push(-amount);
  receiverAcc.movements.push(amount);
  
  //Update UI
  updateUI(currentAccount);
  }
});

// LOAN functionality

btnLoan.addEventListener('click', function(e){
e.preventDefault();

const amount = Number(inputLoanAmount.value);
if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){

// Add movement
currentAccount.movements.push(amount);
// Update de UI
updateUI(currentAccount);
}
inputLoanAmount.value = '';
});

// CLOSE account functionality
btnClose.addEventListener('click', function(e){
  e.preventDefault();
 
    // check if credentials are correct: username and pin
  if(inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin){

    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
  
    // Delete account  
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }
  // clear inputs in the DELETE form
  inputCloseUsername.value = inputClosePin.value = '';
})

// SORT movements
let sorted = false; //state variable
btnSort.addEventListener('click', function (e){
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});





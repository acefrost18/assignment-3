/*==================================================
src/App.js

This is the top-level component of the app.
It contains the top-level state.
==================================================*/
import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

// Import other components
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import LogIn from './components/Login';
import Credits from './components/Credits';
import Debits from './components/Debits';

class App extends Component {
  constructor() {  // Create and initialize state
    super(); 
    this.state = {
      accountBalance: 0,
      creditList: [],
      debitList: [],
      currentUser: {
        userName: 'Joe Smith',
        memberSince: '11/22/99',
      }
    };
  }

  // Update state's currentUser (userName) after "Log In" button is clicked
  mockLogIn = (logInInfo) => {  
    const newUser = {...this.state.currentUser};
    newUser.userName = logInInfo.userName;
    this.setState({currentUser: newUser})
  }

  componentDidMount() {
    fetch('https://johnnylaicode.github.io/api/credits.json')
      .then((response) => response.json())
      .then((creditData) => {
        this.setState({ creditList: creditData });
  
        const totalCredits = creditData.reduce((total, credit) => total + credit.amount, 0);
  
        const newAccountBalance = (this.state.accountBalance + totalCredits).toFixed(2);
  
        // Update the state with the new account balance
        this.setState({ accountBalance: newAccountBalance });
      })
      .catch((error) => {
        console.error('Error fetching credits:', error);
      });

    fetch('https://johnnylaicode.github.io/api/debits.json')
      .then((response) => response.json())
      .then((debitData) => {
        // Update the state with the fetched debit data
        this.setState({ debitList: debitData });
  
        // Calculate the total debit amount
        const totalDebits = debitData.reduce((total, debit) => total + debit.amount, 0);
  
        // Calculate the new account balance
        const newAccountBalance = (this.state.accountBalance - totalDebits).toFixed(2);
  
        // Update the state with the new account balance
        this.setState({ accountBalance: newAccountBalance });
      })
      .catch((error) => {
        console.error('Error fetching debits:', error);
      });
  }
  addDebit = (event) => {
    event.preventDefault(); 
  
    
    const description = event.target.description.value;
    const amount = parseFloat(event.target.amount.value); // Parse the amount as a float
  
   
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  
    const newDebit = {
      description,
      amount,
      date: formattedDate,
    };
    const newAccountBalance = (this.state.accountBalance - amount).toFixed(2);
    const updatedDebitList = [...this.state.debitList, newDebit];
  
  
    this.setState({
      debitList: updatedDebitList,
      accountBalance: newAccountBalance
    });
  }

  addCredit = (event) => {
    event.preventDefault(); 
  
    const description = event.target.description.value;
    const amount = parseFloat(event.target.amount.value); // Parse the amount as a float
  
   
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  
    const newCredit = {
      description,
      amount,
      date: formattedDate,
    };
    const newAccountBalance = (parseFloat(this.state.accountBalance) + parseFloat(amount)).toFixed(2);
    const updatedDebitList = [...this.state.creditList, newCredit];
  
  
    this.setState({
      creditList: updatedDebitList,
      accountBalance: newAccountBalance
    });
   }
  // Create Routes and React elements to be rendered using React components
  render() {  
    // Create React elements and pass input props to components
    const HomeComponent = () => (<Home accountBalance={this.state.accountBalance} />)
    const UserProfileComponent = () => (
      <UserProfile userName={this.state.currentUser.userName} memberSince={this.state.currentUser.memberSince} />
    )
    const LogInComponent = () => (<LogIn user={this.state.currentUser} mockLogIn={this.mockLogIn} />)
    const CreditsComponent = () => (<Credits credits={this.state.creditList} addCredit ={this.addCredit} accountBalance ={this.state.accountBalance}/>) 
    const DebitsComponent = () => (<Debits debits={this.state.debitList} addDebit ={this.addDebit} accountBalance ={this.state.accountBalance}/>) 

    // Important: Include the "basename" in Router, which is needed for deploying the React app to GitHub Pages
    return (
      <Router basename="/assignment-3">
        <div>
          <Route exact path="/" render={HomeComponent}/>
          <Route exact path="/userProfile" render={UserProfileComponent}/>
          <Route exact path="/login" render={LogInComponent}/>
          <Route exact path="/credits" render={CreditsComponent}/>
          <Route exact path="/debits" render={DebitsComponent}/>
        </div>
      </Router>
    );
  }
}

export default App;
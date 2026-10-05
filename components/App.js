import React from 'react';
import './App_2.css';
import Header from './components/header';
import Balance from './components/balance';
import IncomeEspenses from './components/incomeEspenses';
import TransactionList from './components/TransactionList';
import AddTransaction from './components/AddTransaction';
import Background from './components/Background';   // new

import { GlobalProvider } from './context/GlobalState';

function App() {
  return (
    <GlobalProvider>
      <Background />   {/* new */}
      <Header />
      <div className="container">
        <Balance />
        <IncomeEspenses />
        <TransactionList />
        <AddTransaction />
      </div>
    </GlobalProvider>
  );
}

export default App;
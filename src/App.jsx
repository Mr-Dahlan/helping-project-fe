import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './features/dashboard/DashboardPage';
import Transaction from './features/transaction/TransactionPage';
import History from './features/history/HistoryPage';
import Success from './features/transaction/SuccessPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transaksi" element={<Transaction />} />
        <Route path="/riwayat" element={<History />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </BrowserRouter>
  );
}
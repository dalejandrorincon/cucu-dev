import React from "react";
import TransactionsList from "../../components/TransactionsList"
import Header from "../../components/Header"


export default function Transactions() {
    return (
        <div>
            <Header></Header>
            <TransactionsList></TransactionsList>    
        </div>
    );
}


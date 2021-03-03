import React, {useEffect, useState} from 'react'
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { stripe_publishable } from '../../utils/constants';

import PaymentForm from "../../components/PaymentForm"

import * as ServicesAPI from '../../api/services';
import Header from '../../components/Header';
import { Container } from 'react-bootstrap';

import "./styles.scss"

const promise = loadStripe(stripe_publishable);

export default function PaymentPage() {

    const { id } = useParams();

    const [service, setService] = useState();
   
    const getService = () => {
        ServicesAPI.getService(id, localStorage.getItem("token")).then((res) => {
            setService(res[0])
        })
    }

    useEffect(() => {
        getService()
    }, []);


    return (
        <div className="payment-page">
            <Header></Header>
            <Container>
                <h3>Pagar servicio</h3>
                
                <Elements stripe={promise}>
                    <PaymentForm service={service} />
                </Elements>
            </Container>
        </div>
    )
}

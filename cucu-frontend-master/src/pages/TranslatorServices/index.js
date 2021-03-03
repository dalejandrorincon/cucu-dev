import React, { useState } from "react";
import { Container, Row, Col, Form, InputGroup } from "react-bootstrap";
import ServicesList from "../../components/ServicesList"
import Header from "../../components/Header"


export default function TranslatorServices() {
    return (
        <div>
            <Header></Header>
            <ServicesList></ServicesList>            
        </div>
    );
}


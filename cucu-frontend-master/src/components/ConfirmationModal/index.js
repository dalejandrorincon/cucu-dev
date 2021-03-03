import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'

export default function ConfirmationModal(props) {

    const [response, setResponse] = useState(null)
    const [confirmDisable, setConfirmDisable] = useState(false)

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container className="form-container">
                    {props.body}
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.onHide}>
                    {props.cancel}
                </Button>
                <Button 
                    className="cucu-button"
                    disabled={confirmDisable}
                    onClick={()=>{ 
                        setConfirmDisable();    
                        props.setConfirm(); 
                    }}>
                    {props.confirm}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

import React, { useState, useCallback } from "react";

import { Form, Modal, Button } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";

import { Submit, Label, Control, Cancel } from "./styles"

import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useDropzone } from 'react-dropzone'

import * as UsersAPI from '../../api/users';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { isParseable } from "../../utils/constants"

import { useTranslation } from 'react-i18next';

export default function CertificationModal(props) {

    const [myFiles, setMyFiles] = useState([])

    const onDrop = useCallback(acceptedFiles => {
        setMyFiles([...myFiles, ...acceptedFiles])
    }, [myFiles])

    const { getRootProps, getInputProps, acceptedFiles, fileRejections } = useDropzone({ onDrop, maxSize: 5000000 })

    //console.log({...props.values})
    const { t, i18n } = useTranslation();

    const validationSchema = Yup.object().shape({
        name: Yup.string()
            .min(3, t('min-char', {num: 3}))
            .required(t('required-field')),
        school: Yup.string()
            .min(3, t('min-char', {num: 3}))
            .required(t('required-field')),
        date: Yup.string()
            .min(3, t('min-char', {num: 3}))
            .required(t('required-field'))
            .nullable(),
        /* url: Yup.string()
            .min(3, t('min-char', {num: 3}))
            .required(t('required-field')) */
    });


    const formik = useFormik({
        initialValues: {
            ...props.values
        },
        onSubmit: values => {
            saveChanges(values)
        },
        validationSchema: validationSchema,
        validateOnBlur: true,
        enableReinitialize: true

    });

    const saveChanges = async (values) => {
        let url = formik.values.url ? JSON.parse(formik.values.url) : []

        for (let i = 0; i < myFiles.length; i++) {
            const file = myFiles[i];
            const res = await UsersAPI.saveFile(file)                
            url.push({
                name: file.name,
                url: res.image.Location
            })                
        }
        setMyFiles([])
        props.newCertification({ ...values, url: JSON.stringify(url) })
        formik.resetForm()
    }

    const newFiles = myFiles.map((file, index) => (
        <div key={file.name} className="item">
            <p key={file.path}>
            {file.path} - {file.size} bytes
            </p>
            <Button className="remove" onClick={() => removeFile(file.path, "new", index)} >✕</Button>
        </div>
    ));

    const removeFile = (file, cond, index) => {
        switch(cond){
            case "old":
                let currentUrl = JSON.parse(formik.values.url)
                currentUrl = currentUrl.filter(e=>e.name!=file)
                console.log(currentUrl)
                formik.setFieldValue("url",JSON.stringify(currentUrl))
                break;
            case "new":
                let newFiles = [...myFiles]
                newFiles.splice(index, 1)
                console.log(newFiles)
                setMyFiles(newFiles)

        }
    }



    return (

        <Modal
            {...props}
            className="right"
            autoFocus
            keyboard
        >
            <Modal.Header closeButton>
                <Modal.Title>{t('certification.certification')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={formik.handleSubmit}>
                    <Form.Group>
                        <Label>{t('certification.name')}</Label>
                        <Control
                            id="name"
                            maxlength="100"
                            type="text"
                            value={formik.values.name}
                            onChange={(e) => {
                                formik.setFieldTouched('name');
                                formik.handleChange(e)
                            }}
                        />
                    </Form.Group>
                    {formik.touched.name && formik.errors.name ? (
                        <div className="alert alert-danger">{formik.errors.name}</div>
                    ) : null}

                    <Form.Group>
                        <Label>{t('certification.school')}</Label>
                        <Control
                            id="school"
                            type="textarea"
                            maxlength="100"
                            as="textarea"
                            rows="5"
                            value={formik.values.school}
                            onChange={(e) => {
                                formik.setFieldTouched('school');
                                formik.handleChange(e)
                            }}
                        />
                    </Form.Group>
                    {formik.touched.school && formik.errors.school ? (
                        <div className="alert alert-danger">{formik.errors.school}</div>
                    ) : null}
                    <Form.Group>
                        <Label>{t('certification.date')}</Label>
                        <DatePicker
                            id="date"
                            type="text"           
                            dateFormat="dd/MM/yyyy" 
                            maxDate={new Date()}
                            selected={(formik.values.date && new Date(formik.values.date)) || null}
                            onChange={ (e)=>{
                                formik.setFieldTouched('date');
                                formik.setFieldValue('date', e)
                                console.log(e)
                            }}
                           /*  customInput={
                              <ExampleCustomInput></ExampleCustomInput>
                            } */
                        />
                        {/* <Control
                            id="date"
                            type="text"
                            value={formik.values.date}
                            onChange={(e) => {
                                formik.setFieldTouched('date');
                                formik.handleChange(e)
                            }}
                        /> */}
                    </Form.Group>
                    {formik.touched.date && formik.errors.date ? (
                        <div className="alert alert-danger">{formik.errors.date}</div>
                    ) : null}

                    <Label>{t('certification.certification')}</Label>

                    <div className="dropzone-container">
                        <div {...getRootProps({ className: 'dropzone' })}>
                            <input {...getInputProps()} />
                            <p>{t('attachment-label')}</p>
                            <p>{t('attachment-cap')}</p>
                        </div>
                        <aside>
                            
                            { (formik?.values?.url) && isParseable(formik?.values?.url) ? JSON.parse(formik.values.url).map((file, index) => (
                                <div key={file.name} className="item">
                                    <p>
                                        <a className="filename" target="_blank" href={file.url}>{file.name}</a>
                                    </p>
                                    <Button className="remove" onClick={() => removeFile(file.name, "old")} >✕</Button>
                                </div>
                                )) : null
                            }

                            {newFiles}

                        </aside>
                        {fileRejections.length>0 ? 
                            (<div className="alert alert-danger">{t('attachment-error')}</div>)
                            : null
                        }
                    </div>

                </Form>


            </Modal.Body>
            <Modal.Footer>
                <Submit onClick={() => formik.submitForm()}>
                    {t('certification.add')}
                </Submit>
                <Cancel onClick={props.onHide}>
                    {t('certification.cancel')}
                </Cancel>
            </Modal.Footer>

        </Modal>
    );
}



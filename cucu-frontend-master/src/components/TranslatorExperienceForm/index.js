import React, { useState, useEffect } from 'react'
import ReactTags from 'react-tag-autocomplete'
import './styles.scss';

import { Form, Dropdown, Button, Alert } from "react-bootstrap";

import { useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import 'moment/locale/es'  // without this line it didn't work
import { useTranslation } from 'react-i18next';

import * as PlatformsAPI from '../../api/platforms';
import * as LanguagesAPI from '../../api/languages';
import * as SpecialitiesAPI from '../../api/specialities';
import * as UsersAPI from '../../api/users';

import ExperienceModal from '../ExperienceModal';
import CertificationModal from '../CertificationModal';

import { Title, Submit } from "./styles"

export default function TranslatorExperienceForm() {
    const { t, i18n } = useTranslation();
    moment.locale('es')

    const [buttonState, setButtonState] = useState({ label: t('experience.save-changes'), disabled: false })
    const [submitAttempt, setSubmitAttempt] = useState(false)

    const [response, setResponse] = useState(null)

    const [platforms, setPlatforms] = useState([]);
    const [selectedPlatforms, setSelectedPlatforms] = useState([]);

    const [languages, setLanguages] = useState([]);
    const [selectedLanguages, setSelectedLanguages] = useState([]);

    const [specialities, setSpecialities] = useState([]);
    const [selectedSpecialities, setSelectedSpecialities] = useState([]);

    const [modalExperiences, setModalExperiences] = useState(false);
    const [selectedExperience, setSelectedExperience] = useState({
        company: "",
        description: "",
        labor_months: "",
        url: ""
    });

    const [modalCertifications, setModalCertifications] = useState(false);
    const [selectedCertification, setSelectedCertification] = useState({
        name: "",
        school: "",
        date: "",
        url: ""
    });


    const [entity, setEntity] = useState({
        platforms: "",
        languages: "",
        specialities: "",
        experiences: [],
        certifications: [],
    });

    const validationSchema = Yup.object().shape({
        /* platforms: Yup.string()
            .min(3, "*Este campo debe tener al menos 3 caracteres")
            .required("*Este campo es obligatorio"),
        languages: Yup.string()
            .min(3, "*Este campo debe tener al menos 3 caracteres")
            .required("*Este campo es obligatorio"),
        specialities: Yup.string()
            .min(3, "*Este campo debe tener al menos 3 caracteres")
            .required("*Este campo es obligatorio"),
        experiences: Yup.string()
            .min(3, "*Este campo debe tener al menos 3 caracteres")
            .required("*Este campo es obligatorio"),
        certifications: Yup.string()
            .min(3, "*Este campo debe tener al menos 3 caracteres")
            .required("*Este campo es obligatorio") */
    });

    const formik = useFormik({
        initialValues: {
            ...entity,
            from: "",
            to: "",
            speciality :""
        },
        onSubmit: values => {

            if(
                !(selectedPlatforms && selectedPlatforms.length == 0 ) &&
                !(selectedLanguages && selectedLanguages.length == 0 ) &&
                !(selectedSpecialities && selectedSpecialities.length == 0 )
                //!(!formik.values.work_experience || formik.values.work_experience.length==0  )
                //!(!formik.values.certifications || formik.values.certifications.length==0 ) 
            ){
                saveChanges(values)
            }
        },
        validationSchema: validationSchema,
        validateOnBlur: true,
        enableReinitialize: true

    });

    const reactTags = React.createRef()

    const saveChanges = (values) => {

        let remote_tools = selectedPlatforms.map((item) => item.id)

        let specialities = selectedSpecialities.map((item) => item.id)

        let payload = {
            remote_tools: JSON.stringify(remote_tools),
            specialities: JSON.stringify(specialities),
            languages: JSON.stringify(selectedLanguages),
            work_experience: JSON.stringify(values.work_experience),
            certifications: JSON.stringify(values.certifications),
            approved_translator: 1
        }

        console.log(payload)

        UsersAPI.updateUser(payload, localStorage.getItem("token")).then((res) => {
            let message = t('translator-profile.successful-changes')
            setButtonState({ label: t('experience.save-changes'), disabled: false })
            setResponse(
                <Alert variant={'success'} >
                    {message}
                </Alert>
            )
        }).catch((err) => {
            console.log(err)
            let message;
            message = t('translator-profile.changes-error')

            setResponse(
                <Alert variant={'danger'} >
                    {message}
                </Alert>
            )
        })

    }

    useEffect(() => {
        getButton();
    }, [i18n.language]);

    const getButton = () =>{
        setButtonState({ label: t('experience.save-changes'), disabled: false })
    }


    useEffect(() => {
        getPlatforms();
        getLanguages();
        getSpecialities();
        getProfile();
    }, []);

    const getProfile = () => {
        UsersAPI.getUser({}, localStorage.getItem("userId")).then((res) => {
            console.log(res.user)
            setEntity(res.user)
            if(res.user.remote_tools) setSelectedPlatforms(res.user.remote_tools)
            if(res.user.specialities){
                res.user.specialities.forEach(element => {
                    if(i18n.language=="ES"){
                        element.name=element.name_es
                    }else{
                        element.name=element.name_en
                    }
                });
            }
            if(res.user.specialities) setSelectedSpecialities(res.user.specialities)
            if(res.user.languages) setSelectedLanguages(res.user.languages)
        })
    };

    const getPlatforms = () => {
        PlatformsAPI.getPlatforms().then((res) => {
            console.log(res)
            setPlatforms(res)
        })
    };

    const getLanguages = () => {
        LanguagesAPI.getLanguages().then((res) => {
            console.log(res)
            setLanguages(res)
        })
    };

    const getSpecialities = () => {
        SpecialitiesAPI.getSpecialities(i18n.language).then((res) => {

            res.forEach(element => {
                if(i18n.language=="ES"){
                    element.name=element.name_es
                }else{
                    element.name=element.name_en
                }
            });

            console.log(res)

            console.log(res)
            setSpecialities(res)
        })
    }

    const switchLanguages = () =>{
        let languages = [formik.values.from, formik.values.to]
        console.log(languages)
        formik.setFieldValue("from", languages[1])
        formik.setFieldValue("to", languages[0])
    }


    const onDelete = (i, type) => {
        let newTags
        switch (type) {
            case "platforms":
                newTags = selectedPlatforms.slice(0)
                newTags.splice(i, 1)
                setSelectedPlatforms(newTags)
                break;
            case "specialities":
                newTags = selectedSpecialities.slice(0)
                newTags.splice(i, 1)
                setSelectedSpecialities(newTags)
        }
    }

    const onAddition = (type) => {
        let current;
        switch (type) {
            case "platforms":
                current = platforms.filter((item)=> item.id == formik.values.platform )
                setSelectedPlatforms([ ...selectedPlatforms, ...current ])
                break;
            case "specialities":
                console.log(selectedSpecialities)
                current = specialities.filter((item)=> item.id == formik.values.speciality )
                setSelectedSpecialities([ ...selectedSpecialities, ...current ])
        }
    }

    const newExperience = (data, type) => {
        switch (type) {
            case "experiences":
                setSelectedExperience({
                    company: "",
                    description: "",
                    labor_months: "",
                    url: ""
                })
                setModalExperiences(true)

                break;

            case "certifications":
                setSelectedCertification({
                    name: "",
                    school: "",
                    date: "",
                    url: ""
                })
                setModalCertifications(true)
        }
    }

    const saveExperience = (data, type) => {
        let current;
        switch (type) {
            case "experiences":
                if(formik.values.work_experience){
                    current = formik.values.work_experience
                }else{
                    current = []
                }
                if (data.index == undefined) {
                    current.push(data)
                    formik.setFieldValue("work_experience", current)
                } else {
                    current[data.index] = data
                    delete current[data.index].index
                    formik.setFieldValue("work_experience", current)
                }
                setModalExperiences(false)
                break;

            case "certifications":
                if(formik.values.certifications){
                    current = formik.values.certifications
                }else{
                    current = []
                }
                if (data.index == undefined) {
                    current.push(data)
                    formik.setFieldValue("certifications", current)
                } else {
                    current[data.index] = data
                    delete current[data.index].index
                    formik.setFieldValue("certifications", current)
                }
                setModalCertifications(false)
        }
    }

    const editExperience = (index, type) => {
        let current;
        switch (type) {
            case "experiences":
                current = formik.values.work_experience
                setSelectedExperience({ ...current[index], ...{ index: index } })
                setModalExperiences(true)
                break;

            case "certifications":
                current = formik.values.certifications
                setSelectedCertification({ ...current[index], ...{ index: index } })
                setModalCertifications(true)
        }
    }

    const removeExperience = (index, type) => {
        console.log(index)
        let current;
        switch (type) {
            case "experiences":
                current = formik.values.work_experience
                current.splice(index, 1)
                formik.setFieldValue("experiences", current)
                break;

            case "certifications":
                current = formik.values.certifications
                current.splice(index, 1)
                formik.setFieldValue("certifications", current)
        }
    }

    const addLanguage = () => {

        let fromLabel
        let toLabel
        let fromLabelES
        let fromLabelEN
        let toLabelES
        let toLabelEN

        languages.forEach(element => {
            if (element.id == formik.values.from) {
                fromLabel = element.name
                fromLabelES = element.name_es
                fromLabelEN = element.name_en
            }
            if (element.id == formik.values.to) {
                toLabel = element.name
                toLabelES = element.name_es
                toLabelEN = element.name_en
            }
        });


        if (formik.values.from && formik.values.to) {
            setSelectedLanguages([...selectedLanguages, {
                from: {
                    id: formik.values.from,
                    name: fromLabel,
                    name_es: fromLabelES,
                    name_en: fromLabelEN
                    
                },
                to: {
                    id: formik.values.to,
                    name: toLabel,
                    name_es: toLabelES,
                    name_en: toLabelEN                    
                }
            }])
        }
    }

    const removeLanguage = (index) => {
        let sel = selectedLanguages
        sel.splice(index, 1)
        setSelectedLanguages([...sel])
    }


    return (
        <div className="translator-experience-form">

            <Title>{t('experience.experience')}</Title>

            { entity?.approved_translator == "0" ?                
            <Alert variant="primary" className="alert-profile">
                {t('must-fill-profile')}
            </Alert>
            :null
            }

            <Form onSubmit={formik.handleSubmit}>
                <h6><b>{t('experience.remote-tools')}</b></h6>
                <div className="platforms-panel">
                    {selectedPlatforms?.map((elm, index) => (
                        <div key={index} className="item">
                            <div><p>{elm.name}</p></div>
                            <Button className="remove" onClick={() => onDelete(index, "platforms")} >✕</Button>
                        </div>
                    ))}
                </div>

                <div className="platform-select">
                    <Form.Control
                        as="select"
                        id="platform"
                        name="platform"
                        className="form-control input-lg"
                        onChange={e => {
                            formik.handleChange(e);
                        }}
                        value={formik.values.platform}>
                        <option value="">{t('all-platforms')}</option>
                        {platforms?.map((elm) => (
                            <option key={elm.id} value={elm.id} > {elm.name}  {}</option>
                        ))}
                    </Form.Control>
                    <Button className="add" onClick={() => onAddition('platforms')} >{t('add')}</Button>
                </div>

                {selectedPlatforms && selectedPlatforms.length == 0 && submitAttempt ? (
                    <div className="alert alert-danger">{t('experience.tools-must')}</div>
                ) : null}

                <h6><b>{t('experience.languages')}</b></h6>
                <p><b>{t('experience.languages-label')}</b></p>

                <div className="Language-panel">
                    {selectedLanguages?.map((elm, index) => (
                        <div key={index} className="item">
                            <div><p>{t('experience.from')} {i18n.language=="ES" ? elm.from.name_es : elm.from.name_en} {t('experience.to')} { i18n.language=="ES" ? elm.to.name_es : elm.to.name_en }</p></div>
                            <Button className="remove" onClick={() => removeLanguage(index)} >✕</Button>
                        </div>
                    ))}
                </div>

                <div className="filter-language">
                    <div>
                        <Form.Control
                            as="select"
                            id="from"
                            name="from"
                            className="form-control input-lg"
                            onChange={e => {
                                formik.handleChange(e);
                            }}
                            value={formik.values.from} >
                            <option value="">{t('select')}</option>
                            {languages?.map((elm) => (
                                <option key={elm.id} value={elm.id} >{ i18n.language=="ES" ? elm.name_es : elm.name_en}</option>
                            ))}
                        </Form.Control>
                        <Button className="switch" onClick={() => switchLanguages()}>
                            <img
                                className="img-filer"
                                src="/assets/images/load.png"
                            ></img>
                        </Button>
                        <Form.Control
                            as="select"
                            id="to"
                            name="to"
                            className="form-control input-lg"
                            onChange={e => {
                                formik.handleChange(e);
                            }}
                            value={formik.values.to} >
                            <option value="">{t('select')}</option>
                            {languages?.map((elm) => (
                                <option key={elm.id} value={elm.id}>{ i18n.language=="ES" ? elm.name_es : elm.name_en}</option>
                            ))}
                        </Form.Control>
                    </div>
                    <Button className="add" onClick={() => addLanguage()} >{t('add')}</Button>
                </div>

                {selectedLanguages && selectedLanguages.length == 0 && submitAttempt ? (
                    <div className="alert alert-danger">{t('experience.required-language')}</div>
                ) : null}

                <h6><b>{t('experience.specialities')}</b></h6>
                <p>{t('experience.specialities-label')}</p>
                <div className="specialities-panel">
                    {selectedSpecialities?.map((elm, index) => (
                        <div key={index} className="item">
                            <div><p>{elm.name}</p></div>
                            <Button className="remove" onClick={() => onDelete(index, "specialities")} >✕</Button>
                        </div>
                    ))}
                </div>

                <div className="speciality-select">
                    <Form.Control
                        as="select"
                        id="speciality"
                        name="speciality"
                        className="form-control input-lg"
                        onChange={e => {
                            formik.handleChange(e);
                        }}
                        value={formik.values.speciality}>
                        <option value="">{t('all-specialities')}</option>
                        {specialities?.map((elm) => (
                            <option key={elm.id} value={elm.id} > {i18n.language=="ES" ? elm.name_es : elm.name_en }  {}</option>
                        ))}
                    </Form.Control>
                    <Button className="add" onClick={() => onAddition('specialities')} >{t('add')}</Button>
                </div>

                
                {selectedSpecialities && selectedSpecialities.length == 0 && submitAttempt ? (
                    <div className="alert alert-danger">{t('experience.required-speciality')}</div>
                ) : null}

                <h6><b>{t('experience.experience')}</b></h6>
                <p>{t('experience.experience-label')}</p>

                <div className="experience-component">
                    {formik.values.work_experience?.map((experience, index) => (
                        <div className="experience-container" key={index}>
                            <div className="top">
                                <div className="head">
                                    <b className="title">{experience.company}</b>
                                </div>
                                <div className="options">
                                    <Dropdown className="cucu-dropdown">
                                        <Dropdown.Toggle variant="outline-success" className="green" id="dropdown-basic">
                                            ...
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => editExperience(index, "experiences")}>
                                                {t('edit')}
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => removeExperience(index, "experiences")}>
                                                {t('delete')}
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="new-exp">
                        <Button onClick={() => newExperience(true, "experiences")}>
                            {t('experience.add')}
                        </Button>

                    </div>

                </div>

                {/* { ( !formik.values.work_experience || formik.values.work_experience.length == 0 ) && submitAttempt  ? (
                    <div className="alert alert-danger">{t('experience.required-experience')}</div>
                ) : null} */}


                <h6><b>{t('certification.certifications')}</b></h6>
                <p>{t('experience.certification-label')}</p>

                <div className="experience-component">
                    {formik.values.certifications?.map((certification, index) => (
                        <div className="experience-container" key={index}>
                            <div className="top">
                                <div className="head">
                                    <b className="title">{certification.name}</b>
                                    <p className="time">{moment(certification.date).format("YYYY")}</p>
                                </div>
                                <div className="options">
                                    <Dropdown className="cucu-dropdown">
                                        <Dropdown.Toggle variant="outline-success" className="green" id="dropdown-basic">
                                            ...
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => editExperience(index, "certifications")}>
                                                {t('edit')}
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => removeExperience(index, "certifications")}>
                                                {t('delete')}
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="new-exp">
                        <Button onClick={() => newExperience(true, "certifications")}>
                            {t('certification.add')}
                        </Button>

                    </div>

                </div>
                {/* { (!formik.values.certifications || formik.values.certifications.length==0) && submitAttempt ? (
                    <div className="alert alert-danger">{t('experience.required-certificate')}</div>
                ) : null} */}

                {
                    !(
                    !(selectedPlatforms && selectedPlatforms.length == 0 ) &&
                    !(selectedLanguages && selectedLanguages.length == 0 ) &&
                    !(selectedSpecialities && selectedSpecialities.length == 0 )
                    ) && submitAttempt ? (
                        <div className="alert alert-danger">{t('all-required-error')}</div>
                    ) : null
                }

                <Submit
                    disabled={buttonState.disabled}
                    type="button"
                    type="submit"
                    onClick={()=>{setSubmitAttempt(true)}}
                >
                    {buttonState.label}
                </Submit>

                {response}

            </Form>

            <ExperienceModal
                newExperience={(data) => saveExperience(data, "experiences")}
                onHide={() => setModalExperiences(false)}
                show={modalExperiences}
                values={selectedExperience}
            ></ExperienceModal>


            <CertificationModal
                newCertification={(data) => saveExperience(data, "certifications")}
                onHide={() => setModalCertifications(false)}
                show={modalCertifications}
                values={selectedCertification}
            ></CertificationModal>

        </div>
    )
}

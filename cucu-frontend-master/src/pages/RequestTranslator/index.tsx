/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-use-before-define */

import React, { useState, useEffect, useCallback } from "react";
import { logout } from "../../utils/session";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link, useHistory, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { Title, PasswordInfo, WellContainer, RowRecover, Label, Submit, Control, OptionActive } from "./styles"
import "./styles.scss"
import moment from "moment";

import { useDropzone } from 'react-dropzone'

import * as ServicesAPI from '../../api/services';
import * as UsersAPI from '../../api/users';
import * as PlatformsAPI from '../../api/platforms';
import * as UnavailabilitiesAPI from '../../api/unavailabilities';


import { combineDateWithTime } from "../../utils/constants"
import { useFormik } from 'formik';
import { any } from "prop-types";
import Header from "../../components/Header";
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

const baseUri = process.env.REACT_APP_API_URL;

function RequestTranslatorPage() {
  const history = useHistory();
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const { register, handleSubmit, errors } = useForm();

  const [translator, setTranslator] = useState<any>({});
  const [platforms, setPlatforms] = useState<any>([]);
  
  const [unavailabilities, setUnavailabilities] = useState<any>([]);
  const [excludedDates, setExcludedDates] = useState<any>([]);
  const [excludedTimes, setExcludedTimes] = useState<any>([]);

  const [myFiles, setMyFiles] = useState<any>([])

  const onDrop = useCallback(acceptedFiles => {
    setMyFiles([...myFiles, ...acceptedFiles])
  }, [myFiles])
  const { t, i18n } = useTranslation();
  const [buttonState, setButtonState] = useState({ label: t('request.request-service'), disabled: false })
	const [response, setResponse] = useState<any>(null)


  const { getRootProps, getInputProps, acceptedFiles, fileRejections } = useDropzone({ onDrop, maxSize: 5000000 })

  const parameters = useParams<any>()
  const translatorId = parameters.id

  const validationSchema = Yup.object().shape({
    duration_amount: Yup.string()
      .min(1, t('min-char', {num: 1}))
      .max(4, t('max-char', {num: 4}))
      .required(t('required-field')),
    url: Yup.string()
      .when('service_site', {
        is: (service_site) => service_site=="1",
        then: Yup.string()
          .min(3, t('min-char', {num: 3}))
          .max(500, t('max-char', {num: 500}))
          //.required(t('required-field')),
      }),
    platform_id: Yup.string()
      .when('service_site', {
        is: (service_site) => service_site=="1",
        then: Yup.string()          
          .min(1, t('required-value'))
    }),
    date_day: Yup.string()
      .min(1, t('required-value'))
      .required(t('required-field')),
    date_time: Yup.string()
      .min(1, t('required-value'))
      .required(t('required-field')),
    description: Yup.string()
      .max(500, t('max-char', {num: 500})),
    platform_other: Yup.string()
      .when('platform_id', {
        is: (platform_id) => platform_id=="0",
        then: Yup.string()
          .required(t('request.select-platform'))            
      })
  });

  const formik = useFormik({
    initialValues: {
      service_site: "1",
      service_type: "1",
      time_type: "0",
      url: "",
      platform_id: "",
      date: "",
      duration_amount: "",
      duration_type: "0",
      description: "",
      //record: "",
      date_day: "",
      date_time: "",
      client_id: localStorage.getItem("userId"),
      translator_id: translatorId,
      platform_other: ""
    },
    onSubmit: values => {
      createService(values)
    },
    validationSchema: validationSchema,
    validateOnBlur: true,
    enableReinitialize: true

  });



  useEffect(() => {
    getTranslator();
    getPlatforms()
    getUnavailabilities()
  }, []);

  const getTranslator = () => {
    UsersAPI.getUser({}, translatorId).then((res) => {
      setTranslator(res.user)
    })
  }

  const getPlatforms = () => {
    PlatformsAPI.getPlatforms().then((res) => {
      setPlatforms(res)
    })
  }

  const getUnavailabilities = () => {
    UnavailabilitiesAPI.allUserUnavailabilities( localStorage.getItem("token"), translatorId).then((res) => {
      getExclusions(res)
      setUnavailabilities(res)
    })
  }

  const getExclusions = (unavailabilities) => {
    let exclusions: Array<Date> = []
    unavailabilities.forEach(element => {
      let start = moment(element.to).startOf("day")
      let end = moment(element.from).startOf("day")
      let diff = start.diff(end, 'days') 
      if(diff>1){
        console.log(start)
      console.log(end)
      console.log(diff)
        for (let i = 1; i < diff; i++) {
          exclusions.push(moment(element.from).add(i, "days").toDate())          
        }
      }
    });
    setExcludedDates(exclusions)
  }

  const changeExcludedDate = (e) => {
    let excluded : Array<any> = []
    let currentDay = e
    console.log(unavailabilities)
    unavailabilities.forEach(element => {

      if(
        moment(element.from).startOf("day").isSameOrBefore(moment(currentDay)) &&
        moment(element.to).endOf("day").isSameOrAfter(moment(currentDay)) 
      ){

        for (let i = 0; i < 48; i++) {
          if((moment(element.from).startOf('minute')).isSameOrBefore(currentDay) &&  moment(element.to).isSameOrAfter(currentDay) ){
            excluded.push(currentDay)
          }
          currentDay = moment(currentDay).add(30, 'minutes').toDate()
          
        }
      }
    })
    setExcludedTimes(excluded)
  }


  const createService = async (values) => {

		setButtonState({ ...buttonState, ...{ disabled: true, label: t('request.sending') } })

    let files_urls = [] as any
    for (let i = 0; i < myFiles.length; i++) {
      const file = myFiles[i];
      const res = await UsersAPI.saveFile(file)
      files_urls.push({
        name: file.name,
        url: res.image.Location
      })
    }

    if(values.platform_id=="0" || values.platform_id==""){
      delete values.platform_id
    }

    let date = combineDateWithTime(formik.values.date_day, formik.values.date_time)
    let payload = { ...values, files_urls: JSON.stringify(files_urls), date: date }

    ServicesAPI.createService(localStorage.getItem("token"), payload).then((res) => {
      console.log(res)
      setButtonState({ label: t('request.request-service'), disabled: false })
      history.push("/services")
    }).catch((err) => {
			let message;
			message = 'Ha ocurrido un error al enviar el correo.'
      setButtonState({ label: t('request.request-service'), disabled: false })
			setResponse(
				<Alert variant={'danger'} >
					{message}
				</Alert>
			)
		})

  }

  const newFiles = myFiles.map((file, index) => (
    <div key={file.name} className="item">
      <p key={file.path}>
        {file.path} - {file.size} bytes
        </p>
      <Button className="remove" onClick={() => removeFile(file.path, index)} >✕</Button>
    </div>
  ));

  const removeFile = (file, index) => {
    let newFiles = [...myFiles]
    newFiles.splice(index, 1)
    console.log(newFiles)
    setMyFiles(newFiles)
  }


  return (
    <>
      <Header></Header>

      <Container className="themed-container request-translator">
        <div className="request-back">
          <Link to="/translators" >
            <i className="fa fa-arrow-circle-left" aria-hidden="true"></i>
            {t('request.cancel-request')}
          </Link>
        </div>
        <RowRecover>
          <Col className="col-md-5 mx-auto">
            <WellContainer>
              <div className="header-request">
                <img
                  className="icon-request ico-user"
                  src={translator?.image_url ? translator.image_url : "/assets/images/no_avatar_default.png"}
                  alt="logo"
                />
                <Title>
                  {t('request.hire')} {translator?.firstname} {translator?.lastname}
                </Title>
              </div>
              <Row>
                <Col>
                  <OptionActive type="button">{t('request.programmed')}</OptionActive>
                </Col>
              </Row>
              <Form
                className="form-request"
              //onSubmit={handleSubmit(onSubmit)}
              >
                <Form.Group>
                  <Label className="label-filter">{t('request.service-site')}</Label>
                  <PasswordInfo>
                    {t('request.site-label')}
                    </PasswordInfo>
                  {/* <div key={`inline-radio`} className="mb-3">
                    <Form.Check
                      inline
                      label={t('request.external-platform')}
                      name="service_site"
                      type="radio"
                      id={`inline-radio-2`}
                      value="1"
                      checked
                    />
                  </div> */}                  

                  <label className="site_form"
                    onClick={() => {
                      formik.setFieldValue("service_site", "1")
                    }}
                  >
                    <Form.Check
                      type="radio"
                      label={t('request.external-platform')}
                      name="service_site"

                      checked={formik.values.service_site == "1" ? true : false}
                    />
                  </label>

                  <label className="site_form"
                    onClick={() => {
                      formik.setFieldValue("service_site", "2")
                    }}
                  >
                    <Form.Check
                      type="radio"
                      label={t('request.zoom-cucu')}
                      name="service_site"
                      checked={formik.values.service_site == "2" ? true : false}
                    />
                  </label>
                </Form.Group>
                
                { formik.values.service_site=="1" ?
                <>

                  <Form.Group>
                    <Label className="label-filter">URL</Label>
                    <p>
                    {t('request.url-label')}
                    </p>
                    <Control
                      type="text"
                      className="input-request"
                      id="url"
                      name="url"
                      placeholder={t('request.enter-link')}
                      value={formik.values.url}
                      onChange={(e) => {
                        formik.handleChange(e)
                      }}
                    />
                  </Form.Group>

                  {formik.touched.url && formik.errors.url ? (
                    <div className="alert alert-danger">{formik.errors.url}</div>
                  ) : null}

                  <Form.Group>
                    <Label className="label-filter">{t('request.platform')}</Label>
                    <PasswordInfo>
                      {t('request.platform-label')}
                      </PasswordInfo>
                    <Form.Control
                      as="select"
                      className="form-select input-request"
                      id="platform_id"
                      name="platform_id"
                      value={formik.values.platform_id}
                      onChange={(e) => {
                        formik.handleChange(e)
                      }}
                    >
                      <option value="">{t('request.platform-select')}</option>
                      {platforms?.map((elm: any) => (
                        <option key={elm.id} value={elm.id} >{elm.name}</option>
                      ))}
                      <option value="0">{t('request.other')}</option>

                    </Form.Control>

                    { formik.values.platform_id=="0" ? 
                      <>
                        <Label className="label-filter">{t('request.which-one')}</Label>
                        <Control
                          inline
                          type="text"
                          className="input-request"
                          id="platform_other"
                          name="platform_other"
                          placeholder={t('request.enter-value')}
                          value={formik.values.platform_other}
                          onChange={(e) => {
                            formik.handleChange(e)
                          }}
                        />
                      </>
                      :
                      null
                    }

                    {formik.touched.platform_id && formik.errors.platform_id ? (
                      <div className="alert alert-danger">{formik.errors.platform_id}</div>
                    ) : null}

                    {formik.touched.platform_other && formik.errors.platform_other ? (
                      <div className="alert alert-danger">{formik.errors.platform_other}</div>
                    ) : null}

                    <br></br>
                    {/* <div key={`inline-radio`} className="mb-3">
                      <Form.Check
                        inline
                        label="No tengo los datos de la sesión"
                        type="radio"
                        checked
                      />
                    </div> */}
                  </Form.Group>
                </> : null }
                <Form.Group className="time-radio">
                  <Label className="label-filter">{t('request.length')}</Label><span className="required">*</span>

                  <div
                    key={`inline-radio`}
                    className="mb-3 margin-top-10"
                  >

                    <label
                      onClick={() => {
                        formik.setFieldValue("duration_type", "0")
                      }}
                    >
                      <Form.Check
                        type="radio"
                        label={t('hours')}
                        name="duration_type"
                        checked={formik.values.duration_type == "0" ? true : false}
                      />
                    </label>

                    <label
                      onClick={() => {
                        formik.setFieldValue("duration_type", "1")
                      }}
                    >
                      <Form.Check
                        type="radio"
                        label={t('minutes')}
                        name="duration_type"

                        checked={formik.values.duration_type == "1" ? true : false}
                      />
                    </label>

                    <Control
                      inline
                      type="number"
                      className="input-request"
                      id="duration_amount"
                      name="duration_amount"
                      placeholder={t('request.enter-value')}
                      value={formik.values.duration_amount}
                      onChange={(e) => {
                        formik.handleChange(e)
                      }}
                    />



                  </div>

                </Form.Group>
                {formik.touched.duration_amount && formik.errors.duration_amount ? (
                  <div className="alert alert-danger">{formik.errors.duration_amount}</div>
                ) : null}
                <Form.Group>
                  <Label className="label-filter">{t('date')}</Label><span className="required">*</span>
                  <Row className="margin-row-form">
                    <Col className="col-md-4">
                      <DatePicker
                        className="form-control"
                        placeholderText={t('date')}
                        selected={(formik.values.date_day && new Date(formik.values.date_day)) || null}
                        onChange={(e) => {
                          formik.setFieldTouched('date_day');
                          formik.setFieldValue('date_day', e);
                          changeExcludedDate(e)
                          console.log(e)
                        }}
                        excludeDates={excludedDates}
                        minDate={new Date()}
                        dateFormat="dd/MM/yyyy"

                      />
                    </Col>
                    <Col className="col-md-3">
                      <DatePicker
                        className="form-control"
                        placeholderText={t('request-modal.time')}
                        selected={(formik.values.date_time && new Date(formik.values.date_time)) || null}
                        onChange={(e) => {
                          formik.setFieldTouched('date_time');
                          formik.setFieldValue('date_time', e)
                          console.log(e)
                        }}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={30}
                        timeCaption="Time"
                        dateFormat="h:mm aa"
                        minTime={ moment().isSame(moment((formik?.values?.date_day).toString()), 'date') ? moment().toDate() : moment().startOf("day").toDate()}
                        maxTime={ moment().endOf("day").toDate()}
                        excludeTimes={excludedTimes}
                      />
                    </Col>
                  </Row>
                </Form.Group>

                {(formik.touched.date_day && formik.errors.date_day) ||
                  (formik.touched.date_time && formik.errors.date_time) ? (
                    <>
                      <div className="alert alert-danger">{t('request.date-time-error')}</div>
                    </>
                  ) : null}


                <Form.Group>
                  <Label className="label-filter">
                    {t('request.additional-comments')}
                    </Label>
                  <Control
                    type="text"
                    placeholder={t('request.comments-label')}
                    className="input-request"
                    name="description"
                    id="description"
                    value={formik.values.description}
                    onChange={(e) => {
                      formik.handleChange(e)
                    }}
                  />
                </Form.Group>

                {formik.touched.description && formik.errors.description ? (
                    <div className="alert alert-danger">{formik.errors.description}</div>
                ) : null}

                <Form.Group>
                  <div className="dropzone-container">
                    <div {...getRootProps({ className: 'dropzone' })}>
                      <input {...getInputProps()} />
                      <p>{t('attachment-label')}</p>
                      <p>{t('attachment-cap')}</p>
                    </div>
                    <aside>
                      {newFiles}
                    </aside>
                  </div>
                  {fileRejections.length>0 ? 
                    (<div className="alert alert-danger">{t('attachment-error')}</div>)
                    : null
                  }
                </Form.Group>

                <div className="service-price">
                  { formik.values.duration_type && formik.values.duration_amount ? 
                    <>{t('request.service-price')} ${formik.values.duration_type == "0" ? translator?.rate_hour * parseInt(formik.values.duration_amount) + 5 : translator?.rate_minute * parseInt(formik.values.duration_amount) + 5  } ($
                    {formik.values.duration_type == "0" ? translator?.rate_hour : translator?.rate_minute}
                      x{formik.values.duration_amount}) + $5
                    </>
                    : null
                  }
                </div>  

                {formik.submitCount && !formik.isValid ? (
                  <div className="alert alert-danger">{t('all-required-error')}</div>
                ) : null}

                <p><small><b><span className="required">*</span>{t('required-fields')}</b></small></p>

                <Submit disabled={buttonState.disabled} onClick={() => formik.submitForm()}>{buttonState.label}</Submit>

                {response}

              </Form>
            </WellContainer>
          </Col>
        </RowRecover>
      </Container>
    </>
  );
}

export default RequestTranslatorPage;

/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logout } from "../../utils/session";
import {
  Container,
  Row,
  Col,
  Form,
  FormControl,
  Button,
  Collapse
} from "react-bootstrap";
import { Link, useHistory, useParams } from "react-router-dom";
import { Range } from "rc-slider";
import { FormGroup, Modal} from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Rating from "react-rating";
import {
  Title,
  WellContainer,
  PasswordRecover,
  RowRecover,
  LabelFilter,
  ColFilter,
  ResendLink,
  TextFilter,
  TextFilterBox,
  TextFilterBoxEnd
} from "./styles"
import './styles.scss';

import Header from "../../components/Header"

import * as UsersAPI from '../../api/users';
import * as SpecialitiesAPI from '../../api/specialities';
import * as LanguagesAPI from '../../api/languages';
import * as ServicesAPI from '../../api/translator_services';
import moment from 'moment';

import { combineDateWithTime, getWindowDimensions } from "../../utils/constants"
import ReactPaginate from 'react-paginate';

import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { get } from "https";

interface Props {
  counter: number;
  reduxIncreaseCounter: () => void;
  reduxDecreaseCounter: () => void;
}

function TranslatorsPage({
  reduxIncreaseCounter,
  reduxDecreaseCounter,
  counter,
}: Props) {
  const [valueRange, setValueRange] = useState([20, 40]);
  const [translators, setTranslators] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [translator_services, setTranslator_services] = useState([]);
  const [isVisibleCertificate, setisVisibleCertificate] = useState(false);
  const [pricehour, setPriceHour] = useState([]);
  const [pricemin, setPriceMin] = useState([]);
  const [pricepage, setPricePage] = useState([]);
  const [pricehalft, setPriceHalft] = useState([]);
  const [pricefull, setPriceFull] = useState([]);
  const [price_s_min, setS_min] = useState([]);
  const [price_v_min, setV_min] = useState([]);

  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [data, setData] = useState<any>({});
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const { t, i18n } = useTranslation();

  const ExampleCustomInput = (props) => <Form.Control {...props} />;
  const ExampleCustomInputTime = (props) => (
    <TextFilterBox onClick={props.onClick}>{props.value ? props.value : t('translators-list.time-from')}</TextFilterBox>
  );

  const ExampleCustomInputTimeTwo = (props) => (
    <TextFilterBoxEnd onClick={props.onClick} >{props.value ? props.value : t('translators-list.time-to')}</TextFilterBoxEnd>
  );

  const [min, setMin] = useState(0);
  const [max, setMax] = useState(120);
  const [value, setValue] = useState([0, 120]);

  const [minHour, setMinHour] = useState(40);
  const [maxHour, setMaxHour] = useState(500);
  const [valueHour, setValueHour] = useState([40, 500]);

  const [minMinute, setMinMinute] = useState(1);
  const [maxMinute, setMaxMinute] = useState(10);
  const [valueMinute, setValueMinute] = useState([1, 10]);

  const [minHalfday, setMinHalfday] = useState(1);
  const [maxHalfday, setMaxHalfday] = useState(1000);
  const [valueHalfday, setValueHalftday] = useState([1, 1000]);

  const [minFullday, setMinFullday] = useState(1);
  const [maxFullday, setMaxFullday] = useState(1000);
  const [valueFullday, setValueFullday] = useState([1, 1000]);

  const [minRatepage, setMinRatepage] = useState(1);
  const [maxRatepage, setMaxRatepage] = useState(100);
  const [valueRatepage, setValueRatepage] = useState([1, 100]);

  const [minSratemin, setMinSratemin] = useState(1);
  const [maxSratemin, setMaxSratemax] = useState(100);
  const [valueSratemin, setValueSratemin] = useState([1, 100]);

  const [minVratemin, setMinVratemin] = useState(1);
  const [maxVratemin, setMaxVratemax] = useState(100);
  const [valueVratemin, setValueVratemin] = useState([1, 100]);

  const [rate, setRate] = useState(0);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [randomized, setRandomized] = useState<any>(null)

  const [simultaneous,setSimultaneous] = useState("")
  const [consecutive,setConsecutive] = useState("")
  const [sworn,setSworn] = useState("")
  const [notsworn,setNotsworn] = useState("")

  
  /* const [lang, setLang] = useState([]); */


  const onSliderChange = (value) => {
    setValue(value);
  };

  const onSliderChangeMinute = (value) => {
    setValueMinute(value);
  };

  const onSliderChangeHour = (value) => {
    setValueHour(value);
  };
  const onSliderChangeHalfday = (value) => {
    setValueHalftday(value);
  };
  const onSliderChangeFullday = (value) => {
    setValueFullday(value);
  };
  const onSliderChangeRatepage = (value) => {
    setValueRatepage(value);
  };
  const onSliderChangeSratemin = (value) => {
    setValueSratemin(value);
  };
  const onSliderChangeVratemin = (value) => {
    setValueVratemin(value);
  };

  const getLanguages = () => {
    LanguagesAPI.getLanguages().then((res) => {
      //console.log(res)
      setLanguages(res)
    })
  };

  const getSpecialities = () => {
    SpecialitiesAPI.getSpecialities(i18n.language).then((res) => {
      //console.log(res)
      setSpecialities(res)
    })
  }

  const getServices = () => {
    ServicesAPI.getServices().then((res) => {

      setTranslator_services(res)
      console.log(res)
    })
  }

  const getRandomized = () => {
    let sort = [
      'firstname',
      'lastname',
      'email',
      'rate_minute',
      'rate_hour',
      'created_at'
    ]
    let randomSort = Math.floor(Math.random() * sort.length);

    let order = [
      'asc',
      'desc',
    ]
    let randomOrder = Math.floor(Math.random() * order.length);

    setRandomized({ sort_by: sort[randomSort], order_by: order[randomOrder] })
    return ({ sort_by: sort[randomSort], order_by: order[randomOrder] })
  }

  const getTranslators = (lang = []) => {

    let randomizedData
    if (randomized) {
      randomizedData = randomized
    } else {
      randomizedData = getRandomized()
    }

    let settings = {
      grade: rate,
      min_price_minute: valueMinute[0],
      max_price_minute: valueMinute[1],
      min_experience: value[0],
      max_experience: value[1],
      min_price_hour: valueHour[0],
      max_price_hour: valueHour[1],
      page: page,
      ...randomizedData
    }

    if (formik.values.service == "5") {
      let min_Halfday = (valueHalfday[0])
      let max_Halfday = (valueHalfday[1])
      let min_Fullday = (valueFullday[0])
      let max_Fullday = (valueFullday[1])
      settings = { ...settings, ...{ min_halfday: min_Halfday, max_halfday: max_Halfday, min_fullday: min_Fullday, max_fullday: max_Fullday} }
    }
    if (formik.values.service == "6") {
      let min_Ratepage = (valueRatepage[0])
      let max_Ratepage = (valueRatepage[1])
      settings = { ...settings, ...{ min_price_page: min_Ratepage, max_price_page: max_Ratepage } }
    }
    if (formik.values.service == "7") {
      let min_Sratemin = (valueSratemin[0])
      let max_Sratemin = (valueSratemin[1])
      settings = { ...settings, ...{ min_s_rate_min: min_Sratemin, max_s_rate_min: max_Sratemin } }
    }
    if (formik.values.service == "8") {
      let min_Vratemin = (valueVratemin[0])
      let max_Vratemin = (valueVratemin[1])
      settings = { ...settings, ...{ min_v_rate_min: min_Vratemin, max_v_rate_min: max_Vratemin } }
    }


    if (startTime && endTime) {
      let startDateTime = combineDateWithTime(startDate, startTime)
      let endDateTime = combineDateWithTime(startDate, endTime)
      settings = { ...settings, ...{ min_available_time: startDateTime, max_available_time: endDateTime } }
    }

    if (formik.values.name) {
      settings = { ...settings, ...{ name: formik.values.name?.toLowerCase() } }
    }

    /* if(lang!=[]){
      settings = { ...settings, ...{languages: JSON.stringify(lang)}}
    } */
    if (formik.values.sworn){
      settings = { ...settings, ...{ sworn:formik.values.sworn } }
    }
    if(formik.values.notsworn){
      settings = { ...settings, ...{ notsworn:formik.values.notsworn } }
    }
    if(formik.values.simultaneous){
      settings = { ...settings, ...{ notsworn:formik.values.simultaneous } }
    }
    if(formik.values.consecutive){
      settings = { ...settings, ...{ notsworn:formik.values.consecutive } }
    }

    if (formik.values.languageFrom && formik.values.languageTo) {

      settings = {
        ...settings,
        ...{
          languages:
            JSON.stringify(
              [{
                from: formik.values.languageFrom,
                to: formik.values.languageTo
              }]
            )
        }
      }
    }
    
    if (formik.values.speciality) {
      settings = {
        ...settings,
        ...{ speciality_id: JSON.stringify([parseInt(formik.values.speciality)]) }
      }
    }
    UsersAPI.getTranslators(settings, localStorage.getItem("token")).then((res) => {
      setTranslators(res.users);
      setData(res);
      console.log(res)
      setPageCount(res.pages)
    }).catch((err) => {
      //console.log(err)
    })
  };


  useEffect(() => {
    getLanguages();
    getSpecialities();
    getServices();
    responsiveFilter();
  }, []);


  const responsiveFilter = () => {
    //console.log(getWindowDimensions())
    if (getWindowDimensions() > 768) {
      setOpenFilter(true)
    }
  }
  const chekedSimultaneous = (e) => {
    
      e.target.checked ?
      formik.setFieldValue("simultaneous","true")
      :formik.setFieldValue("simultaneous","")  
  }
  const chekedConsecutive = (e) => {
   
    e.target.checked ?
    formik.setFieldValue("consecutive","true")
    :formik.setFieldValue("consecutive","") 
}
const chekedSworn = (e) => {

  e.target.checked ?
  formik.setFieldValue("sworn","true")
  :formik.setFieldValue("sworn","")  
  console.log("sworn formik",formik.values.sworn)
}   
const chekedNotsworn = (e) => {

  e.target.checked == true ?
  formik.setFieldValue("notsworn","true")
  :formik.setFieldValue("notsworn","")
  console.log("notsworn formik",formik.values.notsworn)
  
  
}

  
  

  const formik = useFormik({
    initialValues: {
      languageFrom: "",
      languageTo: "",
      speciality: "",
      service: "",
      name: "",
      sworn: "",
      notsworn:"",
      simultaneous: "",
      consecutive: "",

    },
    onSubmit: values => {
      //console.log("values")
    },
    //validationSchema: validationSchema,
    validateOnBlur: true,
    enableReinitialize: true

  });


  useEffect(() => {
    getTranslators();
  }, [
    formik.values.languageFrom,
    formik.values.languageTo,
    formik.values.speciality,
    formik.values.service,
    formik.values.name,
    startTime,
    endTime,
    startDate,
    rate,
    page,
    formik.values.sworn,
    formik.values.notsworn,
    formik.values.simultaneous,
    formik.values.consecutive
  ]); 

  const switchLanguages = () => {
    let languages = [formik.values.languageFrom, formik.values.languageTo]
    //console.log(languages)
    formik.setFieldValue("languageFrom", languages[1])
    formik.setFieldValue("languageTo", languages[0])
  }

  const handlePageClick = data => {
    //console.log(data)
    let selected = data.selected;
    setPage(selected + 1)
  };


  /* useEffect(() => {
    getTranslators();
  }, [rate]); */

  const history = useHistory();
  

  return (
    <>
      <Header></Header>
      <Container className="themed-container translators-container">
        <RowRecover className="layout-content">
          <Col className="col-md-12">
            <Title> {t('translators-list.translators')}</Title>
            <PasswordRecover>
              <Row className="margin-5 translator-profile-row">
                <Col className="col-md-3">

                  <div className="card">
                    <div className="card-header titleFilter"
                      onClick={() => setOpenFilter(!openFilter)}>
                      {t('translators-list.filter-by')}
                      <span className="filter-label-arrow">
                        {openFilter ? "\u25B2" : "\u25BC"}
                      </span>
                    </div>
                    <Collapse in={openFilter}>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                          <Form.Group>
                            <Form.Control
                              as="select"
                              id="translator services"
                              name="service"
                              className="form-control input-lg"
                              onChange={e => {
                                formik.handleChange(e);
                              }}
                              value={formik.values.service}>
                              <option value="">{t('translators-list.service_type')}</option>
                              {translator_services.map((elm: any) => (
                                <option key={elm.id} value={elm.id} > {i18n.language == "ES" ? elm.name_es : elm.name_en}  {}

                                </option>
                              ))}

                            </Form.Control>
                          </Form.Group>
                        </li>
                        <li className="list-group-item">
                          <div className="label-filter">{t('translators-list.reviews')}</div>
                          <Rating
                            emptySymbol="fa fa-star-o fa-2x fa-start"
                            fullSymbol="fa fa-star fa-2x fa-start"
                            className="startcontainer"
                            onClick={(rating: any) => rate == rating ? setRate(0) : setRate(rating)}
                            initialRating={rate}
                          />
                        </li>
                        <li className="list-group-item">
                          <div className="label-filter">{t('translators-list.experience')}</div>
                          <div className="slidecontainer">
                            <Range
                              value={value}
                              min={min}
                              max={max}
                              onChange={onSliderChange}
                              step={6}
                              onAfterChange={() => getTranslators()}
                            />
                          </div>
                          <LabelFilter>
                            <Col>
                              <TextFilter>{value[0]} {t('translators-list.months')}</TextFilter>
                            </Col>
                            <ColFilter>
                              <TextFilter>{value[1]} {t('translators-list.months')}</TextFilter>
                            </ColFilter>
                          </LabelFilter>
                        </li>
                        {formik.values.service && (formik.values.service == "5")
                          ?
                          <li className="list-group-item"> 
                          <div className="label-filter">{t('translators-list.service_type')}</div>
                          <Form.Group>
                          <label>
                          <input
                            type="checkbox"
                            onChange={chekedSimultaneous}
                           
                          />
                          &nbsp;&nbsp;{t('translator-profile.simultaneous')}</label>
                          <br/>
                          <label>
                          <input
                            type="checkbox"
                            onChange={chekedConsecutive}
                           
                          />
                          &nbsp;&nbsp;{t('translator-profile.consecutive')}</label>
                          </Form.Group>
                          
                       
                            <Form.Group>
                              <Form.Label className="label-filter">
                                {t('translators-list.availability')}
                              </Form.Label>
                              <DatePicker
                                selected={startDate}
                                onChange={(date: any) => setStartDate(date)}
                                minDate={new Date()}
                                customInput={
                                  <ExampleCustomInput></ExampleCustomInput>
                                }
                                dateFormat="dd/MM/yyyy"
                              />
                            </Form.Group>
                            <LabelFilter className="home-date">

                              <DatePicker
                                selected={startTime}
                                onChange={(date: any) => setStartTime(date)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={30}
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                                customInput={
                                  <ExampleCustomInputTime></ExampleCustomInputTime>
                                }
                              />
                              <div className="separator">
                                <i className="fa fa-clock-o" aria-hidden="true"></i>
                              </div>


                              <DatePicker
                                selected={endTime}
                                onChange={(date: any) => setEndTime(date)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeIntervals={30}
                                timeCaption="Time"
                                dateFormat="h:mm aa"
                                customInput={
                                  <ExampleCustomInputTimeTwo></ExampleCustomInputTimeTwo>
                                }
                              />
                            </LabelFilter>
                          </li>
                          : null}
                        {formik.values.service && (formik.values.service == "5")
                          ? <li className="list-group-item">
                            
                            <div className="label-filter">{t('translators-list.rate-hour')}</div>
                            <br></br>
                            {/* <TextFilter
                    onClick={() => {
                      setValueHour([1, 25]);
                    }}
                  >
                    Hasta $25
                  </TextFilter>
                  <TextFilter
                    onClick={() => {
                      setValueHour([25, 50]);
                    }}
                  >
                    $25 - $50
                  </TextFilter>
                  <TextFilter
                    onClick={() => {
                      setValueHour([50, 100]);
                    }}
                  >
                    $50 - $100
                  </TextFilter> */}
                            <div className="slidecontainer">
                              <Range
                                value={valueHour}
                                min={minHour}
                                max={maxHour}
                                onChange={onSliderChangeHour}
                                onAfterChange={() => getTranslators()}
                              />
                            </div>
                            <LabelFilter>
                              <Col>
                                <TextFilter>${valueHour[0]}</TextFilter>
                              </Col>
                              <ColFilter>
                                <TextFilter>${valueHour[1]}</TextFilter>
                              </ColFilter>
                            </LabelFilter>
                          </li>
                          : null}
                        {formik.values.service && (formik.values.service == "5")
                          ? <li className="list-group-item">
                            <div className="label-filter">{t('translators-list.rate-minute')}</div>
                            <br></br>

                            <div className="slidecontainer">
                              <Range
                                value={valueMinute}
                                min={minMinute}
                                max={maxMinute}
                                step={0.5}
                                onChange={onSliderChangeMinute}
                                onAfterChange={() => getTranslators()}
                              />
                            </div>
                            <LabelFilter>
                              <Col>
                                <TextFilter>${valueMinute[0]}</TextFilter>
                              </Col>
                              <ColFilter>
                                <TextFilter>${valueMinute[1]}</TextFilter>
                              </ColFilter>
                            </LabelFilter>
                          </li>
                          : null}
                        {formik.values.service && (formik.values.service == "5")
                          ? <li className="list-group-item">
                            <div className="label-filter">{t('translators-list.half_day')}</div>
                            <br></br>

                            <div className="slidecontainer">
                              <Range
                                value={valueHalfday}
                                min={minHalfday}
                                max={maxHalfday}
                                step={0.5}
                                onChange={onSliderChangeHalfday}
                                onAfterChange={() => getTranslators()}
                              />
                            </div>
                            <LabelFilter>
                              <Col>
                                <TextFilter>${valueHalfday[0]}</TextFilter>
                              </Col>
                              <ColFilter>
                                <TextFilter>${valueHalfday[1]}</TextFilter>
                              </ColFilter>
                            </LabelFilter>
                          </li>
                          : null}
                        {formik.values.service && (formik.values.service == "5")
                          ? <li className="list-group-item">
                            <div className="label-filter">{t('translators-list.fullday')}</div>
                            <br></br>

                            <div className="slidecontainer">
                              <Range
                                value={valueFullday}
                                min={minFullday}
                                max={maxFullday}
                                step={0.5}
                                onChange={onSliderChangeFullday}
                                onAfterChange={() => getTranslators()}
                              />
                            </div>
                            <LabelFilter>
                              <Col>
                                <TextFilter>${valueFullday[0]}</TextFilter>
                              </Col>
                              <ColFilter>
                                <TextFilter>${valueFullday[1]}</TextFilter>
                              </ColFilter>
                            </LabelFilter>
                          </li>
                          : null}
                        {formik.values.service && (formik.values.service == "6")
                          ? <li className="list-group-item">
                            <Form.Group>
                            <div className="label-filter">{t('translators-list.service_type')}</div>
                          <label >
                          <input
                            type="checkbox"
                            onClick={chekedSworn}
                          />
                          &nbsp;&nbsp;{t('translator-profile.sworn')}</label>
                          <br/>
                          <label >
                          <input
                            type="checkbox"     
                            onClick={chekedNotsworn}
                          />
                          &nbsp;&nbsp;{t('translator-profile.notsworn')}</label>
                          </Form.Group>
                          <br></br>
                            <div className="label-filter">{t('translator-profile.rate_page')}</div>
                            <br></br>

                            <div className="slidecontainer">
                              <Range
                                value={valueRatepage}
                                min={minRatepage}
                                max={maxRatepage}
                                step={0.5}
                                onChange={onSliderChangeRatepage}
                                onAfterChange={() => getTranslators()}
                              />
                            </div>
                            <LabelFilter>
                              <Col>
                                <TextFilter>${valueRatepage[0]}</TextFilter>
                              </Col>
                              <ColFilter>
                                <TextFilter>${valueRatepage[1]}</TextFilter>
                              </ColFilter>
                            </LabelFilter>
                          </li>
                          : null}
                        {formik.values.service && (formik.values.service == "7")
                          ? <li className="list-group-item">
                            <div className="label-filter">{t('translator-profile.s_rate_min')}</div>
                            <br></br>

                            <div className="slidecontainer">
                              <Range
                                value={valueSratemin}
                                min={minSratemin}
                                max={maxSratemin}
                                step={0.5}
                                onChange={onSliderChangeSratemin}
                                onAfterChange={() => getTranslators()}
                              />
                            </div>
                            <LabelFilter>
                              <Col>
                                <TextFilter>${valueSratemin[0]}</TextFilter>
                              </Col>
                              <ColFilter>
                                <TextFilter>${valueSratemin[1]}</TextFilter>
                              </ColFilter>
                            </LabelFilter>
                          </li>
                          : null}
                        {formik.values.service && (formik.values.service == "8")
                          ? <li className="list-group-item">
                            <div className="label-filter">{t('translator-profile.v_rate_min')}</div>
                            <br></br>

                            <div className="slidecontainer">
                              <Range
                                value={valueVratemin}
                                min={minVratemin}
                                max={maxVratemin}
                                step={0.5}
                                onChange={onSliderChangeVratemin}
                                onAfterChange={() => getTranslators()}
                              />
                            </div>
                            <LabelFilter>
                              <Col>
                                <TextFilter>${valueVratemin[0]}</TextFilter>
                              </Col>
                              <ColFilter>
                                <TextFilter>${valueVratemin[1]}</TextFilter>
                              </ColFilter>
                            </LabelFilter>
                          </li>
                          : null}
                      </ul>
                    </Collapse>
                  </div>
                </Col>
                <Col className="col-md-9">
                  <WellContainer>
                    <Container className="themed-container translators-list" fluid={true}>
                      <Row>
                        <Col>
                          <Form.Group>
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
                              {specialities?.map((elm: any) => (
                                <option key={elm.id} value={elm.id} > {i18n.language == "ES" ? elm.name_es : elm.name_en}  {}</option>
                              ))}
                            </Form.Control>
                          </Form.Group>
                        </Col>
                        <Col>
                          <div className="filter-language">
                            <div>
                              <Form.Control
                                as="select"
                                id="languageFrom"
                                name="languageFrom"
                                className="form-control input-lg"
                                onChange={e => {
                                  formik.handleChange(e);
                                }}
                                value={formik.values.languageFrom} >
                                <option value="">{t('select')}</option>
                                {languages?.map((elm: any) => (
                                  <option key={elm.id} value={elm.id} >{i18n.language == "ES" ? elm.name_es : elm.name_en}</option>
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
                                id="languageTo"
                                name="languageTo"
                                className="form-control input-lg"
                                onChange={e => {
                                  formik.handleChange(e);
                                }}
                                value={formik.values.languageTo} >
                                <option value="0">{t('select')}</option>
                                {languages?.map((elm: any) => (
                                  <option key={elm.id} value={elm.id}>{i18n.language == "ES" ? elm.name_es : elm.name_en}</option>
                                ))}
                              </Form.Control>
                            </div>
                          </div>
                        </Col>
                        <Col>
                          <FormControl
                            placeholder={t('translators-list.search-by-name')}
                            id="name"
                            type="text"
                            value={formik.values.name}
                            onChange={(e) => {
                              formik.handleChange(e)
                            }}
                          />
                        </Col>
                      </Row>
                    </Container>
                    <div className="table-responsive">
                      <table className="table table-translators">
                        <tbody>
                          {translators?.map((ele: any) => (
                            <tr>
                              <td>
                                <div className="userIconTra">
                                  <div>
                                    <img
                                      src={ele?.image_url ? ele.image_url : "/assets/images/no_avatar_default.png"}
                                      className="image-icon ico-user"
                                    />
                                  </div>
                                  <div className="star-container">
                                    <p className="name">
                                      {ele.firstname}&nbsp;{ele.lastname}
                                      <br></br>
                                      {/* { formik.values.service && (formik.values.service == "1") ? */}
                                      <>
                                        
                                        <span onClick={() => {
                                          setisVisibleCertificate(true);
                                          setPriceHour(ele.rate_hour)
                                          setPriceMin(ele.rate_minute)
                                          setPriceHalft(ele.half_day)
                                          setPriceFull(ele.full_day)
                                          setPricePage(ele.rate_page)
                                          setS_min(ele.s_rate_min)
                                          setV_min(ele.v_rate_min)
                                        
                                    
                                        }}className="see-cer badge badge-light">
                                          {t('translator-profile.prices')}
                                          
                                        </span>
                                    
                                        <Modal
                                        
                                        show={isVisibleCertificate} 
                                        onHide={() => {
                                          setisVisibleCertificate(false);
                                        }}
                                        autoFocus
                                        keyboard
                                        size="lg"
                                      >
                                        <Modal.Header closeButton>
                                          <Modal.Title>{t('translator-profile.prices')}</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body  className="mx-auto">
                                        
                                        <p className="rate-home"><strong>${pricehour}/{t('translator_profile.rate-hr')}</strong></p>
                                        <p className="rate-home"><strong>${pricemin}/{t('translator_profile.rate-min')}</strong></p>
                                        {pricehalft != null ?
                                        pricehalft.length != 0 ?
                                        <p className="rate-home"><strong>${pricehalft}/{t('translator-profile.half_day')}</strong></p>
                                        :null
                                        :null
                                        }
                                        {pricefull != null ?
                                        pricefull.length != 0 ?
                                        <p className="rate-home"><strong>${pricefull}/{t('translator-profile.full_day')}</strong></p>
                                        :null
                                        :null
                                        }
                                        {pricepage !== null  ?
                                        pricepage.length != 0 ?
                                        <p className="rate-home"><strong>${pricepage}/{t('translator-profile.rate_page')}</strong></p>
                                        :null
                                        :null
                                        }
                                        {price_s_min != null ?
                                        price_s_min.length != 0 ?
                                        <p className="rate-home"><strong>${price_s_min}/{t('translator_profile.rate_s_min')}</strong></p>
                                        :null
                                        :null
                                        }
                                        {  price_v_min != null ? 
                                          price_v_min.length != 0 ?
                                          <p className="rate-home"><strong>${price_v_min}/{t('translator_profile.rate_v_min')}</strong></p>
                                          : null
                                        :null
                                        }
                                        </Modal.Body>
                                      </Modal>
                                      </>
                                      
                                      {/* :null
                                      } */}
                                      
                                      { formik.values.service && (formik.values.service == "6") ?
                                      <p className="rate-home"><strong>${ele.rate_page} {t('translator-profile.rate_page')}</strong></p>
                                      : null}
                                      { formik.values.service && (formik.values.service == "7") ?
                                      <p className="rate-home"><strong>${ele.s_rate_min}/{t('translator_profile.rate-min')}</strong></p>
                                      : null}
                                      { formik.values.service && (formik.values.service == "8 ") ?
                                      <p className="rate-home"><strong>${ele.v_rate_min}/{t('translator_profile.rate-min')}</strong></p>
                                      : null}
                                      <div>
                                        <Rating
                                          emptySymbol="fa fa-star-o fa-2x fa-start"
                                          fullSymbol="fa fa-star fa-2x fa-start"
                                          className="startcontainer"
                                          readonly={true}
                                          start={0}
                                          stop={10}
                                          step={2}
                                          fractions={2}
                                          initialRating={Math.round(ele.rating * 2)}
                                        />
                                      </div>
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <p>{t('translators-list.specialist-in')}</p>
                                {ele.specialities?.map((sp: any) => (
                                  <span className="badge badge-light">
                                    {i18n.language == "ES" ? sp.name_es : sp.name_en}
                                  </span>
                                ))}
                              </td>
                              <td>
                                <p>{t('translators-list.language')}</p>
                                {ele.languages?.map((lng: any) => (
                                  <>
                                    <span className="badge badge-light">
                                      {t('translators-list.from')} {i18n.language == "ES" ? lng.from.name_es : lng.from.name_en} {t('translators-list.to')} {i18n.language == "ES" ? lng.to.name_es : lng.to.name_en}
                                    </span>
                                  </>
                                ))}
                              </td>
                              <td>
                                <ResendLink to={`profile-translator/${ele.id}`}>
                                  {t('translators-list.see-profile')}
                                </ResendLink>
                              </td>
                              <td className="mobile-item">
                                <p>{t('translators-list.specialist-in')}</p>
                                {ele.specialities?.map((sp: any) => (
                                  <span className="badge badge-light">
                                    {i18n.language == "ES" ? sp.name_es : sp.name_en}
                                  </span>
                                ))}<br />
                                <p>{t('translators-list.language')}</p>
                                {ele.languages?.map((lng: any) => (
                                  <>
                                    <span className="badge badge-light">
                                      {t('translators-list.from')} {i18n.language == "ES" ? lng.from.name_es : lng.from.name_en} {t('translators-list.to')} {i18n.language == "ES" ? lng.to.name_es : lng.to.name_en}
                                    </span>
                                  </>
                                ))}<br />
                                <ResendLink to={`profile-translator/${ele.id}`}>
                                  {t('translators-list.see-profile')}
                                </ResendLink>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="pagination-container">
                      <ReactPaginate
                        previousLabel={t('paginate-back')}
                        nextLabel={t('paginate-next')}
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={5}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'}
                      />
                    </div>

                  </WellContainer>
                </Col>
              </Row>
            </PasswordRecover>
          </Col>
        </RowRecover>
      </Container>
    </>
  );
}

const mapStateToProps = (state: any) => {
  return {
    counter: state.counter.counter,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    reduxIncreaseCounter: () =>
      dispatch({
        type: "INCREASE_COUNTER",
        value: 1,
      }),
    reduxDecreaseCounter: () =>
      dispatch({
        type: "DECREASE_COUNTER",
        value: 1,
      }),
  };
};

TranslatorsPage.propTypes = {
  counter: PropTypes.number.isRequired,
  reduxIncreaseCounter: PropTypes.func.isRequired,
  reduxDecreaseCounter: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(TranslatorsPage);

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
import { FormGroup } from "react-bootstrap";
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
import moment from 'moment';

import { combineDateWithTime, getWindowDimensions } from "../../utils/constants"
import ReactPaginate from 'react-paginate';

import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';

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
  const [maxHour, setMaxHour] = useState(100);
  const [valueHour, setValueHour] = useState([40, 500]);

  const [minMinute, setMinMinute] = useState(1);
  const [maxMinute, setMaxMinute] = useState(10);
  const [valueMinute, setValueMinute] = useState([1, 10]);
  const [rate, setRate] = useState(0);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [randomized, setRandomized] = useState<any>(null)

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

  const getLanguages = () => {
    LanguagesAPI.getLanguages().then((res) => {
      console.log(res)
      setLanguages(res)
    })
  };

  const getSpecialities = () => {
    SpecialitiesAPI.getSpecialities(i18n.language).then((res) => {
      console.log(res)
      setSpecialities(res)
    })
  }

  const getRandomized = () =>{
    let sort =[
      'firstname',
      'lastname',
      'email',
      'rate_minute',
      'rate_hour',
      'created_at'
    ]
    let randomSort = Math.floor(Math.random() * sort.length);

    let order =[
      'asc',
      'desc',
    ]
    let randomOrder = Math.floor(Math.random() * order.length);

    setRandomized({sort_by: sort[randomSort], order_by: order[randomOrder]})
    return({sort_by: sort[randomSort], order_by: order[randomOrder]})
  }

  const getTranslators = (lang = []) => {

    let randomizedData
    if(randomized){
      randomizedData = randomized
    }else{
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
			setPageCount(res.pages)
    }).catch((err) => {
      console.log(err)
    })
  };


  useEffect(() => {
    getLanguages();
    getSpecialities();
    responsiveFilter();
  }, []);


  const responsiveFilter = () =>{
    console.log(getWindowDimensions())
    if (getWindowDimensions()>768){
      setOpenFilter(true)
    }
  }

  const formik = useFormik({
    initialValues: {
      languageFrom: "",
      languageTo: "",
      speciality: "",
      name: ""

    },
    onSubmit: values => {
      console.log("values")
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
    formik.values.name,
    startTime,
    endTime,
    startDate,
    rate,
    page
  ]);

  const switchLanguages = () => {
    let languages = [formik.values.languageFrom, formik.values.languageTo]
    console.log(languages)
    formik.setFieldValue("languageFrom", languages[1])
    formik.setFieldValue("languageTo", languages[0])
  }

  const handlePageClick = data => {
		console.log(data)
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
                        { openFilter ? "\u25B2": "\u25BC"}
                      </span>
                    </div>
                    <Collapse in={openFilter}>
                    <ul className="list-group list-group-flush">
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
                      <li className="list-group-item">
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
                      <li className="list-group-item">
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
                      <li className="list-group-item">
                        <div className="label-filter">{t('translators-list.rate-minute')}</div>
                        <br></br>
                        {/* <TextFilter
                          onClick={() => {
                            setValueMinute([1, 25]);
                          }}
                        >
                          Hasta $25
                        </TextFilter>
                        <TextFilter
                          onClick={() => {
                            setValueMinute([25, 50]);
                          }}
                        >
                          $25 - $50
                        </TextFilter>
                        <TextFilter
                          onClick={() => {
                            setValueMinute([50, 100]);
                          }}
                        >
                          $50 - $100
                        </TextFilter> */}
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
                                <option key={elm.id} value={elm.id} > {i18n.language=="ES" ? elm.name_es : elm.name_en }  {}</option>
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
                                  <option key={elm.id} value={elm.id} >{i18n.language=="ES" ? elm.name_es : elm.name_en}</option>
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
                                  <option key={elm.id} value={elm.id}>{i18n.language=="ES" ? elm.name_es : elm.name_en}</option>
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
                                      {ele.firstname} {ele.lastname}
                                      <div>
                                        <Rating
                                            emptySymbol="fa fa-star-o fa-2x fa-start"
                                            fullSymbol="fa fa-star fa-2x fa-start"
                                            className="startcontainer"
                                            readonly={true}
                                            initialRating={Math.floor(ele.rating)}
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
                                    {i18n.language=="ES" ? sp.name_es : sp.name_en }
                                  </span>
                                ))}
                              </td>
                              <td>
                                <p>{t('translators-list.language')}</p>
                                {ele.languages?.map((lng: any) => (
                                  <>
                                    <span className="badge badge-light">
                                    {t('translators-list.from')} {i18n.language=="ES" ? lng.from.name_es : lng.from.name_en} {t('translators-list.to')} {i18n.language=="ES" ? lng.to.name_es : lng.to.name_en}
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
                                    {i18n.language=="ES" ? sp.name_es : sp.name_en }
                                  </span>
                                ))}<br />
                                <p>{t('translators-list.language')}</p>
                                {ele.languages?.map((lng: any) => (
                                  <>
                                    <span className="badge badge-light">
                                    {t('translators-list.from')} {i18n.language=="ES" ? lng.from.name_es : lng.from.name_en} {t('translators-list.to')} {i18n.language=="ES" ? lng.to.name_es : lng.to.name_en}
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

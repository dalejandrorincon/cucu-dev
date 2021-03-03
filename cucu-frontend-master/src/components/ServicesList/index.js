import React, { useEffect, useState } from "react";
import { Container, Col, Row, Form, Button, Collapse } from "react-bootstrap";
import { Title, WellContainer } from './styles'
import moment from 'moment';
import ReactPaginate from 'react-paginate';
import DatePicker from "react-datepicker";
import { useParams, useHistory } from "react-router-dom";
import { useFormik, useFormikContext } from 'formik';
import "./styles.scss"
import * as ServicesAPI from '../../api/services';
import ServiceModal from "../../components/ServiceModal"
import {itemStatusLabel, getWindowDimensions} from "../../utils/constants"
import { useTranslation } from 'react-i18next';
import { getNotifications } from "../../api/notifications";
export default function TranslatorServices() {

	const [activeService, setActiveService] = useState({});
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [initial, setInitial] = useState(true);

	const [options, setOptions] = useState();
	const [pageCount, setPageCount] = useState(1)

	const [services, setServices] = useState([]);
	const { t, i18n } = useTranslation();
	const { id } = useParams();
    const history = useHistory();
	
	const [openFilter, setOpenFilter] = useState(false);
	
	const formik = useFormik({
		initialValues: {
			service_type: "",
			duration_type: "",
			status: "",
			min_date: "",
			max_date: "",
			sort_by: "",
			sort_order: "",
			name: ""
		},
		onSubmit: values => {
			console.log("values")
		},
		//validationSchema: validationSchema,
		validateOnBlur: true,
		enableReinitialize: true

	});

	const getNotificationService = (serv=null) =>{
		if(id && initial==true){
			let currentService;
			if(serv==null){
				serv = services
			}
			serv.forEach((service)=>{
				if (parseInt(service.id) == id){
					currentService = service
				}
			})
			if(currentService){
				setActiveService(currentService)
				setIsModalVisible(true)
			}
			setInitial(false)
		}
	}

	const getUserType = () =>{
		let role=""
		switch (localStorage.getItem("role")) {
			case "1":
				role = "admin"
				break;
			case "2":
				role = "translator"
				break;
			default:
				role = "client"
		}
		return role
	}

	useEffect(() => {
		let userType = getUserType()
		getServices(userType)
	}, [
		options,
	]);

	useEffect(() => {
		responsiveFilter();
	}, []);

	history.listen((location, action) => {
		setInitial(true)
		getNotificationService()
	})


	const getServices = (type) => {
		if(options){
			options.name = options?.name?.toLowerCase()
		}
		ServicesAPI.getServices(type, localStorage.getItem("token"), options).then((res) => {
			console.log(res.results)
			setServices(res.results)
			setPageCount(res.pages)
			getNotificationService(res.results)
		})
	};

	const handlePageClick = data => {
		console.log(data)
		let selected = data.selected;
		setOptions({ ...options, page: selected + 1 });
	};


	const handleInputChange = (e) => {
		let name = e.target.name
		let val = e.target.value
		setOptions({
			...options,
			...{ [name]: val }
		})

	}

	const handleDateChange = (e, type) =>{
		let name = type
		let val = e
		setOptions({
			...options,
			...{ [name]: val }
		})
	}

	const responsiveFilter = () =>{
		console.log(getWindowDimensions())
		if (getWindowDimensions()>767){
		  setOpenFilter(true)
		}
	}


	return (
		<>
			<Container className="themed-container" className="services-list">
				<Col className="col-md-12">
					<Title>{t('request-list.my-requests')}</Title>
					<WellContainer>
							<div className="card-header titleFilter filter-controls"
								onClick={() => setOpenFilter(!openFilter)}>
								{t('translators-list.filter-by')}
								<span className="filter-label-arrow">
									{ openFilter ? "\u25B2": "\u25BC"}
								</span>
							</div>
							<Collapse in={openFilter}>
							<div>									
							<Row className="filters">								
								<Col>
									<Form.Group>
										<Form.Control
											as="select"
											id="service_type"
											name="service_type"
											className="form-control input-lg"
											onChange={e => {
												formik.handleChange(e);
												handleInputChange(e)
											}}
											value={formik.values.service_type}>
											<option value="">{t('request-list.any-type')}</option>
											{/* <option value="0">{t('request-list.instant')}</option> */}
											<option value="1">{t('request-list.programmed')}</option>
										</Form.Control>
									</Form.Group>
								</Col>

								<Col>
									<Form.Group>
										<Form.Control
											as="select"
											id="status"
											name="status"
											className="form-control input-lg"
											onChange={e => {
												formik.handleChange(e);
												handleInputChange(e)
											}}
											value={formik.values.status}>
											<option value="">{t('any-status')}</option>
											<option value="0">{t('status-0')}</option>
											<option value="1">{ getUserType()=="client" ? t('status-1-client') : t('status-1') }</option>
											<option value="2">{t('status-2')}</option>
											<option value="3">{t('status-3')}</option>
											<option value="4">{t('status-4')}</option>
											<option value="5">{t('status-5')}</option>
										</Form.Control>
									</Form.Group>
								</Col>

								<Col>
									<Form.Group>
										<Form.Control
											as="select"
											id="sort_by"
											name="sort_by"
											className="form-control input-lg"
											onChange={e => {
												formik.handleChange(e);
												handleInputChange(e)
											}}
											value={formik.values.sort_by}>
											<option value="date">{t('most-recent')}</option>
											<option value="date_asc">{t('least-recent')}</option>
											<option value="duration_amount">{t('length')}</option>
											<option value="amount">{t('rate-price')}</option>
										</Form.Control>
									</Form.Group>
								</Col>

								<Col>
									<Form.Group>
										<Form.Control
											as="select"
											id="duration_type"
											name="duration_type"
											className="form-control input-lg"
											onChange={e => {
												formik.handleChange(e);
												handleInputChange(e)
											}}
											value={formik.values.duration_type}>
											<option value="">{t('all-durations')}</option>
											<option value="0">{t('hours')}</option>
											<option value="1">{t('minutes')}</option>
										</Form.Control>
									</Form.Group>
								</Col>

								<Col>
									<DatePicker
										className="form-control"
										closeOnScroll={true}
										id="min_date"
										name="min_date"
										selected={formik.values.min_date}
										onChange={e => {
											formik.setFieldValue("min_date", e)
											handleDateChange(e, "min_date")
										}}
										dateFormat="dd/MM/yyyy"
										placeholderText={t('time-from')}
									/>
								</Col>

								<Col>
									<DatePicker
										className="form-control"
										closeOnScroll={true}
										id="max_date"
										name="max_date"
										selected={formik.values.max_date}
										onChange={e => {
											formik.setFieldValue("max_date", e)
											handleDateChange(e, "max_date")
											
										}}
										dateFormat="dd/MM/yyyy"
										placeholderText={t('time-to')}
									/>
								</Col>

								<Col>
									<Form.Group>
										<Form.Control
											placeholder={ getUserType()=="translator" ? t('request-list.search-by-client') : t('request-list.search-by-translator') }
											id="name"
											name="name"
											type="text"
											value={formik.values.name}
											onChange={(e) => {
												handleInputChange(e)
												formik.handleChange(e)
											}}
										/>
									</Form.Group>
								</Col>
							</Row>
							</div>
							</Collapse>
						<div className="table-responsive">
							<table className="table ">
								<thead className="thead-light table-services">
									<tr>
										<th scope="col">
											{ getUserType()=="translator" ? <>{t('client')}</> : <>{t('translator')}</>}
										</th>
										<th scope="col">{t('request-list.request-type')}</th>
										<th scope="col">{t('request-list.duration')}</th>
										<th scope="col">{t('request-list.charges')}</th>
										<th scope="col">{t('request-list.date-time')}</th>
										<th scope="col">{t('request-list.status')}</th>
										<th scope="col"></th>
										<th scope="col" className="mobile-item"></th>
									</tr>
								</thead>
								<tbody className="table-services">
									{services?.map((ele) => (
										<tr key={ele.id}>
											<td className="user-container">
												<div className="userIcon">
													<div>
													{ getUserType()=="translator" ? 
														<img														
															src={ele.client?.image_url ? ele.client.image_url : "/assets/images/no_avatar_default.png"}
															className="image-icon ico-user"
														/>
														:
														<img
														
															src={ele.translator?.image_url ? ele.translator.image_url : "/assets/images/no_avatar_default.png"}
															className="image-icon ico-user"
														/>
													}
													</div>
													<div>
														<p className="name">
															<b>
											                { getUserType()=="translator" ? 
															ele.client?.firstname+ " "+
															ele.client?.lastname 
															: 
															ele.translator?.firstname+" "+
															ele.translator?.lastname
															
															}
															</b>
															<div className="price">
																${Math.round(ele.amount * 100) / 100}
															</div>
														</p>
													</div>
												</div>
											</td>
											<td>{ele.service_type === "0" ? t('instant') : t('programmed')} </td>
											<td>{ele.duration_amount}</td>
											<td>{ele.duration_type === "0" ?  t('hour') :  t('minute')}{ele.duration_amount > 1 ? "s" : null}</td>
											<td>{moment(ele.date).format("D MMM  YYYY - hh:mm a")}</td>
											<td>
												{itemStatusLabel(ele.status)}
											</td>
											<td>
												<Button
													className="view-mas"
													to="#"
													onClick={() => {
														setActiveService(ele)
														setIsModalVisible(true)
													}}
												>
													<span>{t('view')}</span>
												</Button>
											</td>
											<td className="mobile-item">
												<p><b>{t('request-list.request-type')}:</b> {ele.service_type === "0" ? t('instant') : t('programmed')} </p>
												<p><b>{t('request-list.duration')}:</b> {ele.duration_amount}</p>
												<p><b>{t('request-list.charges')}:</b> {ele.duration_type === "0" ?  t('hour') :  t('minute')}{ele.duration_amount > 1 ? "s" : null}</p>
												<p><b>{t('request-list.date-time')}:</b> {moment(ele.date).format("D MMM  YYYY - hh:mm a")}</p>
												<p><b>{t('request-list.status')}:</b> {itemStatusLabel(ele.status)}</p>
												<Button
													className="view-mas"
													to="#"
													onClick={() => {
														setActiveService(ele)
														setIsModalVisible(true)
													}}
												>
													<span>{t('view')}</span>
												</Button>
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
								pageRangeDisplayed={1}
								containerClassName={'pagination'}
								subContainerClassName={'pages pagination'}
								activeClassName={'active'}
							/>
						</div>

					</WellContainer>
				</Col>
			</Container>

			<ServiceModal 
				updateServices={()=>{
					setIsModalVisible(false)
					getServices(getUserType())
				}}
				updateServicesPersist={()=>{
					getServices(getUserType())
				}}
				service={activeService} 
				onHide={() => setIsModalVisible(false)}
				show={isModalVisible}
			></ServiceModal>

		</>
	);
}


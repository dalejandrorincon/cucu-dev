import React, { useEffect, useState } from "react";
import { Container, Col, Row, Form, Collapse } from "react-bootstrap";
import { Title, WellContainer } from './styles'
import moment from 'moment';
import ReactPaginate from 'react-paginate';
import DatePicker from "react-datepicker";
import { useFormik } from 'formik';
import "./styles.scss"
import * as TransactionsAPI from '../../api/transactions';
import { useTranslation } from 'react-i18next';
import {getWindowDimensions} from "../../utils/constants"

export default function TransactionsList() {

	const [options, setOptions] = useState();
	const [pageCount, setPageCount] = useState(1)
	const [openFilter, setOpenFilter] = useState(false);

	const [transactions, setTransactions] = useState([]);
	const { t, i18n } = useTranslation();
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


	useEffect(() => {
		getTransactions()
	}, [
		options,
	]);


	const getTransactions = (type) => {
		if(options){
			options.name = options?.name?.toLowerCase()
		}
		TransactionsAPI.userTransactions(localStorage.getItem("token"), options).then((res) => {
			console.log(res.results)
			setTransactions(res.results)
			setPageCount(res.pages)
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

	useEffect(() => {
		responsiveFilter();
	}, []);

	const responsiveFilter = () =>{
		console.log(getWindowDimensions())
		if (getWindowDimensions()>767){
		  setOpenFilter(true)
		}
	}


	return (
		<>
			<Container className="themed-container" className="transactions-list">
				<Col className="col-md-12">
					<Title>{t('transactions-list.transactions-history')}</Title>
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
											<option value="">{t('transactions-list.any-type')}</option>
											{/* <option value="0">{t('transactions-list.instant')}</option> */}
											<option value="1">{t('transactions-list.programmed')}</option>
										</Form.Control>
									</Form.Group>
								</Col>

								{/* <Col>
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
											<option value="">Todos los estados</option>
											<option value="0">Solicitado</option>
											<option value="1">Aceptado</option>
											<option value="2">Pagado</option>
											<option value="3">Finalizado</option>
											<option value="4">Reprogramado</option>
											<option value="5">Cancelado</option>
										</Form.Control>
									</Form.Group>
								</Col> */}

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
											<option value="transactions.created_at">{t('most-recent')}</option>
											<option value="transactions.created_at_asc">{t('least-recent')}</option>
											{/* <option value="date">Fecha</option> */}
											<option value="service.duration_amount">{t('length')}</option>
											<option value="service.duration_type">{t('rate-type')}</option>
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
											placeholder={t('transactions-list.search-by-client')}
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
											{t('transactions-list.client')}
										</th>
										<th scope="col">{t('transactions-list.request-type')}</th>
										<th scope="col">{t('transactions-list.duration')}</th>
										<th scope="col">{t('transactions-list.charges')}</th>
										<th scope="col">{t('transactions-list.date-time')}</th>
										{/* <th scope="col">Estado</th>
										<th scope="col"></th> */}
										<th scope="col" className="mobile-item"></th>
									</tr>
								</thead>
								<tbody className="table-services">
									{transactions?.map((ele) => (
										<tr key={ele.id}>
											<td className="user-container">
												<div className="userIcon">
													<div>
														<img														
															src={ele.client?.image_url ? ele.client.image_url : "/assets/images/no_avatar_default.png"}
															className="image-icon ico-user"
														/>
													</div>
													<div>
														<p className="name">
															<b>
											                {
                                                                ele.client?.firstname+ " "+
                                                                ele.client?.lastname 
															}
															</b>
															<div className="price">
																${ele.amount}
															</div>
														</p>
													</div>
												</div>
											</td>
											<td>{ele.service?.service_type === "0" ? t('instant') : t('programmed') }</td>
											<td>{ele.service?.duration_amount}</td>
											<td>{ele.service?.duration_type === "0" ?t('hour') :  t('minute')}{ele.duration_amount > 1 ? "s" : null}</td>
											<td>{moment(ele.created_at).format("D MMM  YYYY - hh:mm a")}</td>
											<td className="mobile-item">
												<p><b>{t('transactions-list.request-type')}: </b>{ele.service?.service_type === "0" ? t('instant') : t('programmed') }</p>
												<p><b>{t('transactions-list.duration')}: </b>{ele.service?.duration_amount}</p>
												<p><b>{t('transactions-list.charges')}: </b>{ele.service?.duration_type === "0" ?t('hour') :  t('minute')}{ele.duration_amount > 1 ? "s" : null}</p>
												<p><b>{t('transactions-list.date-time')}: </b>{moment(ele.created_at).format("D MMM  YYYY - hh:mm a")}</p>
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
			</Container>
		</>
	);
}


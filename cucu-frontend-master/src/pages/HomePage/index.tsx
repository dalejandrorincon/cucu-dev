/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logout } from "../../utils/session";
import {
  Container,
  Col,
  NavDropdown,
  Modal,
} from "react-bootstrap";

import {
  Title,
  SubmitCancel,
  WellContainer,
  WellContainerModal,
  PasswordRecover,
  RowRecover,
  Submit,
} from "./styles"

import { Link, useHistory, useParams } from "react-router-dom";
import moment from "moment";
const baseUri = process.env.REACT_APP_API_URL;


interface Props {
  counter: number;
  reduxIncreaseCounter: () => void;
  reduxDecreaseCounter: () => void;
}

function HomePage({
  reduxIncreaseCounter,
  reduxDecreaseCounter,
  counter,
}: Props) {
  const [translators, setTranslators] = useState([]);
  const [translator, setTranslator] = useState<any>({});
  const [isVisible, setisVisible] = useState(false);
  const [data, setData] = useState<any>({});
  const [page, setPage] = useState(1);
  const history = useHistory();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const getTranslators = () => {
    const headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", localStorage.getItem("token")!);

    try {
      fetch(`${baseUri}/translation_services/?page=${page}`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((responseJson) => {
          setTranslators(responseJson.results);
          setData(responseJson);
        })
        .catch((error) => {
          //console.log(error);
        });
    } catch (error) {
      //console.log("Error", error);
    }
  };

  useEffect(() => {
    getTranslators();
  }, [page]);

  useEffect(() => {
    getTranslators();
  }, []);

  const validateStatus = (status) => {
    switch (status) {
      case "0":
        return "Solicitado";
      case "1":
        return "En progreso";
      case "2":
        return "Finalizado";
      case "3":
        return "Reprogramado";
      case "4":
        return "Cancelado";
      default:
        return "Solicitado";
    }
  };

  const cancelTranslate = (id) => {
    const headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", localStorage.getItem("token")!);

    try {
      fetch(`${baseUri}/translation_services/cancel/${id}`, {
        method: "PUT",
        headers: headers,
      })
        .then((response) => response.json())
        .then((responseJson) => {
          setisVisible(false);
          alert("Servicio cancelado");
          getTranslators();
        })
        .catch((error) => {
          //console.log(error);
        });
    } catch (error) {
      //console.log("Error", error);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-md layout">
        <Link className="navbar-brand" to="/translators">
          <img src="/assets/images/logo.png" alt="logo" />
        </Link>
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link nav-item-inactive" to="/translators">
              Traductores
            </Link>
          </li>
          <li className="nav-item nav-item-active">
            <Link className="nav-link" to="/home">
              Mis solicitudes
            </Link>
          </li>
        </ul>
        <ul className="navbar-nav">
          <li className="nav-item ">
            <img src="/assets/images/bell@2x.png"></img>
          </li>
        </ul>
        <ul className="navbar-nav">
          <img
            src="/assets/images/no_avatar_default.png"
            className="ico-user"
          />
          <NavDropdown
            title={localStorage.getItem("userName")}
            id="nav-dropdown"
          >
            <NavDropdown.Item>
              <Link to="/profile">Perfil</Link>
            </NavDropdown.Item>{" "}
            <NavDropdown.Item>
              <Link
                to="#"
                onClick={() => {
                  logout();
                  history.push("/");
                }}
              >
                Cerrar sesión
              </Link>
            </NavDropdown.Item>
          </NavDropdown>
        </ul>
      </nav>
      <Container className="themed-container" fluid={true}>
        <RowRecover className="layout-content">
          <Col className="col-md-12">
            <Title>Mis solicitudes</Title>
            <PasswordRecover>
              <WellContainer>
                {/* <Container className="themed-container" fluid={true}>
                  <Row>
                    <Col>
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Control as="select">
                          <option>Todos los tipos</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Control as="select">
                          <option>Todos los estados</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Control as="select">
                          <option>Más recientes</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Control as="select">
                          <option>Todos los cobros</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Control as="select">
                          <option>Desde: 07/07/20</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Control as="select">
                          <option>Desde: 07/07/20</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Control as="select">
                          <option>Todos los cobros</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                    <Col>
                      <FormControl
                        id="inlineFormInputGroup"
                        placeholder="Buscar por traductor"
                      />
                    </Col>
                  </Row>
                </Container>
               */}
                <div className="table-responsive">
                  <table className="table ">
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">Traductor</th>
                        <th scope="col">Tipo de solicitud</th>
                        <th scope="col">Cobro</th>
                        <th scope="col">Creación</th>
                        <th scope="col">Estado</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {translators.map((ele: any) => (
                        <tr>
                          <td>
                            <div className="userIcon">
                              <div>
                                <img
                                  src="/assets/images/no_avatar_default.png"
                                  className="image-icon"
                                />
                              </div>
                              <div>
                                <p className="name">
                                  {ele.translator.firstname}{" "}
                                  {ele.translator.lastname}
                                  <div>
                                    <span className="fa fa-star-o  active"></span>
                                    <span className="fa fa-star-o  active"></span>
                                    <span className="fa fa-star-o active"></span>
                                    <span className="fa fa-star-o active"></span>
                                    <span className="fa fa-star-o active"></span>
                                  </div>
                                </p>
                              </div>
                            </div>
                          </td>
                          <td>Programada</td>
                          <td>${ele.amount}</td>
                          <td>{moment(ele.date).format("D MMM  YYYY")}</td>
                          <td>
                            <span className="badge badge-light">
                              {validateStatus(ele.status)}
                            </span>
                          </td>
                          <td>
                            <Link
                              className="view-mas"
                              to="#"
                              onClick={() => {
                                setTranslator(ele);
                                setisVisible(true);
                              }}
                            >
                              <img
                                src="/assets/images/dots@2x.png"
                                alt="logo"
                              />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="paginador">
                  {page > 1 && (
                    <button
                      className="atras"
                      onClick={() => {
                        setPage(data.page - 1);
                      }}
                    >
                      Atrás
                    </button>
                  )}
                  Pagina {data.page} de {data.pages}
                  <button
                    className="siguiente"
                    onClick={() => {
                      setPage(data.page + 1);
                    }}
                  >
                    Siguiente
                  </button>
                </p>
              </WellContainer>
            </PasswordRecover>
          </Col>
        </RowRecover>
        <Modal
          className="right"
          show={isVisible}
          onHide={() => {
            setisVisible(false);
          }}
          autoFocus
          keyboard
        >
          <Modal.Header closeButton>
            <Modal.Title>Detalles de servicio</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="contentUserIcon">
              <div className="userIconModal">
                <div>
                  <img
                    src="/assets/images/no_avatar_default.png"
                    alt="logo"
                    className="image-profile"
                  />
                </div>
                <div>
                  <p className="name-modal">
                    {translator.translator?.firstname}{" "}
                    {translator.translator?.lastname}
                  </p>
                  <p className="tradu-ins">Traducción programada</p>
                </div>
              </div>
              <span className="badge badge-light status-trans">
                {validateStatus(translator.status)}
              </span>
            </div>
            <WellContainerModal>
              <p className="price-modal">
                $ {translator.amount}{" "}
                {/* <span className="price-detail">($2x100) + $5</span> */}
              </p>
              {/* <p className="detail-modal-text-bold">
                Cucutiempo: <span>tiempo abierto</span>
              </p> */}
              <p className="detail-modal-text-bold">
                Cobro por:{" "}
                <span>
                  {translator.duration_type === 0 ? "Hora" : "Minutos"}
                </span>{" "}
              </p>
              <p className="detail-modal-text-bold">
                Duración: <span>{translator.duration_amount}</span>{" "}
              </p>
              <p className="detail-modal-text-bold">
                Fecha inicio:{" "}
                <span> {moment(translator.date).format("D MMM  YYYY")}</span>
              </p>
              <Submit
                type="button"
                onClick={() => {
                  window.open(translator.url);
                }}
              >
                <img src="/assets/images/video-purple.png"></img>Visitar URL de
                la sesión
              </Submit>
              <hr></hr>
              {/* <p className="detail-modal-text-bold">Adjuntos</p>
              <div className="container-files">
                <span className="file">
                  <i className="fa fa-file margin-file"></i>Name.jpg
                </span>{" "}
                <span className="file">
                  <i className="fa fa-file margin-file"></i>Name.jpg
                </span>{" "}
                <span className="file">
                  <i className="fa fa-file margin-file"></i>Name.jpg
                </span>
              </div> */}
              <p className="detail-modal-text-bold">Información adicional</p>
              <p className="detail-modal-text">{translator.description}</p>
            </WellContainerModal>
            <SubmitCancel
              type="button"
              onClick={() => {
                cancelTranslate(translator.id);
              }}
            >
              Cancelar servicio
            </SubmitCancel>
          </Modal.Body>
        </Modal>
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

HomePage.propTypes = {
  counter: PropTypes.number.isRequired,
  reduxIncreaseCounter: PropTypes.func.isRequired,
  reduxDecreaseCounter: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);

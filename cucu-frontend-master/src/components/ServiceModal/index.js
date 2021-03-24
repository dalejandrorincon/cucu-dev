/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { itemStatusLabel } from "../../utils/constants"
import { isParseable } from "../../utils/constants"

import {
  WellContainerModal,
  URLLabel,
  Submit,
  Cancel,
} from "./styles"

import "./styles.scss"

import CancelModal from "../CancelModal"
import RateModal from "../RateModal"
import EditServiceModal from "../EditServiceModal"


import * as ServicesAPI from '../../api/services';
import { Link, useHistory, useParams } from "react-router-dom";

import moment from "moment";
import { NotifierGenerator } from "../Alerts"
import { useTranslation } from 'react-i18next';


export default function ServiceModal(props) {
  const [statusButtons, setStatusButtons] = useState(null);
  const [modalCancel, setModalCancel] = useState(false);
  const [modalRate, setModalRate] = useState(false);
  const [modalType, setModalType] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [newUrl, setNewUrl] = useState(false);

  const [confirmDisable, setConfirmDisable] = useState(false)

  const [confirmCancelBtn, setConfirmCancelBtn] = useState(false);

  const [alert, setAlert] = useState({ type: "", message: "" });

  const [role] = useState(localStorage.getItem("role") === "2" ? "translator" : "client");

  const history = useHistory();
	const { t, i18n } = useTranslation();

  const acceptService = () => {
    setConfirmDisable(true)
    ServicesAPI.acceptService(localStorage.getItem("token"), props.service?.id).then((res) => {
      setConfirmDisable(false)
      props.onHide()
      props.updateServices()
      setAlert({ type: "success", message: t('request-modal.service-accepted')})
    })
  }

  /* const startService = () => {
    setConfirmDisable(true)
    ServicesAPI.startService(localStorage.getItem("token"), props.service?.id).then((res) => {
      setConfirmDisable(false)
      props.onHide()
      props.updateServices()
      setAlert({type: "success", message: "Servicio iniciado"})     
    })
  } */

  const finishService = () => {
    setConfirmDisable(true)
    ServicesAPI.finishService(localStorage.getItem("token"), props.service?.id).then((res) => {
      setConfirmDisable(false)
      props.onHide()
      props.updateServices()
      setAlert({type: "success", message: t('request-modal.service-finished')  })
    })
  }

  const cancelService = () => {
    //console.log(typeof confirmDisable)
    setConfirmDisable(true)
    ServicesAPI.cancelService(localStorage.getItem("token"), props.service?.id, localStorage.getItem("role")).then((res) => {
      setConfirmDisable(false)
      props.onHide()
      props.updateServices()
      setAlert({ type: "success", message: t('request-modal.service-cancelled')})
    })
  }


  const getButtons = () => {

    let buttons;

    if (localStorage.getItem("role") === "2") {
      switch (props.service.status) {
        case "0":
          buttons =
            <>
              <Submit
                disabled={confirmDisable}
                onClick={() => {
                  acceptService()
                }}>
                {t('request-modal.accept-service')}
              </Submit>
              <Cancel
                onClick={() => {
                  setModalCancel(true)
                  setModalType("reject")
                }}
              >
                {t('request-modal.reject')}
              </Cancel>
            </>

          break;

        case "1":
          buttons =
            <>
              {/* <Submit 
                disabled={confirmDisable}
                onClick={() => { 
                  startService()
                }}>
                Iniciar traducción
            </Submit> */}
              <Button
                variant="danger"
                className="client-cancel full"
                onClick={() => {
                  setModalCancel(true)
                  setModalType("cancel")
                }}>
                {t('request-modal.cancel-service')}
            </Button>
            </>
          break;

        case "2":
          buttons =
            <>
              <Button
                className="cucu-button full"
                onClick={() => {
                  finishService()
                }}>
                {t('request-modal.finish-service')}
            </Button>
          </>
      }
    }
    if (localStorage.getItem("role") === "3" || localStorage.getItem("role") === "4") {

      switch (props.service.status) {
        case "0":
          buttons =
            <>
              {!confirmCancelBtn ?
                <Button
                  variant="outline-danger"
                  className="client-cancel full"
                  onClick={() => {
                    setConfirmCancelBtn(true)
                  }}>
                  {t('request-modal.cancel-service')}
                </Button>
                :
                <Button
                  variant="danger"
                  className="client-cancel full"
                  disabled={confirmDisable}
                  onClick={() => {
                    cancelService()
                    setConfirmCancelBtn(false)
                  }}>
                  {t('request-modal.cancel-confirm')}
                </Button>
              }
            </>
          break;

        case "1":
          buttons =
            <>
              {!confirmCancelBtn ?
                <>
                  <Submit
                    disabled={confirmDisable}
                    onClick={() => {
                      history.push("/payment/" + props.service.id)
                    }}>
                    {t('request-modal.pay')}
              </Submit>
                  <Cancel
                    onClick={() => {
                      setConfirmCancelBtn(true)
                    }}>
                    {t('request-modal.cancel-service')}
              </Cancel>
                </>
                :
                <>
                  <Submit
                    variant="danger"
                    disabled={confirmDisable}
                    className="client-cancel"
                    onClick={() => {
                      cancelService()
                      setConfirmCancelBtn(false)
                    }}>
                    {t('request-modal.cancel-confirm')}
              </Submit>
                  <Cancel
                    onClick={() => {
                      setConfirmCancelBtn(false)
                    }}>
                    {t('request-modal.dont-cancel')}
              </Cancel>
                </>
              }
            </>
        break;

        case "2":
          buttons =
            <>
              <Button
                className="cucu-button full"
                onClick={() => {
                  finishService()
                }}>
                {t('request-modal.finish-service')}
            </Button>
          </>
        break;

        
        case "3":
        if(props.service?.rated==false){
          buttons =
            <>
              <Button
                className="cucu-button full"
                onClick={() => {
                  setModalRate(true)
                }}>
                {t('request-modal.rate-service')}
            </Button>
          </>
        }
      }

    }

    setStatusButtons(buttons)
  }

  useEffect(() => {
    getButtons()
  }, [props.service, confirmCancelBtn, i18n.language]);

  return (
    <>
      <Modal
        className="right service-modal"
        show={props.show}
        onHide={() => {
          props.onHide();
          setConfirmCancelBtn(false)
        }}
        autoFocus
        keyboard
      >
        <Modal.Header closeButton>
          <Modal.Title>{t('request-modal.service-details')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="contentUserIcon">
            <div className="userIconModal">
              <div>
                {role == "translator" ?
                  <img
                    src={props.service?.client?.image_url ? props.service?.client.image_url : "/assets/images/no_avatar_default.png"}
                    className="image-profile ico-user"
                  />
                  :
                  <img

                    src={props.service?.translator?.image_url ? props.service?.translator.image_url : "/assets/images/no_avatar_default.png"}
                    className="image-profile ico-user"
                  />
                }
              </div>
              <div className="user-container">
                <div>
                  <p className="name-modal">
                    {
                      role == "translator" ?
                        <>
                          {props.service.client?.firstname}
                          {props.service.client?.lastname}
                        </>
                        :
                        <>
                          {props.service.translator?.firstname}
                          {props.service.translator?.lastname}
                        </>
                    }
                  </p>
                  <p className="tradu-ins">{props.service.service_type == "0" ? t('request-modal.instant') : t('request-modal.programmed')}</p>
                </div>
                {itemStatusLabel(props.service.status)}
              </div>
            </div>
          </div>
          <WellContainerModal>

            {props.service.cancel_reason && props.service.status == "5" || props.service.status == "6" ?
              <div className="cancel-reason">
                <p className="title">{t('request-modal.reason-for')} {props.service.status == "5" ? <>{t('request-modal.cancellation')}</> : <>{t('request-modal.rejection')}</>}</p>
                <p className="desc">{props.service.cancel_reason}</p>
              </div>
              : null
            }

            <p className="price-modal">
              $ {props.service.amount}{" "}
              <span className="price-detail">
                (${props.service.duration_type == "0" ? props.service.translator?.rate_hour : props.service.translator?.rate_minute}
                  /{props.service.duration_type == "0" ? "hr" : "min"}) x {props.service.duration_amount} + $5
              </span>
            </p>
            {/* <p className="detail-modal-text">
              <b>Cucumetro: </b>
              <span>
                {props.service.time_type === 0 ? "Servicio fijo" : "Minuto consumido"}
              </span>
            </p> */}
            <p className="detail-modal-text">
              <b>{t('request.service-site')}: </b>
              <span>
                {props.service.service_site == 1 ? t('request.external-platform') : t('request.zoom-cucu')}
              </span>
            </p>
            <p className="detail-modal-text">
              <b>{t('request-modal.rate-type')}: </b>
              <span>
                {props.service.duration_type === "0" ? t('hours') : t('minutes')}
              </span>
            </p>
            <p className="detail-modal-text">
              <b>{t('request-modal.duration')}:  </b>
              <span>{props.service.duration_amount}</span>
            </p>
            <p className="detail-modal-text">
              <b>{t('request-modal.start-date')}: </b>
              <span> {moment(props.service.date).format("D MMM  YYYY")}</span>
            </p>
              <>
              { props.service?.url?.length>0 && ( props.service?.status == "2" || role == "client" ) ?
                <URLLabel
                  type="button"
                  className="url-button"
                  onClick={() => {
                    let url;
                    if(newUrl){
                      url = newUrl
                    }else{
                      url = props.service.url
                    }
                    window.open(url.includes("//") ? url : "//"+url);
                  }}
                >
                  <img src="/assets/images/video-purple.png"></img>
                  {t('request-modal.enter-session')}
                </URLLabel>
              : null}

              { ( (  props.service?.status == "0" || props.service?.status == "1" || props.service?.status == "2" ) && role == "client" ) ?
                <URLLabel className="url-edit-button"
                  onClick={() => setModalEdit(true)}
                >
                  <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                  {t('request-modal.edit-url')}
                </URLLabel>
              : null}

              </>  
            <hr></hr>
            <p className="detail-modal-text">{t('request-modal.attached')}</p>
            <div className="container-files">
              {(props.service.files_urls?.length) ? props.service.files_urls?.map((file, index) => (
                <a key={index} href={file.url}>
                  <span className="file">
                    <i className="fa fa-file margin-file"></i>{file.name}
                  </span>
                </a>
              )) :
                <p className="no-content">
                  {t('request-modal.no-attachments')}
              </p>
              }
            </div>

            {props.service.description ? (
              <div className="modal-description">
                <p className="detail-modal-text">{t('request-modal.extra-info')}</p>
                <p className="detail-text">{props.service.description}</p>
              </div>
            ) : null}
          </WellContainerModal>
        </Modal.Body>

        <Modal.Footer>
          {statusButtons}
        </Modal.Footer>

      </Modal>

      <CancelModal
        onHide={() => setModalCancel(false)}
        cancelSuccess={(type) => {
          props.updateServices();
          setAlert({ type: "success", message: t('request-modal.service') + type })
        }}
        show={modalCancel}
        service={props.service}
        type={modalType}
      >
      </CancelModal>

      <RateModal
        onHide={() => setModalRate(false)}
        rateSuccess={(type) => {
          props.updateServices();
          setAlert({ type: "success", message: t('request-modal.service-rated')})
        }}
        show={modalRate}
        service={props.service}
        type={modalType}
      >
      </RateModal>

      <EditServiceModal
        onHide={() => setModalEdit(false)}
        editSuccess={(url) => {
          props.updateServicesPersist();
          setNewUrl(url)
          props.onHide()
          props.updateServices()
          setAlert({ type: "success", message: t('request-modal.service-edited')})
        }}
        show={modalEdit}
        service={props.service}
      >
      </EditServiceModal>

      <NotifierGenerator
        alert={alert}
      >
      </NotifierGenerator>

    </>
  );
}
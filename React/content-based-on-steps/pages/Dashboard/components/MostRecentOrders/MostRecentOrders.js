import React, {useState} from "react";
import Modal from "react-modal";
import {useDispatch, useSelector} from "react-redux";

import i18n from '../../../../i18n';

// styles
import styles from './MostRecentOrders.module.scss';

// components
import MostRecentOrderCard from "./MostRecentOrderCard/MostRecentOrderCard";
import ModalBody from "./Modal/ModalBody";

import {getOrderDetails} from "../../../../actions/dashboard";

Modal.setAppElement('#root');

const MostRecentOrders = ({data}) => {
  const {data: cardsData} = data;
  const dispatch = useDispatch();

  const language = useSelector(state => state.languageReducer);
  const lang = i18n[language].dispatch;

  const {orderDetails} = useSelector(state => state.adminPanelReducer);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const modalStyles = {
    content: {
      maxWidth: '290px',
      width: '100%',
      inset: 'unset',
      padding: '11px',
      borderRadius: '10px',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },

  }

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDetailsClick = (id) => {
    dispatch(getOrderDetails({id}))
      .then((res) => {
        setIsModalOpen(res);
      });
  }

  return (
    <div className={styles['MostRecentOrders']}>
      <div className={styles['MostRecentOrders-top']}>
        <h6 className={styles['MostRecentOrders-top__heading']}>
            {lang.mostRecentOrders}
        </h6>
      </div>
      <div className={styles['MostRecentOrders-main']}>
        {
          cardsData && cardsData.map(card => {
            return (
              <MostRecentOrderCard
                key={card.id}
                id={card.id}
                status={card.order_status}
                payment={card.payment_status}
                service={card.service}
                handleDetailsClick={handleDetailsClick}
              />
            )
          })
        }
      </div>
      <Modal
        style={modalStyles}
        isOpen={isModalOpen}
        shouldCloseOnOverlayClick
        onRequestClose={closeModal}
      >
        <ModalBody
          data={orderDetails}
        />
      </Modal>
    </div>
  );
};

export default MostRecentOrders;

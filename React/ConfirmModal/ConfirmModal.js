import React from 'react';

// HOC
import Modal from '@HOC/Modal/Modal';
import LazyComponent from '@HOC/LazyComponent/LazyComponent';

// Styles
import './style/confrim_modal.scss';

const ConfirmModal = ({heading, message, active, cancelBtn, okBtn}) => {
    return (
        active && <LazyComponent>
            <Modal>
                <div className="modal_container">
                    <div className="apm_modal confirm_modal">
                        <header>
                            <button
                                className="close"
                                onClick={cancelBtn.cancelAction}
                            />
                        </header>
                        <main>
                            <h2>
                                {heading}
                            </h2>
                            <p>{message}</p>
                        </main>
                        <footer>
                            <button
                                onClick={okBtn.okAction}
                                className="primary_action"
                            >
                                {okBtn.text}
                            </button>
                            <button
                                onClick={cancelBtn.cancelAction}
                                className="secondary_action"
                            >
                                {cancelBtn.text}
                            </button>
                        </footer>
                    </div>
                </div>
            </Modal>
        </LazyComponent>
    )
}

export default React.memo(ConfirmModal);
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import "primereact/resources/themes/saga-blue/theme.css"; // theme
import "primereact/resources/primereact.min.css"; // core css
import "primeicons/primeicons.css"; // icons
import { Dialog } from "primereact/dialog";
interface notificationMessage {
  message?: string;
}
export const NotificationCard = React.forwardRef(
  (props: notificationMessage, ref) => {
    const [visible, setVisible] = useState<boolean>(false);
    const {} = props;

    // useImperativeHandle(ref, () => ({
    //   show: (value: boolean) => setVisible(value),
    // })); neu dat ben kia la show
    useImperativeHandle(ref, () => ({
      showModal: () => {
        setVisible(true);
        setTimeout(() => {
          setVisible(false);
        }, 3000);
      },
    }));

    return (
      <div>
        <Dialog
          visible={visible}
          onHide={() => setVisible(false)}
          header="Thông báo"
        >
          <div className="p-card">
            <button className="p-dismiss p-button" type="button">
              <i className="pi pi-times"></i>
            </button>
            <div className="p-header">
              <div className="p-image">
                <i className="pi pi-check"></i>
              </div>
              <div className="p-content">
                <span className="p-title">{props.message} </span>
                <p className="p-message">Bạn đã vào nhóm ~~~~</p>
              </div>
              <div className="p-actions">
                <Button
                  label="History"
                  className="p-button-success p-history"
                />
                <Button
                  label="Track my package"
                  className="p-button-secondary p-track"
                />
              </div>
            </div>
            <style jsx>{`
              .p-card {
                overflow: hidden;
                position: relative;
                text-align: left;
                border-radius: 0.5rem;
                max-width: 290px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
                  0 10px 10px -5px rgba(0, 0, 0, 0.04);
                background-color: #fff;
              }

              .p-dismiss {
                position: absolute;
                right: 10px;
                top: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0.5rem 1rem;
                background-color: #fff;
                color: black;
                border: 2px solid #d1d5db;
                font-size: 1rem;
                font-weight: 300;
                width: 30px;
                height: 30px;
                border-radius: 7px;
                transition: 0.3s ease;
              }

              .p-dismiss:hover {
                background-color: #ee0d0d;
                border: 2px solid #ee0d0d;
                color: #fff;
              }

              .p-header {
                padding: 1.25rem 1rem 1rem 1rem;
              }

              .p-image {
                display: flex;
                margin-left: auto;
                margin-right: auto;
                background-color: #e2feee;
                flex-shrink: 0;
                justify-content: center;
                align-items: center;
                width: 3rem;
                height: 3rem;
                border-radius: 9999px;
                animation: animate 0.6s linear alternate-reverse infinite;
                transition: 0.6s ease;
              }

              .p-image i {
                color: #0afa2a;
                font-size: 2rem;
              }

              .p-content {
                margin-top: 0.75rem;
                text-align: center;
              }

              .p-title {
                color: #066e29;
                font-size: 1rem;
                font-weight: 600;
                line-height: 1.5rem;
              }

              .p-message {
                margin-top: 0.5rem;
                color: #595b5f;
                font-size: 0.875rem;
                line-height: 1.25rem;
              }

              .p-actions {
                margin: 0.75rem 1rem;
              }

              .p-history {
                display: inline-flex;
                padding: 0.5rem 1rem;
                background-color: #1aa06d;
                color: #ffffff;
                font-size: 1rem;
                line-height: 1.5rem;
                font-weight: 500;
                justify-content: center;
                width: 100%;
                border-radius: 0.375rem;
                border: none;
                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
              }

              .p-track {
                display: inline-flex;
                margin-top: 0.75rem;
                padding: 0.5rem 1rem;
                color: #242525;
                font-size: 1rem;
                line-height: 1.5rem;
                font-weight: 500;
                justify-content: center;
                width: 100%;
                border-radius: 0.375rem;
                border: 1px solid #d1d5db;
                background-color: #fff;
                box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
              }

              @keyframes animate {
                from {
                  transform: scale(1);
                }

                to {
                  transform: scale(1.09);
                }
              }
            `}</style>
          </div>
        </Dialog>
      </div>
    );
  }
);

NotificationCard.displayName = "NotificationCard";

export default NotificationCard;

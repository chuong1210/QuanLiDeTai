import { ConfirmModalRefType, ConfirmModalType } from '@/assets/types/modal';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { MouseEvent, forwardRef, useImperativeHandle } from 'react';

const Confirm = forwardRef<ConfirmModalRefType, ConfirmModalType>(
    ({ acceptLabel, type, rejectLabel, onAccept, onReject }, ref) => {
        const show = (event: MouseEvent, data: any, message: string) => {
            confirmPopup({
                target: event.target as HTMLElement,
                message: message,
                icon: 'pi pi-info-circle',
                className: 'shadow-5',
                rejectClassName: 'bg-primary',
                acceptClassName: type === "comfirm" ? 'p-button-success' : "p-button-danger",
                // acceptClassName: 'bg-green',
                acceptLabel: acceptLabel || 'Yes',
                rejectLabel: rejectLabel || 'No',
                accept: () => onAccept?.(data),
                reject: onReject,
            });
        };

        useImperativeHandle(ref, () => ({
            show,
        }));

        return <ConfirmPopup />;
    },
);

Confirm.displayName = 'Confirm ';

export default Confirm;

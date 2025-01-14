import { ConfirmModalRefType, ConfirmModalType } from '@/assets/types/modal';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { MouseEvent, forwardRef, useImperativeHandle, useState } from 'react';
import { InputText } from '../form';

const ConfirmWithFeedback = forwardRef<ConfirmModalRefType, ConfirmModalType>(
    ({ acceptLabel, rejectLabel, onAccept, onReject }, ref) => {
        const [feedback, setFeedback] = useState<string>('');
        // const [currentData, setCurrentData] = useState<any>(null);

        const show = (event: MouseEvent, data: any, message: string) => {
            setFeedback(''); // Reset feedback
            // setCurrentData(data); // Save data to pass on submit

            confirmPopup({
                target: event.target as HTMLElement,
                message: (
                    <div>
                        <p>{message}</p>
                        <div className="field">
                            <label htmlFor="feedback">Your Feedback</label>
                            <InputText
                                id="feedback"
                                focus={true}
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Enter your feedback here..."
                            />
                        </div>
                    </div>
                ),
                icon: 'pi pi-info-circle',
                className: 'shadow-5',
                rejectClassName: 'bg-primary',
                acceptClassName: 'p-button-danger',
                acceptLabel: acceptLabel || 'Submit',
                rejectLabel: rejectLabel || 'Cancel',
                accept: () => onAccept?.({ data, feedback }),
                reject: onReject,
            });
        };

        useImperativeHandle(ref, () => ({
            show,
        }));

        return <ConfirmPopup />;
    },
);

ConfirmWithFeedback.displayName = 'Confirm with feedback';

export default ConfirmWithFeedback;

import { InputDateProps } from '@/assets/types/form';
import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';
import { useEffect, useState } from 'react';
const InputDate = ({
    id,
    label,
    value = null,
    placeholder = '',
    blockClassName = '',
    format = 'dd/mm/yy',
    row = false,
    time = false,
    timeOnly = false,
    showButtonBar = true,
    required = false,
    errorMessage,
    onChange = () => { },
}: InputDateProps) => {
    const [date, setDate] = useState<Date | undefined | null>(value ? new Date(value) : null);

    useEffect(() => {
        //console.log("value", value)
        if (value) {
            setDate(value);
        }
    }, [value]);

    return (
        <div className={classNames(blockClassName)}>
            <div className={classNames('block', { 'flex align-items-center': row })}>
                {label && (
                    <label
                        htmlFor={id}
                        className={classNames('font-medium block text-800', {
                            'w-10rem mr-2': row,
                            'mb-2': !row,
                            'p-error': !!errorMessage,
                        })}
                    >
                        {label}
                        {required && <span className='p-error'> ⁎</span>}
                    </label>
                )}
                <Calendar
                    inputId={id}
                    hideOnDateTimeSelect={true}
                    value={date}
                    hourFormat='24'
                    showButtonBar={showButtonBar}
                    placeholder={placeholder}
                    onChange={(e) => {
                        setDate(e.value);
                        onChange(e);
                    }}
                    dateFormat={format}
                    className={classNames('w-full flex-1', { 'p-invalid': !!errorMessage })}
                    inputClassName='w-full h-3rem'
                    showTime={time}
                    timeOnly={timeOnly}
                />
            </div>

            <small className='p-error'>{errorMessage}</small>
        </div>
    );
};

export { InputDate };

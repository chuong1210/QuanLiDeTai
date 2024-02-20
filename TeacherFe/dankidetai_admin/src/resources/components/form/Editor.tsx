'use client';

import { EditorProps } from '@/assets/types/form';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { classNames } from 'primereact/utils';
import { useEffect, useState } from 'react';

const Editor = ({
    label,
    value = '',
    blockClassName = '',
    row = false,
    required = false,
    disabled = false,
    errorMessage,
    config,
    placeholder,
    onChange = () => { },
}: EditorProps) => {
    const [inputValue, setInputValue] = useState(value.toString());

    useEffect(() => {
        setInputValue(value.toString());
    }, [value]);

    return (
        <div className={classNames(blockClassName)}>
            <div className={classNames('block', { 'flex align-items-center': row })}>
                {label && (
                    <p
                        className={classNames('font-medium block text-800', {
                            'w-10rem mr-2': row,
                            'mb-2': !row,
                            'p-error': !!errorMessage,
                        })}
                    >
                        {label}
                        {required && <span className='p-error'> ⁎</span>}
                    </p>
                )}

                <CKEditor
                    editor={ClassicEditor}
                    data={inputValue}
                    disabled={disabled}
                    config={{
                        ...config,
                        placeholder,
                    }}
                    onChange={(event, editor) => {
                        const data = editor.data.get();

                        onChange(data);
                        setInputValue(data);
                    }}
                />
            </div>

            <small className='p-error'>{errorMessage}</small>
        </div>
    );
};

export { Editor };

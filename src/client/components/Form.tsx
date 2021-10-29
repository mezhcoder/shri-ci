import React, { ChangeEvent, useCallback, useState } from 'react';
import { cn } from '@bem-react/classname';
import { CheckoutFormData } from '../../common/types';

const PHONE_REGEX = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;

export interface FormProps {
    onSubmit: (data: CheckoutFormData) => void;
}

function getControlClass(isValid: boolean, submitted: boolean) {
    return !isValid && submitted ? 'form-control is-invalid' : 'form-control';
}

const bem = cn('Form');

export const Form: React.FC<FormProps> = ({ onSubmit }) => {
    const [sent, setSent] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    const nameIsValid = Boolean(name.trim());
    const phoneIsValid = PHONE_REGEX.test(phone.trim());
    const addressIsValid = Boolean(address.trim());

    const onChangeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }, [setName]);

    const onChangePhone = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
    }, [setPhone]);

    const onChangeAddress = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
        setAddress(e.target.value);
    }, [setAddress]);

    const onClick = useCallback(() => {
        setSubmitted(true);

        if (nameIsValid && phoneIsValid && addressIsValid) {
            setSent(true);
            onSubmit({
                name: name.trim(),
                phone: phone.trim(),
                address: address.trim(),
            });
        }
    }, [nameIsValid, phoneIsValid, addressIsValid, setSubmitted, setSent, onSubmit]);

    return (
        <div className={bem()}>
            <div className="mb-3">
                <label htmlFor="f-name" className="form-label">Name</label>
                <input
                    id="f-name"
                    type="text"
                    disabled={sent}
                    className={bem("Field", { type: 'name' }, [getControlClass(nameIsValid, submitted)])}
                    autoComplete="off"
                    onChange={onChangeName} />
                <div className="invalid-feedback">Please provide your name</div>
            </div>
            <div className="mb-3">
                <label htmlFor="f-phone" className="form-label">Phone</label>
                <input
                    id="f-phone"
                    type="text"
                    disabled={sent}
                    className={bem("Field", { type: 'phone' }, [getControlClass(phoneIsValid, submitted)] )}
                    onChange={onChangePhone} />
                <div className="invalid-feedback">Please provide a valid phone</div>
            </div>
            <div className="mb-3">
                <label htmlFor="f-address" className="form-label">Address</label>
                <textarea
                    id="f-address"
                    disabled={sent}
                    rows={3}
                    className={bem("Field", { type: 'address' }, [getControlClass(addressIsValid, submitted)] )}
                    onChange={onChangeAddress}></textarea>
                <div className="invalid-feedback">Please provide a valid address</div>
            </div>

            <button className={bem('Submit', ['btn', 'btn-primary'])} disabled={sent} onClick={onClick}>Checkout</button>
        </div>
    );
}

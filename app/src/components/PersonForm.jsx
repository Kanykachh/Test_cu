import React, { useState } from 'react'
import { validatePerson, validateAge, validateZipCode, validateCity, validateName, validateEmail } from '../domain/validator'
import {errorMessages, getErrorMessage} from '../utils/errorMessages'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './PersonForm.css'

/**
 * PersonForm Component
 *
 * A form for registering a person. Handles field validation and submission.
 * Displays validation errors and success notifications using react-toastify.
 *
 * @module PersonForm
 * @component
 *
 * @param {Object} props
 * @param {function(Object): void} props.addPerson - Callback function to add a person object to parent state or storage
 *
 * @returns {JSX.Element} The rendered registration form
 */
export default function PersonForm({addPerson}) {
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        birthDate: '',
        zip: '',
        city: '',
    })

    const [errors, setErrors] = useState({})

    /**
     * Validate a single form field and update the error state.
     * @module PersonForm
     * @function validateField
     * @private
     * @param {string} name - Field name
     * @param {string} value - Field value
     */
    const validateField = (name, value) => {
        if (!value) {
            setErrors(prev => ({ ...prev, [name]: '' }))
            return
        }

        try {
            switch (name) {
                case 'firstName':
                    validateName(value, 'firstName')
                    break
                case 'lastName':
                    validateName(value, 'lastName')
                    break
                case 'email':
                    validateEmail(value)
                    break
                case 'zip':
                    validateZipCode(value)
                    break
                case 'city':
                    validateCity(value)
                    break
                case 'birthDate':
                    validateAge(new Date(value))
                    break
            }
            setErrors(prev => ({ ...prev, [name]: '' }))
        } catch (err) {
            setErrors(prev => ({ ...prev, [name]: err.message }))
        }
    }

    /**
     * Handle form field changes.
     * @module PersonForm
     * @function handleChange
     * @private
     * @param {Event} e - Input change event
     */
    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
        validateField(name, value)
    }

    /**
     * Handle form submission.
     * @module PersonForm
     * @function handleSubmit
     * @private
     * @param {Event} e - Submit event
     */
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const person = {
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                birthDate: new Date(form.birthDate),
                zip: form.zip,
                city: form.city
            }
            validatePerson(person)
            await addPerson(person)
            toast.success("Enregistré avec succès !", {
                toastId: "success-toast"
            });
            setForm({ firstName: '', lastName: '', email: '', birthDate: '', zip: '', city: '' })
            setErrors({})
        } catch (err) {
            /* istanbul ignore next */
            let key = 'form'
            /* istanbul ignore next */
            if (err.message.includes('SERVER_ERROR')) {
                toast.error(errorMessages.SERVER_ERROR, { toastId: "server-error-toast", className: 'toast-server-error' })
            } else if (err.message.includes('FIRST_NAME')) key = 'firstName'
            else if (err.message.includes('LAST_NAME')) key = 'lastName'
            else if (err.message.includes('INVALID_EMAIL') || err.message.includes('EMAIL_ALREADY_EXISTS')) key = 'email'
            else if (err.message.includes('ZIP')) key = 'zip'
            else if (err.message.includes('CITY')) key = 'city'
            else if (err.message.includes('UNDERAGE') || err.message.includes('FUTURE_DATE')) key = 'birthDate'

            /* istanbul ignore next */
            setErrors({ [key]: err.message })
        }
    }

    const isDisabled =
        !form.firstName || !form.lastName || !form.email || !form.birthDate || !form.zip || !form.city || Object.values(errors).some(Boolean)

    return (
        <div className="card">
            <h2>Formulaire d'inscription</h2>
            <form onSubmit={handleSubmit} className="person-form">
                <div className="form-group">
                    <input
                        data-cy="firstName"
                        name="firstName"
                        aria-label="firstName"
                        placeholder="Prénom"
                        value={form.firstName}
                        onChange={handleChange}
                        onBlur={(e) => validateField('firstName', e.target.value)}
                    />
                    {errors.firstName && <span className="error">{getErrorMessage(errors.firstName)}</span>}
                </div>

                <div className="form-group">
                    <input
                        data-cy="lastName"
                        name="lastName"
                        aria-label="lastName"
                        placeholder="Nom"
                        value={form.lastName}
                        onChange={handleChange}
                        onBlur={(e) => validateField('lastName', e.target.value)}
                    />
                    {errors.lastName && <span className="error">{getErrorMessage(errors.lastName)}</span>}
                </div>

                <div className="form-group">
                    <input
                        data-cy="birthDate"
                        type="date"
                        name="birthDate"
                        data-testid="birthDate"
                        value={form.birthDate}
                        onChange={handleChange}
                        onBlur={(e) => validateField('birthDate', e.target.value)}
                    />
                    {errors.birthDate && <span className="error">{getErrorMessage(errors.birthDate)}</span>}
                </div>

                <div className="form-group">
                    <input
                        data-cy="zip"
                        name="zip"
                        aria-label="zip"
                        placeholder="Code Postal"
                        value={form.zip}
                        onChange={handleChange}
                        onBlur={(e) => validateField('zip', e.target.value)}
                    />
                    {errors.zip && <span className="error">{getErrorMessage(errors.zip)}</span>}
                </div>

                <div className="form-group">
                    <input
                        data-cy="city"
                        name="city"
                        aria-label="city"
                        placeholder="Ville"
                        value={form.city}
                        onChange={handleChange}
                        onBlur={(e) => validateField('city', e.target.value)}
                    />
                    {errors.city && <span className="error">{getErrorMessage(errors.city)}</span>}
                </div>

                <div className="form-group">
                    <input
                        data-cy="email"
                        name="email"
                        aria-label="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        onBlur={(e) => validateField('email', e.target.value)}
                    />
                    {errors.email && <span className="error">{getErrorMessage(errors.email)}</span>}
                </div>

                <button data-cy="submit" type="submit" disabled={isDisabled}>
                    Soumettre
                </button>
            </form>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    )
}
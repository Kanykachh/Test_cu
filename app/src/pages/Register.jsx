import PersonForm from "../components/PersonForm"
import { Link } from 'react-router-dom';
import './Register.css'

/**
 * Register Component
 *
 * Wrapper page for PersonForm. Passes addPerson callback to the form
 * and provides a link back to Home.
 *
 * @module Register
 * @component
 *
 * @param {Object} props
 * @param {function(Object): void} props.addPerson - Callback to add a person
 *
 * @returns {JSX.Element}
 */
export default function Register({addPerson}) {
    return (
        <div className="register-container">
            <PersonForm addPerson={addPerson}/>
            <Link to="/">
                <button data-cy="back-home" className="back-button">Retour à l'accueil</button>
            </Link>
        </div>
    )
}
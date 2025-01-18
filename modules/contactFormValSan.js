import DOMPurify from 'isomorphic-dompurify';

function contactFormValSan(json) {
    const formKeys = Object.keys(json);
    if (formKeys.length !== 4) return false;

    const profiles = {
        USE_PROFILES: {
            mathMl: false,
            svg: false,
            svgFilters: false,
            html: false
        }
    }

    const emailRegex = /^([\w!#$%&'*\-+\/=?^`\{\|\}~][\w!#$%&'*\-+\/=?^`\{\|\}~.]{1,62}?[\w!#$%&'*\-+\/=?^`\{\|\}~])@(([A-Za-z0-9][A-Za-z0-9\-]{1,61}?[A-Za-z0-9].)([A-Za-z0-9][A-Za-z0-9\-]{1,61}?[A-Za-z0-9].)?([A-Za-z0-9][A-Za-z0-9\-]{1,61}?[A-Za-z0-9]))$/v
    const {name, email, subject, message} = json;

    if (typeof name !== 'string') return false;
    if (typeof email !== 'string' || !emailRegex.test(email)) return false;
    if (typeof subject !== 'string') return false;
    if (typeof message !== 'string') return false;

    const [sanName, sanEmail, sanSubject, sanMessage] = [DOMPurify.sanitize(name, profiles), DOMPurify.sanitize(email, profiles), DOMPurify.sanitize(subject, profiles), DOMPurify.sanitize(message, profiles)];
    return {"name": sanName, "email": sanEmail, "subject": sanSubject, "message": sanMessage};
}

export default contactFormValSan;

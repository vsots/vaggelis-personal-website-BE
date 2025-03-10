import checkAndSanitizeString from "form-text-sanitizer";

function contactFormValSan(json) {
    const formKeys = Object.keys(json);
    if (formKeys.length !== 4) return false;

    const emailRegex = /^([\w!#$%&'*\-+\/=?^`\{\|\}~][\w!#$%&'*\-+\/=?^`\{\|\}~.]{1,62}?[\w!#$%&'*\-+\/=?^`\{\|\}~])@(([A-Za-z0-9][A-Za-z0-9\-]{1,61}?[A-Za-z0-9].)([A-Za-z0-9][A-Za-z0-9\-]{1,61}?[A-Za-z0-9].)?([A-Za-z0-9][A-Za-z0-9\-]{1,61}?[A-Za-z0-9]))$/v
    const {name, email, subject, message} = json;

    if (typeof name !== 'string') return false;
    if (typeof email !== 'string' || !emailRegex.test(email)) return false;
    if (typeof subject !== 'string') return false;
    if (typeof message !== 'string') return false;

    const [sanName, sanEmail, sanSubject, sanMessage] = [checkAndSanitizeString(name).suggestedString, checkAndSanitizeString(email).suggestedString, checkAndSanitizeString(subject).suggestedString, checkAndSanitizeString(message).suggestedString];
    return {"name": sanName, "email": sanEmail, "subject": sanSubject, "message": sanMessage};
}

const emailBody = (json) => (
`Name: ${json.name}
Email: ${json.email}
Subject: ${json.subject}


Message:
${json.message}`);

export { contactFormValSan, emailBody };

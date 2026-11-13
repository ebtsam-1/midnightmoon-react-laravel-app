function ErrorBox({ errors }) {
    if (!errors || Object.keys(errors).length === 0) {
        return null;
    }

    const messages = Object.values(errors).flat();

    return (
        <div className="error-box">
            {messages.map((msg, i) => (
                <p key={i} className="error-message">{msg}</p>
                
            ))}
        </div>
    );
}

export default ErrorBox;
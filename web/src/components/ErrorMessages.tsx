export default function ErrorMessages(props: { messages: string[] }) {
  const { messages } = props;
  return (
    <ul className="error-messages">
      {messages.map((message, index) => (
        <li key={index}>{message}</li>
      ))}
    </ul>
  );
}

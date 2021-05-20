import { useRef, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { MessageListItem } from './MessageListItem';

const listStyles = {
  height: '80vh',
  border: '1px solid rgba(0,0,0,.4)',
  borderRadius: '4px',
  overflow: 'auto'
};

//принимает сообщения и функцию для удаления сообщений, которую пропсит в MessageListItem
export const MessageList = ({ messages, removeMessage }) => {

  //красивая прокрутка сообщений при добавлении нового
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages]);

  return (
    <>
      <ListGroup variant='flush' style={listStyles}>
        {messages.map((msg) => (
          <MessageListItem
            key={msg.messageId}
            msg={msg}
            removeMessage={removeMessage}
          />
        ))}
        <span ref={messagesEndRef}></span>
      </ListGroup>
    </>
  );
}

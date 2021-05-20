import TimeAgo from 'react-timeago';//компонент добавляющий "сколько-то времени назад"
import { ListGroup, Card, Button } from 'react-bootstrap';
import { AiOutlineDelete } from 'react-icons/ai';

//принимает обьект сообщения и функцию удаления сообщений, чтобы не писать пропс.мсж итд
export const MessageListItem = ({ msg, removeMessage }) => {

  //функция удаления сообщения по ид
  const handleRemoveMessage = (id) => {
    removeMessage(id);
  }
  const { messageId, messageText, senderName, createdAt, currentUser } = msg;

  return (
    <ListGroup.Item
      className={`d-flex ${currentUser ? 'justify-content-end' : ''}`}
    >
      <Card
        bg={`${currentUser ? 'primary' : 'secondary'}`}
        text='light'
        style={{ width: '55%' }}
      >
        <Card.Header className='d-flex justify-content-between align-items-center'>
          <Card.Text as={TimeAgo} date={createdAt} className='small' />
          <Card.Text>{senderName}</Card.Text>
        </Card.Header>

        <Card.Body className='d-flex justify-content-between align-items-center'>
          <Card.Text>{messageText}</Card.Text>
          {/*message can be deleted only by user who created it*/}
          {currentUser && (
            <Button
              variant='none'
              className='text-warning'
              onClick={() => handleRemoveMessage(messageId)}
            >
              <AiOutlineDelete />
            </Button>
          )}
        </Card.Body>
      </Card>
    </ListGroup.Item>
  );
}

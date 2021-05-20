import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { nanoid } from 'nanoid';
import { useLocalStorage, useBeforeUnload } from 'hooks';

//главный хук с логикой
export const useChat = (roomId) => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [userId] = useLocalStorage('userId', nanoid(8));//записываем ид в локСтор
  const [username] = useLocalStorage('username');//получаем имя юзера из локСтор
  const socketRef = useRef(null);//нужно для доступа к ДОМ-елементам и хранения мутирующих значений

  useEffect(() => {
    //создаём экземпляр сокета, даём ему адрес сервера
    socketRef.current = io(window.location.origin, {
      path: '/api/',
      query: { roomId }
    });
    // отправляем событие добавления пользователя, с неймом и id юзера
    socketRef.current.emit('user:add', { username, userId });

    //получаем список юзеров и обновляем его
    socketRef.current.on('users', (users) => {
      setUsers(users);
    });

    //запрос на получение сообщений
    socketRef.current.emit('message:get');
    //обработка полученных сообщений
    socketRef.current.on('messages', (messages) => {
      //определяем какие сообщения были отправлены данным юзером и добавляем туда свойство "текущийЮзер: тру"
      const newMessages = messages.map((msg) =>
        msg.userId === userId ? { ...msg, currentUser: true } : msg
      );
      setMessages(newMessages);
    });

    return () => {
      //отключаем сокет, когда размонтируется компонент
      socketRef.current.disconnect();
    }
  }, [roomId, userId, username]);


  //функция для отправки сообщения
  const sendMessage = ({ messageText, senderName }) => {
    //добавляем в обьект ид пользователя при отправке на сервер
    socketRef.current.emit('message:add', {
      userId,
      messageText,
      senderName
    });
  }

  //функция для удаления сообщения по ид
  const removeMessage = (id) => {
    socketRef.current.emit('message:remove', id);
  }

  //отправляем событие для перевода юзера в оффлайн
  useBeforeUnload(() => {
    socketRef.current.emit('user:leave', userId);
  })

  //возвращаем всё для использования в компонентах
  return { users, messages, sendMessage, removeMessage }
}

import { Avatar, Typography } from 'antd';
import styled from 'styled-components';
import { formatRelative } from 'date-fns';

const WrapperStyled = styled.div`
  margin-bottom: 10px;
  .author {
    margin-left: 5px;
    font-weight: bold;
  }

  .date {
    margin-left: 10px;
    font-size: 11px;
  }

  .content {
    margin-left: 30px;  
  }
`;

function formatDate(seconds) {
  let formattedDate = '';

  if (seconds) {
    formattedDate = formatRelative(new Date(seconds * 1000), new Date());

    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  return formattedDate;
}

// isOwnMessage cái này chưa dùng thôi, nên mình sẽ không đề cập nhiều
// cái này là để đánh dấu xem message đó có phải là message của mình hay không
// nếu là của mình thì nằm bên phải, k phải của mình nằm bên trái

export default function Message({ text, displayName, createdAt, photoURL, type, isOwnMessage }) {
  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  return (
    <WrapperStyled >
      <div>
        <Avatar size='small' src={photoURL}>  
          {photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Typography.Text className='author'>{displayName}</Typography.Text>
        <Typography.Text className='date'>
          {formatDate(createdAt?.seconds)}
        </Typography.Text>
      </div>
      <div>
        {['sticker', 'gif'].includes(type) || isValidUrl(text) ? (
          <img src={text} alt="sticker" className='content' style={{ width: '100%', maxWidth: '150px', height: 'auto' }} />
        ) : (
          <Typography.Text className='content'>{text}</Typography.Text>
        )}
      </div>
    </WrapperStyled>
  );
}
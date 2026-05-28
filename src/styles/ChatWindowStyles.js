import Background from "@/assets/bg-chat.png";

import styled from "styled-components";

export const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px solid rgb(230, 230, 230);

  .header {
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &__title {
      margin: 0;
      font-weight: bold;
    }

    &__description {
      font-size: 12px;
    }
  }
`;

export const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
`;

export const WrapperStyled = styled.div`
  height: 100vh;
  position: relative;
  overflow: hidden;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url(${Background});
    background-size: cover;
    filter: blur(5px); // Adjust the blur value as needed
    z-index: -1;
  }
`;

export const ContentStyled = styled.div`
  height: calc(100% - 56px);
  display: flex;
  flex-direction: column;
  padding: 11px;
  justify-content: flex-end;
`;

export const FormStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 20px;
`;

export const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;
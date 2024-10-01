import styled from "styled-components";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;

  .form__title {
    font-size: 30px;
    margin-top: 88px;
    color: var(--violet-color);

    &--mt0 {
      margin-top: 0;
    }
  }

  .form__subtitle {
    margin-top: 20px;
    color: var(--text-color);
    font-weight: 400;
    font-size: 25px;
    margin-bottom: 12px;
    text-align: center;

    &--mt23 {
      margin-top: 23px;
    }
  }

  .form__label {
    font-size: 25px;
    color: var(--text-color);
    margin-left: 30px;
  }

  .form__wrapper {
    display: flex;
    flex-direction: column;
    margin-top: 35px;
    width: 590px;
    align-items: start;
  }

  .form__error {
    margin-top: 5px;
    color: red;
    font-size: 15px;
    font-weight: 400;
  }

  .form__input {
    border: 1px solid var(--violet-color);
    background-color: var(--grey-color);
    padding: 5px 10px;
    color: var(--text-color);
    width: 100%;
    height: 76px;
    font-size: 20px;
    margin-top: 5px;
  }

  .form__button {
    margin-top: 72px;
    background-color: var(--violet-color);
    color: var(--backgraund-color);
    font-size: 25px;
    font-weight: 400;
    padding: 18px 212px;
  }

  .form__link {
    margin-top: 21px;
    font-weight: 400;
    font-size: 25px;
    color: var(--text-color);

    &--violet {
      color: var(--violet-color);
    }
  }
`;

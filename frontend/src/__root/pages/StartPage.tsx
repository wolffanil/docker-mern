import styled from "styled-components";

function StartPage() {
  return (
    <Start>
      <StartP>Выберите, кому хотели написать</StartP>
    </Start>
  );
}

const Start = styled.div`
  height: 80%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StartP = styled.p`
  background-color: var(--grey-color);
  font-size: 25px;
  font-weight: 400;
  color: var(--text-color);
  padding: 10px 10px;
  border-radius: 10px;
`;

export default StartPage;

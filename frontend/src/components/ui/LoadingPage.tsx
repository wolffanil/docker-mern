import styled from "styled-components";

function LoadingPage() {
  return (
    <Loading>
      <p className="loading__p">Загрузка...</p>
    </Loading>
  );
}

const Loading = styled.div`
  height: 80%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .loading__p {
    font-size: 25px;
    font-weight: 400;
    color: var(--text-color);
  }
`;

export default LoadingPage;

import styled from "styled-components";

function PageNotFound() {
  return (
    <NotFound>
      <p className="notFound__p">Страница не найденна </p>
    </NotFound>
  );
}

const NotFound = styled.div`
  height: 80%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .notFound__p {
    font-size: 25px;
    font-weight: 400;
    color: var(--text-color);
  }
`;

export default PageNotFound;

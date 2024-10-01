import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { convertFileToUrl } from "../../libs/utils";
import styled from "styled-components";

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
};

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(convertFileToUrl(acceptedFiles[0]));
    },
    [file]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
  });

  return (
    <File {...getRootProps()}>
      <input {...getInputProps()} />

      {fileUrl ? (
        <>
          <FileImg src={fileUrl} alt="image" />
          <FileP>Нажмите или перетощите фото</FileP>
        </>
      ) : (
        <>
          <FileH3>Перетощите фото сюда</FileH3>

          <FileText>SVG, PNG, JPG</FileText>

          <FileButton>Выбрать с компютера</FileButton>
        </>
      )}
    </File>
  );
};

const File = styled.div`
  width: 100%;
  border: 1px solid var(--violet-color);
  background-color: var(--backgraund-color);
  height: 274px;
  margin-top: 63px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FileImg = styled.img`
  display: block;
  width: 80%;
  height: 80%;
  object-fit: cover;
`;

const FileP = styled.p`
  color: var(--text-color);
  font-size: 15px;
  font-weight: 400;
  margin-top: 20px;
`;

const FileH3 = styled.h3`
  color: var(--text-color);
  font-size: 15px;
  font-weight: 400;
`;

const FileText = styled.p`
  color: var(--text-color);
  font-size: 13px;
  font-weight: 400;
  margin-top: 20px;
`;

const FileButton = styled.button`
  color: var(--text-color);
  font-size: 20px;
  font-weight: 400;
  margin-top: 30px;
  padding: 10px 10px;
  background-color: var(--grey-color);
  border-radius: 15px;
`;

export default FileUploader;

import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { convertFileToUrl } from "../../libs/utils";
import styled from "styled-components";

type ProfileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
};

const ProfileUploader = ({ fieldChange, mediaUrl }: ProfileUploaderProps) => {
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
    <ProfileDiv {...getRootProps()}>
      <input {...getInputProps()} />

      <div className="profile">
        <img
          src={fileUrl || "/profile-placeholder.svg"}
          alt="image"
          className="profile__img"
        />
        <p className="profile__p">Изменить фотографию</p>
      </div>
    </ProfileDiv>
  );
};

const ProfileDiv = styled.div`
  input {
    cursor: pointer;
  }

  .profile {
    cursor: pointer;
    display: flex;
    gap: 33px;
    align-items: center;
    justify-content: center;
  }

  .profile__img {
    width: 163px;
    height: 163px;
    border-radius: 80px;
    object-fit: cover;
    object-position: top;
  }

  .profile__p {
    font-weight: 400;
    color: var(--violet-color);
    font-size: 45px;
    font-weight: 400;
  }
`;

export default ProfileUploader;

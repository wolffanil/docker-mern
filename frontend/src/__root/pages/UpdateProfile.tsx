import { useForm } from "react-hook-form";
import styled, { css } from "styled-components";
import { InputHTMLAttributes } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";

import ProfileUploader from "../../components/forms/ProfileUploader";
import { ProfileValidation } from "../../libs/validation";
import { useAuthContext } from "../../context/AuthContext";
import { useUpdateProfile } from "../../libs/react-query/reactQueriesAndMutations";
import { useNavigate } from "react-router-dom";
import { errorMessage } from "../../libs/errorMessage";

function UpdateProfile() {
  const { user, setUser } = useAuthContext();
  const { isPending: isUpdatingProfile, mutateAsync: updateProfile } =
    useUpdateProfile();
  const navigate = useNavigate();

  const {
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: [],
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    },
  });

  const handleUpdateProfile = async (
    value: z.infer<typeof ProfileValidation>
  ) => {
    const toastId = toast.loading("Загрузка...");

    const updatedProfile = await updateProfile(
      {
        name: value.name,
        bio: value.bio,
        file: value.file,
        username: value.username,
        imageUrl: user!.photoProfile,
      },
      {
        onError(message) {
          const messageError = errorMessage(message);
          if (messageError === null) return;

          toast.error(`Ошибка: ${messageError}`, { id: toastId });
          return;
        },
      }
    );

    if (!updatedProfile) {
      toast.error(`Произошла ошибка, пожалуйста попробуйте позже`, {
        id: toastId,
      });

      return;
    }

    toast.success("Профиль успешно обновился", {
      id: toastId,
    });

    setUser({
      id: user!.id,
      name: value.name,
      username: value.username,
      bio: value.bio,
      photoProfile: updatedProfile.photoProfile,
      isOnline: true,
      email: user!.email,
      createdAt: user!.createdAt,
    });

    return navigate(`/profile`);
  };

  return (
    <Form>
      <FormTitle>Редактировать профиль</FormTitle>

      <FormBlock onSubmit={handleSubmit(handleUpdateProfile)}>
        <ProfileUploader
          fieldChange={(file) => setValue("file", file)}
          mediaUrl={user?.photoProfile || ""}
        />
        {errors.file && errors.file.message && (
          <FormError>{errors.file.message}</FormError>
        )}

        <FormWrapper className="form__wrapper">
          <FormLabel>Имя</FormLabel>
          <FormInput
            type="text"
            {...register("name")}
            disabled={isUpdatingProfile}
          />

          {errors.name && errors.name.message && (
            <FormError>{errors.name.message}</FormError>
          )}
        </FormWrapper>

        <FormWrapper>
          <FormLabel>Ник</FormLabel>
          <FormInput
            type="text"
            {...register("username")}
            disabled={isUpdatingProfile}
          />

          {errors.username && errors.username.message && (
            <FormError>{errors.username.message}</FormError>
          )}
        </FormWrapper>

        <FormWrapper>
          <FormLabel>Описание</FormLabel>
          <FormTextArea
            {...register("bio")}
            disabled={isUpdatingProfile}
            cols={10}
          />

          {errors.bio && errors.bio.message && (
            <FormError>{errors.bio.message}</FormError>
          )}
        </FormWrapper>

        <FormButton
          className="form__button"
          type="submit"
          disabled={isUpdatingProfile}
        >
          Редактировать
        </FormButton>
      </FormBlock>
    </Form>
  );
}

const FormLabel = styled.label`
  font-size: 45px;
  font-weight: 400;
  margin-left: 45px;
  color: var(--text-color);
`;

const FormTitle = styled.h1`
  font-size: 45px;
  font-weight: 400;
  color: var(--violet-color);
  font-family: "redoctober";
`;

const FormBlock = styled.form`
  display: flex;
  flex-direction: column;
  align-items: start;
  margin-top: 44px;
  width: 100%;
`;

const FormInput = styled.input`
  width: 100%;
  height: 74px;
  padding: 10px 15px;
  font-size: 25px;
  background-color: var(--grey-color);
  margin-top: 5px;
  border-radius: 20px;
  margin-bottom: 10px;

  color: var(--text-color);
`;

const FormTextArea = styled.textarea`
  width: 100%;
  height: 214px;

  padding: 10px 15px;
  font-size: 25px;
  background-color: var(--grey-color);
  margin-top: 5px;
  border-radius: 20px;
  margin-bottom: 10px;
  color: var(--text-color);
  border: none;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
  margin-top: 50px;
`;

const Form = styled.div`
  max-width: 804px;
  display: flex;
  flex-direction: column;
  align-items: start;
`;

const FormError = styled.p`
  color: red;
  font-size: 25px;
  font-weight: 400;
`;

const FormButton = styled.button`
  background-color: var(--violet-color);
  padding: 32px 56px;
  border-radius: 20px;
  color: #212121;
  font-size: 45px;
  font-weight: 400;
  display: block;
  margin-left: auto;
  margin-top: 54px;
`;

export default UpdateProfile;

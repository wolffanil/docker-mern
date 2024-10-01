export const errorMessage = (message: string) => {
  const messageError = message.toString().split("Error: ")[1];

  if (messageError === "jwt expired") return null;

  return messageError;
};

import api from "../api/axios";

export const loginUser = async (data) => {

  return await api.post(
    "/auth/login",
    data,
    {
      headers: {
        "X-Api-Key":
          "mvc-api-secret-key-2026"
      }
    }
  );
};

export const registerUser = async (data) => {

  return await api.post(
    "/auth/register",
    data,
    {
      headers: {
        "X-Api-Key":
          "mvc-api-secret-key-2026"
      }
    }
  );
};
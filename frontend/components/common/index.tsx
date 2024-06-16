import Cookies from "js-cookie";
import JWT from "jsonwebtoken";
import { redirect } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

interface TokenInfo {
  id: number;
  active: number;
  avatar: string;
  userName: string;
}

export const getTokenFromClientSide = () => {
  try {
    const token = Cookies.get("token");
    return token;
  } catch (error) {
    return redirect("/Login");
  }
};

export const getInfoFromToken = () => {
  try {
    const token = getTokenFromClientSide();
    const response = JWT.decode(token as string);

    if (typeof response === "object" && response !== null) {
      // If the response is an object and not null, attempt to cast it to TokenInfo
      const tokenInfo = response as TokenInfo;
      return tokenInfo;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

export const getTokenServerSide = (context: any) => {
  try {
    const cookieString = context.req.headers.cookie;
    const token = cookieString
      .split(";")
      .find((cookie: any) => cookie.trim().startsWith("token="));
    const tokenValue = token.split("=")[1];
    return tokenValue;
  } catch (error) {
    return redirect("/Login");
  }
};

export const getInfoFromTokenServerSide = async (token: string) => {
  try {
    const response = JWT.decode(token as string);
    if (typeof response === "object" && response !== null) {
      const tokenInfo = response as TokenInfo;
      return tokenInfo;
    } else {
      return null;
    }
  } catch (error) {
    return redirect("/Login");
  }
};

export const POST = async (
  url: string,
  conditions?: object,
  token_server?: string
) => {
  try {
    type header = {
      "Content-Type": string;
      Authorization: string;
    };

    let headers: header = {
      "Content-Type": "application/json",
      Authorization: "",
    };
    const token = Cookies.get("token");
    if (!conditions) conditions = {};

    if (token)
      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
    if (token_server) {
      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token_server}`,
      };
    }
    return await axios({
      method: "post",
      url: `${process.env.NEXT_PUBLIC_DOMAIN_API}${url}`,
      data: JSON.stringify(conditions),
      headers,
    })
      .then(async (response) => {
        return response.data;
      })
      .catch((e) => {
        if (
          e?.response?.status == 401 ||
          e?.response?.status == 402 ||
          e?.response?.status == 403
        ) {
          Cookies.remove("token");
          window.location.href = "/";
        }
        if (e.response.data.message != "Missing token")
          toast(e.response.data.message);
        return {
          result: false,
        };
      });
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    return { result: false };
  }
};

export const POST_ADMIN = async (
  url: string,
  conditions?: object,
  token_server?: string
) => {
  try {
    type header = {
      "Content-Type": string;
      Authorization: string;
    };

    let headers: header = {
      "Content-Type": "application/json",
      Authorization: "",
    };
    const token = Cookies.get("token_admin");
    if (!conditions) conditions = {};

    if (token)
      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
    if (token_server) {
      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token_server}`,
      };
    }
    return await axios({
      method: "post",
      url: `${process.env.NEXT_PUBLIC_DOMAIN_API}${url}`,
      data: JSON.stringify(conditions),
      headers,
    })
      .then(async (response) => {
        return response.data;
      })
      .catch((e) => {
        if (
          e?.response?.status == 401 ||
          e?.response?.status == 402 ||
          e?.response?.status == 403
        ) {
          toast(e.response.data.message);
          window.location.href = "/Admin/Login";
        }
        if (e.response.data.message != "Missing token")
          toast(e.response.data.message);
        return {
          result: false,
        };
      });
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    return { result: false };
  }
};

export const POST_ADMIN_FORM = async (
  url: string,
  conditions?: object,
  token_server?: string
) => {
  try {
    const token = Cookies.get("token_admin");
    if (!conditions) conditions = {};
    return await axios({
      method: "post",
      url: `${process.env.NEXT_PUBLIC_DOMAIN_API}${url}`,
      data: conditions,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        return response.data;
      })
      .catch((e) => {
        if (
          e?.response?.status == 401 ||
          e?.response?.status == 402 ||
          e?.response?.status == 403
        ) {
          toast(e.response.data.message);
          return redirect("/Admin/Login");
        }
        if (e.response.data.message != "Missing token")
          toast(e.response.data.message);
        return {
          result: false,
        };
      });
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    return { result: false };
  }
};

export const POST_JSON = async (
  url: string,
  conditions: object,
  token_server?: string
) => {
  try {
    const token = Cookies.get("token");
    if (!conditions) conditions = {};
    return await axios({
      method: "post",
      url: `${process.env.NEXT_PUBLIC_DOMAIN_API}${url}`,
      data: conditions,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }).then(async (response) => {
      return response.data;
    });
  } catch (error) {
    return { result: false };
  }
};

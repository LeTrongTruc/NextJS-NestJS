"use client";
import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { useForm, SubmitHandler } from "react-hook-form";
import { POST, POST_ADMIN, POST_ADMIN_FORM } from "../common";
import { useMyContext } from "../context";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface props {
  isOpenModalLogin: boolean;
  setIsOpenModalLogin: React.Dispatch<React.SetStateAction<boolean>>;
  id?: string;
}
type Inputs = {
  username: string;
  pattern: any;
  message: string;
  birthday: string;
  phone: string;
  sex: string;
  status: string;
};
const App: React.FC<props> = ({
  isOpenModalLogin,
  setIsOpenModalLogin,
  id,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const { setInfoUser } = useMyContext();
  const [image, setImage] = useState();
  const [password, setPassword] = useState<number>();
  const [randomPassword, setRandomPassword] = useState(false);
  const queryClient = useQueryClient();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const response = await POST_ADMIN_FORM("/admin/updateInfoAdmin", {
      ...data,
      _id: id,
      file: image,
      password: randomPassword ? password : null,
    });
    if (response.result) {
      setInfoUser(response.data);
      toast("Cập nhật thông tin thành công");
      queryClient.invalidateQueries({ queryKey: ["listAdmin"] });
      setIsOpenModalLogin(false);
    }
  };

  const handleChangeFile = async (e: any) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const callApiDetailUser = async () => {
    if (id) {
      const data = await POST_ADMIN("/admin/detailAdmin", { id });
      if (data.result) {
        return data.data;
      }
    }
  };

  const query = useQuery({
    queryKey: ["detailUser"],
    queryFn: callApiDetailUser,
  });

  const generateOTP = () => {
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += Math.floor(Math.random() * 10);
    }
    setPassword(Number(result));
  };
  useEffect(() => {
    generateOTP();
  }, [isOpenModalLogin]);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["detailUser"] });
  }, [id]);

  const [selectedStatus, setSelectedStatus] = useState(
    query?.data?.status || "active"
  );

  const handleRadioChange = (event: any) => {
    setSelectedStatus(event.target.value);
  };

  useEffect(() => {
    if (query?.data?.status) {
      setSelectedStatus(query.data.status);
    }
  }, [query?.data?.status, id]);
  return (
    <>
      <Modal
        footer={null}
        open={isOpenModalLogin}
        onOk={() => setIsOpenModalLogin(false)}
        onCancel={() => setIsOpenModalLogin(false)}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex justify-center flex-col items-center"
        >
          <div className="text-2xl font-semibold">Update info admin</div>
          <div className="w-full">
            <div className="text-base">Username</div>
            <input
              type="text"
              className="p-2 w-full border outline-none"
              {...register("username", {
                required: "Name is required",
              })}
              defaultValue={query?.data?.username}
              aria-invalid={errors.username ? "true" : "false"}
            />
            {errors.username && (
              <p className="text-red-600">{errors.username.message}</p>
            )}

            <div className="text-base mt-3 ">Birthday</div>
            <input
              type="date"
              placeholder="Nhập vào password"
              className="p-2 w-full border outline-none"
              {...register("birthday", {
                required: "Birthday is required",
              })}
              defaultValue={query?.data?.birthday}
              aria-invalid={errors.birthday ? "true" : "false"}
            />
            {errors.birthday && (
              <p className="text-red-600">{errors.birthday.message}</p>
            )}

            <div className="text-base mt-3 ">Gender</div>
            <select
              id=""
              className="p-2 w-full border outline-none"
              {...register("sex")}
              defaultValue={query?.data?.sex}
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="khác">khác</option>
            </select>

            <div className="text-base mt-3 ">Phone</div>
            <input
              type="text"
              className="p-2 w-full border outline-none"
              {...register("phone", {
                required: "Phone is required",
                pattern: {
                  value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                  message: "Entered value does not match phone format",
                },
              })}
              defaultValue={query?.data?.phone}
              aria-invalid={errors.phone ? "true" : "false"}
            />
            {errors.phone && (
              <p className="text-red-600">{errors.phone.message}</p>
            )}

            <label
              className="block mb-2 mt-3 text-sm font-medium text-gray-900 dark:text-white"
              htmlFor="file_input"
            >
              Upload file
            </label>
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 p-3"
              id="file_input"
              type="file"
              onChange={handleChangeFile}
              defaultValue={query?.data?.avatar}
            />
            <div className="flex mt-3">
              <div className="text-base">Tạo lại mật khẩu</div>
              <input
                className="mt-1 ml-2"
                type="checkbox"
                name="block"
                value={"activeChangePass"}
                checked={randomPassword}
                onClick={() => setRandomPassword((item) => !item)}
              />
            </div>
            {randomPassword && (
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-white ">
                  Password
                </label>
                <input
                  type="text"
                  defaultValue={password}
                  disabled
                  id="password"
                  className="bg-gray-300  border border-gray-300 outline-none text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            )}
            {query?.data?.role !== "root" && (
              <>
                <div className="text-base mt-3 ">Block account</div>
                <div className="flex  items-center gap-5">
                  <div className="flex justify-center items-center">
                    <div>Block</div>
                    <input
                      className="mt-1 ml-2"
                      type="radio"
                      value={"block"}
                      checked={selectedStatus == "block"}
                      {...register("status")}
                      onClick={handleRadioChange}
                    />
                  </div>
                  <div className="flex justify-center items-center">
                    <div>Active</div>
                    <input
                      className="mt-1 ml-2"
                      type="radio"
                      value={"active"}
                      {...register("status")}
                      checked={selectedStatus == "active"}
                      onClick={handleRadioChange}
                    />
                  </div>
                </div>
              </>
            )}

            <button
              className=" mt-4 p-3 w-full bg-green-500  text-xl text-white"
              type="submit"
            >
              Update
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default App;

import React, { useContext } from "react";
import DoctorCard from "./DoctorCard";
import useFecthData from "../../hooks/useFecthData";
import Loading from "../Loader/Loading";
import Error from "../Error/Error";
import { BASE_URL } from "../../config";
import { authContext } from "../../context/AuthContext";

const DoctorList = () => {
  const { userData } = useContext(authContext);
  /*const {
    data: doctors,
    loading,
    error,
  } = useFecthData(
    `${BASE_URL}/doctors`,*/
  const { loading, error } = useFecthData(
    "http://localhost:5000/api/auth/doctors",
    {
      headers: { "Cache-Control": "no-cache" },
    }
  );
  return (
    <>
      {loading && <Loading />}
      {error && <Error />}
      {!loading && !error && (
        <div
          className="grid grid-cols-1 md:grid-cols-2
       lg:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px]
       lg:mt-[55px]"
        >
          {userData.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
      )}
    </>
  );
};

export default DoctorList;

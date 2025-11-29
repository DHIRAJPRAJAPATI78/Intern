import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyAdminOtp, resendAdminOtp } from "../../features/adminSlice";

const AdminVerifyOtp = ({ email }) => {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.admin);

  const [otp, setOtp] = useState("");

  const handleVerify = (e) => {
    e.preventDefault();
    dispatch(verifyAdminOtp({ email, otp }));
  };

  const handleResend = () => {
    dispatch(resendAdminOtp({ email }));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 rounded-lg text-white">
      <h2 className="text-2xl mb-4 font-semibold">Verify OTP</h2>
      <p>OTP has been sent to {email}</p>

      {loading && <p>Processing...</p>}
      {error && <p className="text-red-400">{error}</p>}
      {message && <p className="text-green-400">{message}</p>}

      <form onSubmit={handleVerify} className="flex flex-col gap-3 mt-3">
        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          className="p-2 rounded bg-gray-700"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-purple-600 p-2 rounded mt-2 disabled:bg-purple-400"
        >
          Verify OTP
        </button>
      </form>

      <button
        onClick={handleResend}
        className="mt-3 text-sm text-blue-400 underline"
      >
        Resend OTP
      </button>
    </div>
  );
};

export default AdminVerifyOtp;

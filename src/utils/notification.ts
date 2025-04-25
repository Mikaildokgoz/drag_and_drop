import { toast } from "react-toastify";

export const showNotification = (message: string) => {
	toast.success(message, {
		position: "top-right",
		autoClose: 2000,
		hideProgressBar: false,
		closeButton: false,
	});
};

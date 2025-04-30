import { useSelector, useDispatch } from "react-redux";
import { sendProjectView, sendPropertyView } from "../Redux/Slices/propertySlice";

export const useViewsCount = () => {
  const { Id } = useSelector((state) => state.auth.userDetails || {});
  const bearerToken = useSelector((state) => state.auth.bearerToken);
  const dispatch = useDispatch();

  const fetchPropertyViews = (propertyID) => {
    if (!propertyID || !Id || !bearerToken) return;
    dispatch(sendPropertyView({ PropertyID: Number(propertyID), UserID: Id, bearerToken }));
  };

  const fetchProjectViews = (ProjectID) => {
    if (!ProjectID || !Id || !bearerToken) return;
    dispatch(sendProjectView({ ProjectID: Number(ProjectID), UserID: Id, bearerToken }));
  };

  return { fetchPropertyViews, fetchProjectViews };
};

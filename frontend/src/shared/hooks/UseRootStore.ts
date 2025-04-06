import { useContext } from "react";
import RootStore from "../store/store";

const useRootStore = () => useContext(RootStore);

export default useRootStore;

import { useThemeStore } from "../store/useThemeStore";

const PageLoader = () => {
  const { theme } = useThemeStore();
  return (
    <div
      className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"
      data-theme={theme}
    ></div>
  );
};

export default PageLoader;

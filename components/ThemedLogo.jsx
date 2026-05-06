import { Image, useColorScheme } from "react-native";

import TempLogo from "../assets/img/temp_logo.png";

const ThemedLogo = ({ style, ...props }) => {
  const colorScheme = useColorScheme();

  // const logo = colorScheme === "dark" ? DarkLogo : LightLogo;

  return <Image source={TempLogo} style={style} {...props} />;
};

export default ThemedLogo;
